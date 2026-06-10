# 🎟️ EventHub — Events & Activities Platform

EventHub Backend is a production-ready REST API for organizing, discovering, and monetizing in-person and virtual events. It provides robust role-based access control, reliable payment flows, media handling, and operational tooling so Hosts can run events and Admins can operate the platform while Users discover and participate safely.

---

## 🎯 Project Overview

EventHub Backend is a robust RESTful API that powers the EventHub platform, enabling authentication, event management, ticket registration, payments, and role-based access control. It focuses on reliability, data integrity, and clear business workflows across the user lifecycle — from onboarding and identity management to ticketing, attendance tracking, and host revenue settlement.

Key capabilities:

- Event creation, scheduling and capacity management with open/closed lifecycle
- Paid and free event support with seat reservation and transfer flows
- Ticket generation, retrieval, cancellation and owner transfer
- Role-based access and approval flows for hosts and admin operations
- Payment processing, verification, and reconciliation via SSLCommerz
- Media uploads and optimized delivery via Cloudinary
- Audit-friendly actions and admin reporting endpoints

### Supported Roles

- **User:** Standard consumer account; can browse events, purchase tickets, check-in, and manage a personal profile. Users have transaction/ticket histories.
- **Host:** Event organizer; can create and edit events, configure pricing and capacity, and view attendee lists. Hosts are subject to platform policies and can be approved/suspended by Admins.
- **Admin:** Platform operator with elevated privileges to moderate content and accounts, approve Host registrations, manage events.

---

## 🌐 Live API & Repository

- **Server Live API:**  
  https://events-activities-server-seven.vercel.app/

- **Frontend Live:**  
  https://events-activities-client-five.vercel.app/

- **Frontend Repository:**  
  https://github.com/Samira-Shajahan-Borsha/events-activities-client

---

## 🔑 Test Credentials

### User Accounts

| Role        | Email           | Password       |
| ----------- | --------------- | -------------- |
| Super Admin | admin@gmail.com | 12345678@admin |
| Host        | fahim@gmail.com | 1234@Fahim     |
| User        | rafi@gmail.com  | 1234@Rafi      |

### SSLCommerz Sandbox Payment Credentials

| Field      | Value          |
| ---------- | -------------- |
| Card Number| 4111111111111111 |
| Expiry     | 12/26          |
| CVV        | 111            |

> **Note:** These are SSLCommerz sandbox test credentials for development and testing purposes only. Never use production credentials in the `.env` file.

---

## 🔐 Authentication, Authorization & Security Highlights

EventHub secures user access with short-lived access tokens and longer-lived refresh tokens, enforced via middleware and role guards. Authentication is centered on JWTs, while authorization is enforced through explicit role checks and account state validation.

Key details:

- **Access & Refresh Tokens:** Short-lived JWT access tokens plus refresh tokens allow safe session continuation. The backend exposes a `/auth/refresh-token` endpoint to issue new access tokens.
- **Secure Cookie Storage:** Refresh tokens are stored in HTTP-only, Secure cookies to reduce XSS attack surface. Access tokens are validated on each protected endpoint.
- **Role-Based Authorization (RBAC):** `checkAuth` middleware verifies authenticated identity and enforces role requirements (User, Host, Admin) per-route.
- **Account Status & Enforcement:** Blocked or suspended accounts are denied access; middleware enforces account status checks at request time.
- **Password Security:** Passwords are hashed using `bcryptjs` with appropriate salting and never returned in responses.
- **Session Management & Logout:** Logout invalidates session cookies and server-side token references to prevent reuse.

Security best practices implemented:

- Use of `httpOnly` and `Secure` flags for cookies in production
- Token expiration and refresh flows to limit exposure of compromised tokens
- Centralized middleware for authorization and account state checks

---

## 🧠 Core Business Logic


### 1️⃣ User & Profile Management

- Registration and credential management with hashed passwords and token issuance
- Profile editing including avatar uploads (Cloudinary) and preference/interest tags
- Endpoints to fetch public profiles and a secure `me` endpoint for the authenticated user
- Admin actions: block/unblock accounts and inspect user activity for moderation

### 2️⃣ Host Onboarding & Event Management

- Host registration and approval workflow (Admins can approve or suspend Hosts)
- Full event lifecycle: create → publish → manage capacity → close or cancel
- Event configuration: date/time, location, capacity, ticket tiers (paid/free), media attachments
- Host-facing reporting: Participant tracking per event.

