# Machinery App

This repository contains a full-stack application with a React/Next.js frontend and an Express.js backend. The application demonstrates a simple product management system.

## Frontend

The frontend is built using Next.js and Material-UI. It provides a user interface for viewing, creating, and editing products.

### Features

- View a list of products
- Create new products
- Edit existing products
- Publish changes to products

## Backend

The backend is built using Express.js and connects to a PostgreSQL database. It provides RESTful APIs for managing products.

### Features

- CRUD operations for products
- Publish changes to products
- Validation for product data

## Running the Application with Docker

Both the frontend and backend can be run using Docker. The application also uses a PostgreSQL database, which is run as a separate Docker container.

### Prerequisites

- Docker
- Docker Compose

### Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/ncesar/machinery-app.git
   cd machinery-app
   ```

2. Build and run the Docker containers:

   ```bash
   docker-compose up --build
   ```

   This command will build the Docker images for the frontend, backend, and database, and start the containers.

3. Access the application:

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:1337](http://localhost:1337)

4. To stop the application, press `Ctrl+C` in the terminal where the containers are running.

## License

This project is licensed under the MIT License.