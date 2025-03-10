# Python image
FROM python:3.12

# Install requirements
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy scraper
COPY scraper.py .

# Pass -u to force stdout/stderr to be unbuffered and print properly in docker
CMD ["python", "-u", "./scraper.py"] 
