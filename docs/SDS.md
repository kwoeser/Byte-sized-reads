# Software Development Specification

## Overview
ByteSized Reads is a web-based application and is organized in a client-server architecture. A web frontend allows end users to interact with the backend to use the server. The backend includes a database, API server, and scraping system to provide the system’s functionality. Additional tools are exposed via the web frontend for data curation and other moderation tasks.

## Architecture

Components:
- Web frontend: Web application for end users and moderators. Interacts with the API server to fetch and modify data. We plan to use React and Typescript.
- Web server: Serves the web frontend.
- API server: Provides a web API for the frontend. Implements system functionality by querying and modifying the database to handle user requests. We plan to use Node.js and Typescript.
- Database: Main store for application data, including users, indexed content, and other supporting data. We plan to use Postgres.
- Scraping system: Scrapes articles and interacts with the API server to update the database. We plan to use Python.

We chose the client-server model as it’s standard and somewhat required for web applications. We plan to use React and Typescript to develop the web frontend since they are well-established for web development, and build on the Javascript ecosystem which is almost universal on the web. The backend is split into multiple parts to facilitate parallel development and compartmentalization. We plan to use Postgres for our database as our data is mostly relational and Postgres is a tried-and-tested option for our team and in general. We plan to use Typescript for the API server due to familiarity and to reduce the number of languages across the project. Some parts of the backend may use Python when appropriate since the team is familiar with it.
