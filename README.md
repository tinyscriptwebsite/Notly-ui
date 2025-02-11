# Project Setup Instruction

## Project Name : Notly

Prerequisites:

Before you begin, ensure you have the following installed:
Node.js (version 18.x or higher recommended)
npm (comes bundled with Node.js)

## Setup Instructions

Follow these steps to set up the project locally:

1.Clone the repository
git clone https://github.com/tinyscriptwebsite/Notly-ui.git
cd Notly-ui

2.Install dependencies:
npm install

3.Set up environment variables
For Backend :Create a .env file in the root directory and add the necessary environment variables.
For Frontend :Create a .env.local file in the root directory and add the necessary environment variables as mention in step 4.

4.Edit the .env file with your configuration:

_For Backend environment variable_
NODE_ENV=dev
PORT=5000
MONGOOSE_URL=ADDYOURMONGOOSEURL
ACCESS_TOKEN=ADDYOURACCESSTOKEN
ACCESS_TOKEN_EXP=1d

_For Frontend environment variable_
NODE_ENV=development
BASE_URL_DEV=http://localhost:5000

5.Run the application
Start the development server(Backend): npm run dev
Start the development server(Frontend): npm run dev

# API Documentation

1. # Register User :Registers a new user in the system.

API-Endpoint : POST /api/v1/auth/register

Request Body
Field Type Required Description
name String Yes Full name of the user.
email String Yes Email address of the user.
password String Yes Password for the user account.

Example Request

{
"name": "John Doe",
"email": "john.doe@example.com",
"password": "password123"
}

Responses : 201 Created User registered successfully

Response Body:

{
"statusCode": 201,
"data": {
"\_id": "64f1a2b3c8e9f0a1b2c3d4e5",
"name": "John Doe",
"email": "john.doe@example.com"
},
"message": "User registered successfully"
}

400 Bad Request
User already exists.

{
"statusCode": 400,
"message": "User already exists"
}

500 Internal Server Error : Server error during registration.
Response Body:
{
"statusCode": 500,
"message": "Internal Server Error"
}

2. # Login User
   Authenticates a user and returns an access token.

Endpoint : POST /api/v1/auth/login

Request Body
Field Type Required Description
email String Yes Email address of the user.
password String Yes Password for the user account.

Example Request:

{
"email": "john.doe@example.com",
"password": "password123"
}

Responses : 200 OK
Login successful. Returns an access token and user details.

Response Body:
{
"statusCode": 200,
"data": {
"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"\_id": "64f1a2b3c8e9f0a1b2c3d4e5",
"name": "John Doe",
"email": "john.doe@example.com"
}
},
"message": "Login successful"
}

404 Not Found User not found.

Response Body:
{
"statusCode": 404,
"message": "User not found"
}

401 Unauthorized : Invalid credentials.

Response Body:
{
"statusCode": 401,
"message": "Invalid credentials"
}

500 Internal Server Error : Server error during login.

Response Body:
{
"statusCode": 500,
"message": "Internal Server Error"
}

3. Error Responses
   All endpoints return consistent error responses in the following format:
   {
   "statusCode": <HTTP_STATUS_CODE>,
   "message": "<ERROR_MESSAGE>"
   }

4. Authentication
   The login endpoint returns an access token in the response body and as a cookie.

The access token must be included in the Authorization header for protected routes:

Authorization: Bearer <accessToken>

5. Example Usage

Register User

POST http://localhost:5000/api/v1/auth/register \
-H "Content-Type: application/json" \
-d '{
"name": "John Doe",
"email": "john.doe@example.com",
"password": "password123"
}'

Login User

POST http://localhost:5000/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{
"email": "john.doe@example.com",
"password": "password123"
}'

3. # Get Dashboard API
   Retrieves the user's dashboard information, including user details and a list of notebooks created by the user.

API Endpoint: GET /api/v1/dashboard

Authentication Type: Bearer Token

Header: Authorization: Bearer <accessToken>

Description: The user must be authenticated to access this endpoint. The access token is obtained during login.

Responses : 200 OK Dashboard data retrieved successfully.

Response Body:
{
"statusCode": 200,
"data": {
"user": {
"\_id": "64f1a2b3c8e9f0a1b2c3d4e5",
"name": "John Doe",
"email": "john.doe@example.com"
},
"notebooks": [
{
"_id": "64f1a2b3c8e9f0a1b2c3d4e6",
"title": "My First Notebook",
"createdBy": "64f1a2b3c8e9f0a1b2c3d4e5",
"updatedAt": "2023-09-01T12:00:00.000Z"
},
{
"_id": "64f1a2b3c8e9f0a1b2c3d4e7",
"title": "My Second Notebook",
"createdBy": "64f1a2b3c8e9f0a1b2c3d4e5",
"updatedAt": "2023-09-02T12:00:00.000Z"
}
]
},
"message": "Dashboard data retrieved successfully"
}

404 Not Found : User not found.

Response Body:
{
"statusCode": 404,
"message": "User not found"
}

401 Unauthorized : User is not authenticated.
Response Body:
{
"statusCode": 401,
"message": "Unauthorized"
}

500 Internal Server Error : Server error while fetching dashboard data.

Response Body:
{
"statusCode": 500,
"message": "Internal Server Error"
}

