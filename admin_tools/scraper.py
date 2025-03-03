import requests
from readabilipy import simple_json_from_html_string

test = "https://www.propublica.org/article/texas-abortion-ban-sepsis-maternal-mortality-analysis"

req = requests.get(test)
article = simple_json_from_html_string(req.text, use_readability=False)

print(article.title)