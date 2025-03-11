# ByteSized Reads

ByteSized Reads is a web application that provides personalized article recommendations to users.

## Installation Instructions

Installing the application:

* Install Docker and Docker Compose following the official instructions for your operating system.
    * [Docker Compose Installation](https://docs.docker.com/compose/install/)
    * [Docker Desktop Installation](https://docs.docker.com/desktop/)
* Clone the repository.
* Run `docker-compose build` to build the Docker container images.
* Run `docker-compose up` to start the application.
* Navigate to `http://localhost:5173` to access the frontend.

Setting up the application:

* Register an account.
    * Use the username `admin` to automatically receive moderator status on your user account.
    * Alternatively, you can connect to the Postgres database using `psql` or another graphical SQL client,
      then run `UPDATE public.user SET moderator=true WHERE username='yourusername';` to set your account as a moderator.
* Navigate to `http://localhost:5173/submit` and submit some articles by entering a URL and choosing a category.
    * A list of test articles can be found in `test_articles.txt`.
    * This will usually be done by end users of the application.
* Log in to a moderator account and navigate to `http://localhost:5173/ModeratorPage`.
* Mark some articles as approved.
* Wait until the scraper container scrapes the articles and updates the database.
    * The container will print its status as it works. It checks for new approved articles to scrape every 30s.

Using the application:

* Navigate to `http://localhost:5173`.
* Browse articles.
* Use the filters in the navbar to filter by category or reading length.
* Sign in to bookmark articles or mark them as read.

## Authors

Hazel Pinit, An Mai, Alen Wilson, Sam Ellis, Karma Woeser, Jason Webster