### 3️⃣ Event Discovery, Search & Filters

- Rich queryable endpoints with pagination, sorting and multi-field filters (name, type, location, status)
- Tag and interest based matching to surface relevant events to users
- QueryBuilder utility to compose and run complex queries efficiently

### 4️⃣ Ticketing & Attendance

- Ticket creation tied to a transaction ID and ticket owner
- Ticket lifecycle: issued → confirmed → used / cancelled
- Endpoints for users to view their tickets, retrieve by transaction ID, and leave/cancel events
- Seat reservation logic to prevent oversubscription while payment is pending or confirmed

### 5️⃣ Payments & Gateway Integration

EventHub integrates with **SSLCommerz** for payment processing. The integration follows a server-mediated flow with explicit verification and callbacks to ensure consistency between payments and ticket state.

Payment flow highlights:

- **Initiate Payment:** `POST /payment/init-payment/:ticketId` creates a pending transaction and returns SSLCommerz parameters (or redirect) to complete payment.
- **Provider Callbacks:** SSLCommerz calls back to `/payment/success`, `/payment/fail`, and `/payment/cancel` to inform the server of the final payment outcome.
- **Validation Endpoint:** `/payment/validate-payment` is used to verify transaction authenticity and reconcile the provider payload with local transaction records.
- **Reliable Payment Processing:** Ensures secure and consistent payment handling by preventing duplicate ticket creation and repeated transaction processing.
- **Seat Reservation & Finalization:** Seats are reserved when payment is initiated (or upon confirmation depending on configuration) and confirmed only after successful validation.
- **Reconciliation & Reporting:** Transactions are logged with status, provider reference IDs and timestamps so Admins can reconcile payments and run host payout calculations.

---

## 🧩 API Endpoints Overview

### 🔐 Authentication

| Endpoint                | Method | Access        | Description            |
| ----------------------- | ------ | ------------- | ---------------------- |
| `/auth/login`           | POST   | Public        | Login & token issuance |
| `/auth/refresh-token`   | POST   | Public        | Get new access token   |
| `/auth/logout`          | POST   | Authenticated | Invalidate session     |
| `/auth/me`              | GET    | Authenticated | Get current user info  |
| `/auth/change-password` | POST   | Authenticated | Change user password   |

---

### 👤 Users & Admin Controls

| Endpoint            | Method | Access | Description          |
| ------------------- | ------ | ------ | -------------------- |
| `/user/register`    | POST   | Public | Create a new account |
| `/user/:id`         | GET    | Public | View user profile    |
| `/user/all-users`   | GET    | Admin  | Get all users        |
| `/user/all-hosts`   | GET    | Admin  | Get all hosts        |
| `/user/block/:id`   | PATCH  | Admin  | Block a user         |
| `/user/unblock/:id` | PATCH  | Admin  | Unblock a user       |
| `/user/role/:id`    | PATCH  | Admin  | Update user role     |

---

### 👥 Profile

| Endpoint                  | Method | Access        | Description           |
| ------------------------- | ------ | ------------- | --------------------- |
| `/profile/update-profile` | PATCH  | Authenticated | Update user profile   |
| `/profile/:id`            | GET    | Public        | Get user profile info |

---

### 🎫 Events

| Endpoint            | Method | Access      | Description        |
| ------------------- | ------ | ----------- | ------------------ |
| `/event/create`     | POST   | Host, Admin | Create a new event |
| `/event/all-events` | GET    | Public      | Get all events     |
| `/event/my-events`  | GET    | Host, Admin | Get user's events  |
| `/event/:slug`      | GET    | Public      | Get event by slug  |
| `/event/:id`        | PATCH  | Host, Admin | Update event       |
| `/event/:id`        | DELETE | Host, Admin | Delete event       |

---

### 🎟️ Tickets

| Endpoint                        | Method | Access | Description             |
| ------------------------------- | ------ | ------ | ----------------------- |
| `/ticket/create-ticket`         | POST   | User   | Create ticket for event |
| `/ticket/my-tickets`            | GET    | User   | Get user's tickets      |
| `/ticket/:transactionId`        | GET    | User   | Get ticket details      |
| `/ticket/leave-event/:ticketId` | PATCH  | User   | Leave/cancel ticket     |

---

### 💳 Payments

