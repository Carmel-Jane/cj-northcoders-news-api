# Northcoders News API
Link to hosted version: 
https://cj-northcoders-news-api.onrender.com
## Project Summary
This is an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.
## Instructions for Getting Started & Installation
### Prerequisites
Postgres and Node are required to run this API 
For Postrgres: https://www.postgresql.org/download/ 
For Node: https://nodejs.org/en/download/
### Installation
1. Clone a copy of the repo from https://github.com/Carmel-Jane/cj-northcoders-news-api with the command `git clone https://github.com/Carmel-Jane/cj-northcoders-news-api`
2. Install the required dependencies with the command `npm install`
3. Set up the database by running the script `npm run setup-dbs`
4. Seed the database with the initial set of data by running `npm run seed`
5. To run the tests that were used whilst building the API, run the command `npm test`
### Creating .env files
Since the .env files are git ignored, the user must create their own .env files to create the neccessary environment variables. 
Create .env.test and .env.development files. In both of these files add 'PGDATABASE= <correctDataBaseName>. The correct names are in /db/setup.sql. 
Make sure the .env file names are added to the .gitignore file
By adding the .env.development and .env.test, the user can successfully connect to the two databases locally.
## Minimum Version Requirements
Node.js : v21.6.1 PostgreSQL: v14.10