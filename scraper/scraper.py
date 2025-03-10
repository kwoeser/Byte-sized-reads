import os
import requests
from readabilipy import simple_json_from_html_string
from urllib.parse import urlparse
import psycopg2
import time
import signal
import sys
import getpass
import uuid

DB_URL = os.getenv("DATABASE_URL")
#Kill swtich
running = True
password = "confirm"

filepath = os.path.join(r"C:\Users\sellis12\VSCode\BossModeP2\admin_tools", "articles.txt")


def kill(sig, frame):
    global running
    pword = getpass.getpass("Enter Password: ")
    if pword == password:
        print("Terminated scraper")
        running = False
    else:
        print("Incorrect")

signal.signal(signal.SIGINT, kill)

def db_connect():
    """Connect to Progres Database"""
    try:
        conn = psycopg2.connect(DB_URL)
        return conn
    except psycopg2.Error as e:
        print(f"Error connecting to database: {e}")
        return None
    

def scrape_article(submission_id, url, category):
    """Scrape an approved article and store in Progres"""
    try:
        req = requests.get(url)
        req.raise_for_status()
        article = simple_json_from_html_string(req.text, use_readability=False)
        
        word_count = len(article['plain_content'].split())
        site_name = urlparse(url).netloc

        conn = db_connect()
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute("INSERT INTO article (id, created_at, updated_at, url, site_name, title, excerpt, word_count, category) VALUES (%s, current_timestamp, current_timestamp, %s, %s, %s, '', %s, %s)",
                            (str(uuid.uuid4()), url, site_name, article['title'], word_count, category,))
                cursor.execute("UPDATE submission SET scraped = true WHERE id = %s", (submission_id,))
                conn.commit()
                print(f"Article scraped: {url}")
            except psycopg2.Error as e:
                print(f"Error scraping: {e}")
                conn.rollback()
            finally:
                cursor.close()
                conn.close()
    
        else:
            print(f"Cannot Scrape Article {url}")
    
    except Exception as e:
        print(f"Error fetching: {e}")

        # set scraped to true anyway so we don't redo it
        conn = db_connect()
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute("UPDATE submission SET scraped = true WHERE id = %s", (submission_id,))
                conn.commit()
            finally:
                cursor.close()
                conn.close()


def ao_loop():
    """Create an always on loop"""
    print("Scraper starting...")
    
    global running
    while running:
        conn = db_connect()
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute("SELECT id, url, category FROM submission WHERE moderation_status = %s AND scraped = %s", ("approved", False))
                rows = cursor.fetchall()

                if rows:
                    for submission_id, url, category in rows:
                        if not running:
                            break
                        scrape_article(submission_id, url, category)

                else:
                    if running:
                        print("No articles, Sleeping... ")
                        time.sleep(30)

            except psycopg2.Error as e:
                if running:
                    print(f"Error calling loop: {e}") 
            finally:
                if conn:
                    cursor.close()
                    conn.close()
            
        else:
            if running:
                print("Database connection failure, Sleeping... ")
                time.sleep(30)
        
    print("Scraper Killed")


def test_articles():
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as file:
            lines = file.readlines()

        urls = []
        for i in range(0, len(lines), 2):
            urls.append(lines[i].strip())

        for url in urls[0:1]:
            parsed_url = urlparse(url)
            if parsed_url.scheme and parsed_url.netloc:
                try:
                    req = requests.get(url)
                    req.raise_for_status()
                    article = simple_json_from_html_string(req.text, use_readability=False)
                    print(article)

                    if article and 'title' in article:
                        print(f"Title from {url}: {article['title']}")
                    else:
                        print(f"Could not extract title from {url}")

                except requests.exceptions.RequestException as e:
                    print(f"Error fetching {url}: {e}")
                except Exception as e:
                    print(f"An unexpected error occurred processing {url}: {e}")
            else:
                print(f"Invalid URL found: {url}")

    else:
        print(f"Error: File not found at {filepath}")


if __name__ == "__main__":
    ao_loop()
    