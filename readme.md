# Garuda Caching

Garuda Caching is a service designed to handle API monitoring and caching using Redis and RabbitMQ. This README provides an overview of the project, its features, API documentation, and contribution guidelines.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Service](#running-the-service)
- [API Documentation](#api-documentation)
  - [Configure API Monitoring](#configure-api-monitoring)
  - [Monitor API](#monitor-api)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

## Features

- API monitoring configuration
- Redis caching for API monitoring status
- RabbitMQ for message queuing
- Express.js for handling HTTP requests
- MongoDB for database operations

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/garuda-caching.git
    cd garuda-caching
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```properties
    DB_CONNECTION_STRING=
    PORT=
    JWT_EXPIRY=
    JWT_SECRET=
    COOKIE_TIME=
    EMAIL_FROM=
    EMAIL_AUTH_TOKEN=
    RABBITMQ_URL=
    GARUDA_API=
    REDIS_HOST=
    REDIS_PORT=
    ```

## Configuration

Ensure that your MongoDB, Redis, and RabbitMQ services are running and accessible using the connection strings provided in the `.env` file.

## Running the Service

Start the service using the following command:
```sh
npm start
```

The service will be available at `http://localhost:5095`.

## API Documentation

### Configure API Monitoring

**Endpoint:** `/api/v1/config`

**Method:** `POST`

**Description:** Configure API monitoring status in the cache.

**Request Body:**
```json
{
  "apiPath": "/your/api/path",
  "projectId": "yourProjectId",
  "isMonitoring": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "API Monitoring is set in cache"
}
```

### Monitor API

**Endpoint:** `/api/v1/cache/monitorapi`

**Method:** `POST`

**Description:** Record an API hit and publish it to the RabbitMQ queue.

**Request Body:**
```json
{
  "path": "/your/api/path",
  "method": "GET",
  "projectId": "yourProjectId"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Hit Recorded!"
}
```

## Contribution Guidelines

We welcome contributions to improve Garuda Caching. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear and concise messages.
4. Push your changes to your forked repository.
5. Create a pull request to the main repository.

## License

This project is licensed under the ISC License.
