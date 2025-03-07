import os
import requests
from readabilipy import simple_json_from_html_string
from urllib.parse import urlparse
import psycopg2
import time

DB_URL = "postgres://postgres:G6NnIXtBWhhlT9v@137.66.20.78:5432/project"
filepath = os.path.join(r"C:\Users\sellis12\VSCode\BossModeP2\admin_tools", "articles.txt")


def db_connect():
    """Connect to Progres Database"""
    try:
        conn = psycopg2.connect(DB_URL)
        return conn
    except psycopg2.Error as e:
        print(f"Error connecting to database: {e}")
        return None
    
def scrape_article(id, url):
    """Scrape an approved article and store in Progres"""
    try:
        req = requests.get(url)
        req.raise_for_status()
        article = simple_json_from_html_string(req.text, use_readability=False)

        if article and 'title' in article and 'content' in article:
            conn = db_connect()
            if conn:
                try:
                    cursor = conn.cursor()
                    cursor.execute("INSERT INTO articles (title, content, url) VALUES (%s, %s, %s)",
                                (article['title'], article['content'], url),)
                    cursor.execute("UPDATE submissions SET scraped = %s WHERE id = %s", (True, submission_id))
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
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {e}")


def ao_loop():
    """Create an always on loop"""
    while True:
        conn = db_connect()
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute("SELECT id, url FROM submissions WHERE moderation_status = %s AND scraped = %s", ("approved", False))
                rows = cursor.fetchall()

                if rows:
                    for id, url in rows:
                        scrape_article(id, url)

                else:
                    print("No articles, Sleeping... ")
                    time.sleep(30)

            except psycopg2.Error as e:
                print(f"Error calling loop: {e}") 
            finally:
                cursor.close()
                conn.close()
            
        else:
            print("Database connection failure, Sleeping... ")
            time.sleep(30)
    



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
    