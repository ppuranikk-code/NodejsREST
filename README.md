Node.js REST API with Firebase Realtime Database
This project is a simple REST API built using Node.js and Express. It connects to Firebase Realtime Database and provides CRUD operations for Users, Income, and Expenses.
Technologies Used
- Node.js
- Express.js
- Firebase Realtime Database
- dotenv

Installation Steps
1. Clone the repository from GitHub
2. Open the project folder
3. Run: npm install
4. Create a .env file in the root directory

Environment Variables
The project requires Firebase credentials stored in a `.env` file. This file is listed in `.gitignore` and is not included in the repository.
Running the App
Run the application using:

npm start

Server runs on http://localhost:4000
API Endpoints
GET /users
POST /users
PUT /users/:id
DELETE /users/:id

GET /income
POST /income
PUT /income/:id
DELETE /income/:id

GET /expenses
POST /expenses
PUT /expenses/:id
DELETE /expenses/:id

Testing the API with Thunder Client
This project uses Thunder Client (a lightweight REST API client extension for Visual Studio Code) to test all API endpoints.
How to Use Thunder Client

Open Visual Studio Code

Install Thunder Client from the Extensions Marketplace (if not already installed)

Start the server:

npm start


Open Thunder Client from the VS Code sidebar

Create a new request and use the following base URL:

http://localhost:4000
