# EthioRate — Ethiopian Local Business Review & Discovery Platform

EthioRate is a web-based platform for discovering, reviewing, and rating local businesses and services in Ethiopia. The platform is designed to help customers make informed decisions through community-generated reviews while giving business owners an online presence where they can manage their businesses and receive customer feedback.

The initial focus is on businesses and services in **Addis Ababa**, with the possibility of expanding to other Ethiopian cities.

## Features

### 👤 Customer Features

* User registration and login
* JWT-based authentication
* Browse local businesses
* Search businesses
* Filter businesses by category and city
* View business details
* Rate businesses using a five-star rating system
* Write reviews
* View customer reviews
* Mark businesses for future discovery

### 🏢 Business Owner Features

* Register as a business owner
* Login as a business owner
* Register a business
* Associate a business with its owner
* Add business information
* Add address and city
* Add phone number
* Add website
* Add Google Maps link
* View business information

### 🛡️ Admin Features

The platform is designed to support:

* User management
* Business management
* Business verification
* Review moderation
* Report management
* Category management

## Technology Stack

### Frontend

* React
* TanStack Start
* TanStack Router
* TypeScript
* Tailwind CSS
* Vite

### Backend

* NestJS
* TypeScript
* REST API
* JWT Authentication
* Passport
* Class Validator

### Database

* PostgreSQL
* Prisma ORM

### Development Tools

* Git
* GitHub
* pnpm
* Docker

## Project Structure

```text
ethio-rate-review/
│
├── apps/
│   │
│   ├── web/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── businesses/
│   │   │   │   │   ├── $id.tsx
│   │   │   │   │   └── register.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── login.tsx
│   │   │   │   ├── register.tsx
│   │   │   │   ├── welcome.tsx
│   │   │   │   └── __root.tsx
│   │   │   │
│   │   │   └── lib/
│   │   │       └── api.ts
│   │   │
│   │   └── package.json
│   │
│   └── api/
│       ├── src/
│       │   ├── auth/
│       │   ├── business/
│       │   ├── category/
│       │   ├── review/
│       │   ├── prisma/
│       │   ├── app.module.ts
│       │   └── main.ts
│       │
│       ├── prisma/
│       │   └── schema.prisma
│       │
│       └── package.json
│
├── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md
```

## Database Models

The current database contains the following main entities:

* `User`
* `Business`
* `Review`
* `Category`
* `BusinessCategory`

### User Roles

The system supports three roles:

```text
CUSTOMER
BUSINESS_OWNER
ADMIN
```

Business owners can register businesses, and each business is associated with its owner.

## Authentication

Authentication is implemented using JWT.

The authentication flow is:

```text
Register
   ↓
Login
   ↓
JWT Access Token
   ↓
Store Token
   ↓
Authenticated API Requests
```

Business registration requires an authenticated business owner.

Example:

```text
POST /auth/login
```

returns an access token that is then sent with protected requests:

```text
Authorization: Bearer <access-token>
```

## API Endpoints

### Authentication

```text
POST /auth/register
POST /auth/login
```

### Businesses

```text
GET  /businesses
GET  /businesses/:id
POST /businesses
```

Business searching and filtering supports parameters such as:

```text
/businesses?search=coffee
/businesses?city=Addis Ababa
/businesses?category=Restaurant
/businesses?sort=rating
```

### Reviews

```text
POST /reviews
```

## Running the Project Locally

### Prerequisites

Make sure you have installed:

* Node.js
* pnpm
* Docker Desktop
* Git

### 1. Clone the repository

```bash
git clone https://github.com/marthahab/ethio-rate-review.git
cd ethio-rate-review
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start PostgreSQL

Start the PostgreSQL Docker container:

```bash
docker compose up -d
```

Make sure the database container is running before starting the API.

### 4. Run database migrations

From the API directory:

```bash
cd apps/api
pnpm prisma migrate dev
```

Generate Prisma Client:

```bash
pnpm prisma generate
```

### 5. Start the backend

From:

```text
apps/api
```

run:

```bash
pnpm start:dev
```

The API runs on:

```text
http://localhost:3001
```

### 6. Start the frontend

Open another terminal and go to:

```bash
cd apps/web
```

Run:

```bash
pnpm dev
```

The frontend runs on:

```text
http://localhost:3000
```

## Environment Variables

The backend requires a database connection and JWT secret.

Create:

```text
apps/api/.env
```

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5433/ethio_rate_review"
JWT_SECRET="your-development-secret"
PORT=3001
```

Use your actual PostgreSQL credentials instead of the example values.

## Business Registration Flow

A business owner can:

1. Create a business owner account.
2. Log in.
3. Receive a JWT access token.
4. Open the business registration page.
5. Enter business information.
6. Submit the registration form.
7. The backend verifies the JWT.
8. The business is created and associated with the authenticated owner.

Example:

```text
Business Owner
      ↓
     Login
      ↓
 JWT Access Token
      ↓
Register Business
      ↓
POST /businesses
      ↓
Backend Authentication
      ↓
Business Created
      ↓
Business Owner ID Saved
```

## Current Project Status

The following functionality has been implemented and tested:

* [x] React/TanStack Start frontend
* [x] NestJS backend
* [x] PostgreSQL database
* [x] Prisma ORM
* [x] User registration
* [x] User login
* [x] JWT authentication
* [x] Customer role
* [x] Business owner role
* [x] Business creation
* [x] Business-owner association
* [x] Business search
* [x] Business filtering
* [x] Business categories
* [x] Ratings and reviews
* [x] Business details
* [x] Responsive frontend
* [x] Git/GitHub project setup

## Future Improvements

Planned improvements include:

* Business owner dashboard
* View businesses owned by the current user
* Edit business information
* Business verification
* Business owner review responses
* Review moderation
* Review reporting
* Review photos
* Favorites
* Admin dashboard
* Advanced search and filtering
* Map integration
* Business analytics
* Mobile application
* Personalized recommendations
* AI-powered review analysis
* Ethiopian language support

## Project Goal

The goal of EthioRate is to create a localized business discovery and review platform that makes it easier for people in Ethiopia to find reliable information about local businesses and services.

The project also provides practical experience in:

* Full-stack web development
* REST API development
* Database design
* Authentication and authorization
* Prisma ORM
* React development
* NestJS development
* Software testing
* Git and GitHub
* Deployment
* Project documentation

## License

This project is currently developed as an internship/academic project.

---

**EthioRate — Discover. Rate. Review.**
