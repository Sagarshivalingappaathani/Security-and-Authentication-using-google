# Security and Authentication using Google

## Elevate Security with Hashing and Salting

Welcome to our Authentication Project, a bastion of secure user authentication powered by Express.js, Passport.js, and MongoDB. Fortified with hashing and salting techniques, this Node.js masterpiece ensures your online safety. Whether you prefer traditional local authentication (username/password) or the effortless charm of Google OAuth2.0, this project is your gateway to a secure, hassle-free, and unbreakable login experience.

### Features at a Glance

- **Local Authentication:** Create and access your account with a traditional username and password, fortified with rock-solid hashing and salting.
- **Google OAuth2.0:** Simplify your login experience by using your Google account.
- **Session Management:** Your sessions are in good hands with Express-session.
- **Data Storage:** MongoDB stores your user data reliably.
- **Secrets Unleashed:** Share and explore secrets with confidence.


## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine
- MongoDB running locally or accessible via a connection string
- Google Developer Console credentials for OAuth2.0 (client ID and client secret)

## Installation

1. **Clone the repository:**

   ```
   git clone https://github.com/Sagarshivalingappaathani/Security-and-Authentication-using-google-Project4.git
   ```
2. **Change Directory:**

   ```
   cd Security-and-Authentication-using-google-Project4
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



   