| Endpoint                          | Method | Access | Description              |
| --------------------------------- | ------ | ------ | ------------------------ |
| `/payment/init-payment/:ticketId` | POST   | Public | Initialize payment       |
| `/payment/success`                | POST   | Public | Payment success callback |
| `/payment/fail`                   | POST   | Public | Payment failure callback |
| `/payment/cancel`                 | POST   | Public | Payment cancel callback  |
| `/payment/validate-payment`       | POST   | Public | Validate payment         |

---

## 🛠️ Technology Stack

### Core & Runtime

- **Node.js:** JavaScript runtime
- **Express.js:** HTTP server and REST API routing
- **TypeScript:** Static type checking and compilation

### Database & ORM

- **MongoDB:** NoSQL document database
- **Mongoose:** ODM for modeling application data

### Authentication & Security

- **jsonwebtoken:** JWT access and refresh token handling
- **bcryptjs:** Password hashing and verification
- **cookie-parser:** HTTP cookie parsing for token storage

### Validation & Serialization

- **Zod:** Request and payload schema validation

### File Handling & Cloud Storage

- **Multer:** Multipart file upload middleware
- **multer-storage-cloudinary:** Cloudinary storage adapter for Multer
- **Cloudinary:** Image storage and optimization

### Payments & Gateway Integration

- **SSLCommerz:** Payment gateway integration
- **Axios:** HTTP client for external API calls

### HTTP & Network

- **CORS:** Cross-Origin Resource Sharing middleware
- **dotenv:** Environment variable management
- **http-status-codes:** HTTP status helpers

### Development Tools

- **ts-node-dev:** TypeScript watch-mode development server
- **ESLint:** Code linting and quality checks
- **TypeScript:** Compile-time type safety

### Type Definitions (Dev Dependencies)

- **@types/cookie-parser**
- **@types/cors**
- **@types/dotenv**
- **@types/express**
- **@types/jsonwebtoken**
- **@types/multer**

---

## � Getting Started

### Prerequisites

- **Node.js** v16+ and **npm** or **yarn**
- **MongoDB** (local or cloud instance via MongoDB Atlas)
- **Git** for version control
- **Cloudinary** account for media storage
- **SSLCommerz** merchant account for payment processing

### Clone the Repository

```bash
git clone https://github.com/your-org/events-activities-server.git
cd events-activities-server
```

### Environment Setup

1. **Create environment files:**
   - Copy `.env.dev` to `.env` for development
   - Create `.env.prod` for production settings

2. **Configure `.env` variables:**

```bash
# Server & Database
PORT=5000
NODE_ENV=development
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name?appName=app-name

# Authentication (JWT)
JWT_ACCESS_TOKEN_SECRET=your-access-token-secret
JWT_ACCESS_TOKEN_EXPIRES=1d
JWT_REFRESH_TOKEN_SECRET=your-refresh-token-secret
JWT_REFRESH_TOKEN_EXPIRES=30d

# Password Security
BCRYPT_SALT_ROUND=10

# Super Admin Credentials
SUPER_ADMIN_EMAIL=admin@gmail.com
SUPER_ADMIN_PASSWORD=your-secure-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# SSLCommerz Payment Gateway
SSL_STORE_ID=your-store-id
SSL_STORE_PASS=your-store-password
SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSL_VALIDATION_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
SSL_IPN_URL=http://localhost:5000/api/v1/payment/validate-payment

# SSLCommerz Callbacks (Backend)
SSL_SUCCESS_BACKEND_URL=http://localhost:5000/api/v1/payment/success
SSL_FAIL_BACKEND_URL=http://localhost:5000/api/v1/payment/fail
SSL_CANCEL_BACKEND_URL=http://localhost:5000/api/v1/payment/cancel

# SSLCommerz Callbacks (Frontend)
SSL_SUCCESS_FRONTEND_URL=http://localhost:3000/payment/success
SSL_FAIL_FRONTEND_URL=http://localhost:3000/payment/fail
SSL_CANCEL_FRONTEND_URL=http://localhost:3000/payment/cancel

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Install Dependencies

```bash
npm install
```

---

## ▶️ Running the Project

### Development Mode

Start the development server with hot-reload using `ts-node-dev`:

```bash
npm run dev
```

Server will start on `http://localhost:5000`. Changes to TypeScript files will automatically restart the server.

### Build for Production

Compile TypeScript to JavaScript:

```bash
npm run build
```

This generates the `dist/` directory with compiled JavaScript.

### Production Mode

Run the compiled production build:

```bash
npm start
```

Ensure `.env` or `.env.prod` is configured with production values before deployment.

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