Example Usage

curl -X GET http://localhost:5000/api/v1/dashboard \
-H "Authorization: Bearer <accessToken>"

Response

{
"statusCode": 200,
"data": {
"user": {
"\_id": "64f1a2b3c8e9f0a1b2c3d4e5",
"name": "John Doe",
"email": "john.doe@example.com"
},
"notebooks": [
{
"_id": "64f1a2b3c8e9f0a1b2c3d4e6",
"title": "My First Notebook",
"createdBy": "64f1a2b3c8e9f0a1b2c3d4e5",
"updatedAt": "2023-09-01T12:00:00.000Z"
},
{
"_id": "64f1a2b3c8e9f0a1b2c3d4e7",
"title": "My Second Notebook",
"createdBy": "64f1a2b3c8e9f0a1b2c3d4e5",
"updatedAt": "2023-09-02T12:00:00.000Z"
}
]
},
"message": "Dashboard data retrieved successfully"
}

# 4.Save Notebook

Creates a new notebook for the authenticated user.

API Endpoint: POST /api/v1/notebooks

## Authentication

Type: Bearer Token
Header: Authorization: Bearer <accessToken>
Description: The user must be authenticated to access this endpoint. The access token is obtained during login.

Request Body:
Field Type Required Description
type String Yes Type of the notebook (e.g., "text", "code").
title String No Title of the notebook.
content String Yes Content of the notebook.

Example Request

{
"type": "text",
"title": "My Notebook",
"content": "This is the content of my notebook."
}

Responses : 200 OK Notebook saved successfully.

Response Body:
{
"statusCode": 200,
"data": null,
"message": "Notebook saved successfully"
}

401 Unauthorized : User is not authenticated.

Response Body:
{
"statusCode": 401,
"message": "Unauthorized"
}

500 Internal Server Error : Server error while saving the notebook.

Response Body:

{
"statusCode": 500,
"message": "Internal Server Error"
}

# 5.Get Notebook

Retrieves a notebook by its ID.

APIEndpoint :GET /api/v1/notebooks/:id

## Authentication

Type: Bearer Token
Header: Authorization: Bearer <accessToken>
Description: The user must be authenticated to access this endpoint.

## Path Parameters

Field Type Required Description
id String Yes ID of the notebook to retrieve.

Responses : 200 OK Notebook fetched successfully.

Response Body:
{
"statusCode": 200,
"data": {
"\_id": "64f1a2b3c8e9f0a1b2c3d4e6",
"type": "text",
"title": "My Notebook",
"content": "This is the content of my notebook.",
"createdBy": "64f1a2b3c8e9f0a1b2c3d4e5",
"createdAt": "2023-09-01T12:00:00.000Z",
"updatedAt": "2023-09-01T12:00:00.000Z"
},
"message": "Notebook fetched successfully"
}

404 Not Found : Notebook not found.

Response Body:
{
"statusCode": 404,
"message": "Notebook not found"
}

401 Unauthorized : User is not authenticated.

Response Body:  
{
"statusCode": 401,
"message": "Unauthorized"
}

500 Internal Server Error : Server error while fetching the notebook.

Response Body:
{
"statusCode": 500,
"message": "Internal Server Error"
}

6. # Delete Notebook
   Deletes a notebook by its ID.

API Endpoint: DELETE /api/v1/notebooks/:id

## Authentication

Type: Bearer Token
Header: Authorization: Bearer <accessToken>
Description: The user must be authenticated to access this endpoint.

## Path Parameters

Field Type Required Description
id String Yes ID of the notebook to delete.

Responses :200 OK Notebook deleted successfully.

Response Body:
{
"statusCode": 200,
"data": null,
"message": "Notebook deleted successfully"
}

404 Not Found : Notebook not found.

Response Body:
{
"statusCode": 404,
"message": "Notebook not found"
}

401 Unauthorized :User is not authenticated.

Response Body:
{
"statusCode": 401,
"message": "Unauthorized"
}

500 Internal Server Error : Server error while deleting the notebook.

Response Body:
{
"statusCode": 500,
"message": "Internal Server Error"
}

7. # Update Notebook
   Updates an existing notebook by its ID.

API Endpoint : PUT /api/v1/notebooks/:id

## Authentication:

Type: Bearer Token
Header: Authorization: Bearer <accessToken>
Description: The user must be authenticated to access this endpoint.

## Path Parameters:

Field Type Required Description
id String Yes ID of the notebook to update.

## Request Body

Field Type Required Description
type String Yes Type of the notebook (e.g., "text", "code").
title String Yes Title of the notebook.
content String Yes Content of the notebook.

Example Request

{
"type": "text",
"title": "Updated Notebook",
"content": "This is the updated content of my notebook."
}

Responses : 200 OK Notebook updated successfully.

Response Body:
{
"statusCode": 200,
"data": null,
"message": "Notebook saved successfully"
}

404 Not Found : Notebook not found.

Response Body:
{
"statusCode": 404,
"message": "Notebook not found"
}

401 Unauthorized : User is not authenticated.

Response Body:
{
"statusCode": 401,
"message": "Unauthorized"
}

500 Internal Server Error :Server error while updating the notebook.

Response Body:
{
"statusCode": 500,
"message": "Internal Server Error"
}
