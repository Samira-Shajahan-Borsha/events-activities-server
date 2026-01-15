# 🎟️ EventHub — Events & Activities Platform

EventHub Backend is a secure, scalable REST API powering the EventHub ecosystem.  
It handles authentication, role-based authorization, event management, payments, and analytics to support real-world social interactions based on shared interests.

---

## 🎯 Project Overview

The backend is designed as a **role-driven system** that ensures data integrity, security, and smooth coordination between Users, Hosts, and Admins.

### Supported Roles

-   **User:** Join events, manage profile, submit reviews
-   **Host:** Create and manage events, track participants and revenue
-   **Admin:** Moderate users and hosts, oversee platform activity

---

## 🌐 Live API & Repository

-   **Server Live API:**  
    https://events-activities-server-seven.vercel.app/api/v1

-   **Frontend Live:**  
    https://events-activities-client-five.vercel.app/

-   **Frontend Repository:**  
    https://github.com/Samira-Shajahan-Borsha/events-activities-client

---

## 🔑 Test Credentials

| Role        | Email           | Password       |
| ----------- | --------------- | -------------- |
| Super Admin | admin@gmail.com | 12345678@admin |
| Host        | fahim@gmail.com | 1234@Fahim     |
| User        | rafi@gmail.com  | 1234@Rafi      |

---

## 🔐 Authentication & Authorization

EventHub Backend uses **JWT-based authentication** combined with **Role-Based Access Control (RBAC)** to protect sensitive resources.

### Security Highlights

-   **JWT Access & Refresh Tokens**
-   Tokens stored in **HTTP-only cookies**
-   **Role Guards** for User, Host, and Admin routes
-   **Account Status Checks**
    -   Blocked / Suspended users are denied access
-   **Password Encryption**
    -   All passwords are hashed using `bcrypt`

---

## 🧠 Core Business Logic

### 1️⃣ User & Profile Management

-   User registration and login
-   Profile creation with bio and interest tags
-   Role-based profile access
-   Admin-level user blocking/unblocking

---

### 2️⃣ Host & Event Management

-   Host approval workflow (Admin-controlled)
-   Event creation with:
    -   Date, time, location
    -   Min/Max participant limits
    -   Paid or free joining option
-   Event lifecycle management:
    -   `Open` → `Full` → `Completed` / `Cancelled`
-   Participant tracking per event

---

### 3️⃣ Event Discovery & Matching

-   Filter events by:
    -   Name
    -   Type
    -   Location
    -   Status
-   Interest-based matching logic to enhance recommendations

---

### 4️⃣ Payments & Revenue Tracking

-   Integration with **SSLCommerz / Stripe**
-   Secure payment verification
-   Seat reservation after successful payment
-   Host revenue calculation and analytics

---

### 5️⃣ Reviews & Ratings

-   Users can rate hosts (1–5 stars)
-   Reviews allowed only after event participation
-   Aggregated ratings visible to future participants

---

## 🧩 API Endpoints Overview

### 🔐 Authentication

| Endpoint         | Method | Access | Description               |
| ---------------- | ------ | ------ | ------------------------- |
| `/auth/register` | POST   | Public | Create a new account      |
| `/auth/login`    | POST   | Public | Login & token issuance    |
| `/auth/logout`   | POST   | All    | Invalidate active session |

---

### 👤 Users & Admin Controls

| Endpoint           | Method | Access | Description             |
| ------------------ | ------ | ------ | ----------------------- |
| `/users/:id`       | GET    | All    | View user profile       |
| `/users/block/:id` | PATCH  | Admin  | Block or unblock user   |
| `/hosts/approve`   | PATCH  | Admin  | Approve or suspend host |

---

### 🎫 Events

| Endpoint             | Method | Access      | Description             |
| -------------------- | ------ | ----------- | ----------------------- |
| `/events`            | GET    | Public      | Get events with filters |
| `/events/create`     | POST   | Host, Admin | Create a new event      |
| `/events/:id`        | GET    | Public      | Event details           |
| `/events/:id/join`   | POST   | User        | Join an event           |
| `/events/:id/cancel` | PATCH  | Host, Admin | Cancel an event         |

---

### 💳 Payments

| Endpoint           | Method | Access | Description           |
| ------------------ | ------ | ------ | --------------------- |
| `/payments/init`   | POST   | User   | Initialize payment    |
| `/payments/verify` | POST   | User   | Verify payment status |

---

## 🛠️ Technology Stack

### Backend

-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Language:** TypeScript
-   **Database:** MongoDB
-   **ODM:** Mongoose
-   **Validation:** Zod
-   **Authentication:** JWT + bcrypt
-   **Image Storage:** Cloudinary
-   **Payments:** SSLCommerz / Stripe

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── modules/
│   │   ├── auth/          # Authentication & token logic
│   │   ├── users/         # User & host management
│   │   ├── events/        # Event CRUD & participation logic
│   │   ├── payments/      # Payment gateway integration
│   │   ├── reviews/       # Ratings & reviews
│   │   └── stats/         # Admin analytics
│   ├── middlewares/       # AuthGuard, RoleGuard, ErrorHandler
│   ├── utils/             # JWT, Cloudinary, QueryBuilder
│   └── config/            # Environment & database configs
├── server.ts              # Server bootstrap
└── app.ts                 # Express app & route registration
```
