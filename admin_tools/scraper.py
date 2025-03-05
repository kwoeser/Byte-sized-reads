import os
import requests
from readabilipy import simple_json_from_html_string
from urllib.parse import urlparse

filepath = os.path.join(r"C:\Users\sellis12\VSCode\BossModeP2\admin_tools", "articles.txt")

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
    