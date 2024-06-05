
# Chat Application

This project is a real-time chat application built using Node.js, Vue.js, and Socket.IO. It includes features such as user authentication, room-based chat, direct messaging, and rate limiting.

## Development Environment Setup

To set up the development environment, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/R1NZLER15/challenge_chat.git
   cd challenge_chat
   ```

2. **Install dependencies for the backend:**

   ```bash
   cd backend
   npm install
   ```

3. **Install dependencies for the frontend:**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the development servers:**

   Open two terminal windows or tabs.

   In the first terminal, start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

   In the second terminal, start the frontend server:

   ```bash
   cd frontend
   npm run dev
   ```

## Running the Project with Docker

To run the project using Docker, follow these steps:

1. **Ensure Docker is installed on your machine.**

   You can download and install Docker from [here](https://www.docker.com/products/docker-desktop).

2. **Navigate to the project root directory:**

   ```bash
   cd challenge_chat
   ```

3. **Create a `.env` file in the project root directory with the following content:**

   ```env
   NODE_ENV=development
   MONGO_URI=mongodb://mongo:27017/chat
   SESSION_SECRET="your-session-secret"
   JWT_SECRET="your-jwt-secret"
   ADMIN_USERNAME="admin"
   ADMIN_PASSWORD="adminAccess1234"
   CLIENT_URL=http://localhost:8090
   ```

4. **Build and start the Docker containers:**

   ```bash
   docker-compose up --build
   ```

   This command will build the Docker images and start the containers for the backend, frontend, and MongoDB.

5. **Access the application:**

   Open your web browser and go to [http://localhost:8090](http://localhost:8090) to access the frontend of the chat application.

## Notes

- The backend server will run on port `3000` and the frontend server will run on port `8090`.
- The MongoDB database will run on port `27017`.
- Make sure to replace `"your-session-secret"` and `"your-jwt-secret"` with your actual secret values.
- The default admin credentials are set in the `.env` file. Make sure to change these in a production environment.

## Troubleshooting

If you encounter any issues while running the project, ensure that:

- Docker is running on your machine.
- The `.env` file is correctly configured.
- Ports `3000`, `8090`, and `27017` are not being used by other applications.

## License

This project is licensed under the MIT License.