# Authentication Project

## Overview

This Node.js project demonstrates user authentication using Express.js, Passport.js, and MongoDB. It supports both local authentication (username/password) and Google OAuth2.0 for user login.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine
- MongoDB running locally or accessible via a connection string
- Google Developer Console credentials for OAuth2.0 (client ID and client secret)

## Installation

1. **Clone the repository:**

   ```
   git clone https://github.com/yourusername/yourproject.git
   ```
2. **Change Directory:**

   ```
   cd yourproject
   ```
3. **Install project dependencies:**

   ```
    npm install
   ```
4. **Create a .env file in the project root and add your environment variables:**

   ```
   CLIENT_ID=your_google_client_id
   CLIENT_SECRET=your_google_client_secret
   ```
5. **Start the application:**

   ```
   node app.js
   ```

## Usage

1. Visit `http://localhost:3000` in your web browser to access the application.
2. You can register a new account or log in using your Google account.
3. Once logged in, you can submit and view secrets.

## Features

- User registration and login with local authentication (username/password)
- User login with Google OAuth2.0
- User sessions managed with Express-session
- MongoDB database for storing user data
- User secrets submission and viewing

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please create a GitHub issue or submit a pull request.

## Acknowledgments

- Thanks to the creators of Express.js, Passport.js, and Mongoose for their fantastic libraries.
- Inspiration for this project comes from various online tutorials and documentation.



   