---

## 📂 Project Structure


```text
event-activities-server/
├── src/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── auth/              # Authentication, login, token refresh, logout
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.route.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── user/              # User management, registration, role updates
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.route.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── user.interface.ts
│   │   │   │   ├── user.validation.ts
│   │   │   │   └── user.constant.ts
│   │   │   ├── profile/           # User profile updates and retrieval
│   │   │   │   ├── profile.controller.ts
│   │   │   │   ├── profile.route.ts
│   │   │   │   ├── profile.service.ts
│   │   │   │   ├── profile.model.ts
│   │   │   │   ├── profile.interface.ts
│   │   │   │   └── profile.validate.ts
│   │   │   ├── event/             # Event CRUD, discovery, filtering, lifecycle
│   │   │   │   ├── event.controller.ts
│   │   │   │   ├── event.route.ts
│   │   │   │   ├── event.service.ts
│   │   │   │   ├── event.model.ts
│   │   │   │   ├── event.interface.ts
│   │   │   │   ├── event.validation.ts
│   │   │   │   └── event.constant.ts
│   │   │   ├── ticket/            # Ticket creation, management, cancellation
│   │   │   │   ├── ticket.controller.ts
│   │   │   │   ├── ticket.route.ts
│   │   │   │   ├── ticket.service.ts
│   │   │   │   ├── ticket.model.ts
│   │   │   │   ├── ticket.interface.ts
│   │   │   │   └── ticket.validation.ts
│   │   │   ├── payment/           # Payment initialization, callbacks, validation
│   │   │   │   ├── payment.controller.ts
│   │   │   │   ├── payment.route.ts
│   │   │   │   ├── payment.service.ts
│   │   │   │   ├── payment.model.ts
│   │   │   │   └── payment.interface.ts
│   │   │   └── sslCommerz/        # SSLCommerz integration and service
│   │   │       ├── sslCommerz.service.ts
│   │   │       └── sslCommerz.interface.ts
│   │   ├── middlewares/
│   │   │   ├── checkAuth.ts       # Role-based authorization guard
│   │   │   ├── globalErrorHandler.ts # Centralized error handling
│   │   │   ├── notFound.ts        # 404 handler
│   │   │   └── validateRequest.ts # Request validation with Zod
│   │   ├── errorHelpers/
│   │   │   ├── AppError.ts        # Custom error class
│   │   │   ├── handleZodError.ts  # Zod validation error handler
│   │   │   ├── handleCastError.ts # MongoDB cast error handler
│   │   │   └── handleValidationError.ts # Mongoose validation error handler
│   │   ├── config/
│   │   │   ├── env.ts             # Environment variable validation and loading
│   │   │   ├── cloudinary.config.ts # Cloudinary setup
│   │   │   └── multer.config.ts   # Multer file upload middleware
│   │   ├── utils/
│   │   │   ├── jwt.ts             # JWT token generation and verification
│   │   │   ├── sendResponse.ts    # Standardized response formatter
│   │   │   ├── catchAsync.ts      # Async error wrapper
│   │   │   ├── QueryBuilder.ts    # MongoDB query builder utility
│   │   │   ├── getTransactionId.ts # Transaction ID generator
│   │   │   ├── setCookie.ts       # Cookie setter utility
│   │   │   ├── userTokens.ts      # User token utilities
│   │   │   └── seedSuperAdmin.ts  # Super admin initialization script
│   │   ├── types/
│   │   │   ├── error.type.ts      # Error type definitions
│   │   │   └── express.d.ts       # Express middleware type extensions
│   │   ├── routes/
│   │   │   └── index.ts           # Route aggregation and mounting
│   │   └── constant.ts            # Application constants
│   ├── app.ts                     # Express app configuration
│   └── server.ts                  # Server startup entry point
├── dist/                          # Compiled JavaScript output (generated)
├── node_modules/                  # Dependencies (installed via npm)
├── .env                           # Environment variables (development)
├── .env.dev                       # Development environment template
├── .env.prod                      # Production environment template
├── .gitignore                     # Git ignore rules
├── tsconfig.json                  # TypeScript configuration
├── eslint.config.mjs              # ESLint configuration
├── package.json                   # Project dependencies and scripts
├── package-lock.json              # Locked dependency versions
├── README.md                      # This file
├── vercel.json                    # Vercel deployment configuration
└── Events Activities.postman_collection.json # Postman API collection
```
