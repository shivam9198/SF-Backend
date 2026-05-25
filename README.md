# SF Backend

A Node.js Express backend with MongoDB using Mongoose and JWT authentication.

## Project Structure

```
sf-backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic (login, register)
│   ├── customerController.js# Customer business logic
│   ├── emiController.js     # EMI schedule logic
│   └── userController.js    # User business logic
├── middleware/
│   ├── authMiddleware.js    # JWT verification and role-based access
│   └── errorHandler.js      # Error handling middleware
├── models/
│   ├── Customer.js          # Customer schema and model
│   ├── EMI.js               # EMI schedule schema
│   ├── Loan.js              # Loan schema and model
│   └── User.js              # User schema with password hashing
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── customerRoutes.js    # Customer routes
│   ├── emiRoutes.js         # EMI routes
│   ├── loanRoutes.js        # Loan routes
│   └── userRoutes.js        # User routes
├── app.js                   # Express app setup
├── server.js                # Server entry point
├── package.json             # Dependencies
├── .env                     # Environment variables
└── .gitignore              # Git ignore file
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Make sure MongoDB is running locally or update the `MONGODB_URI` in `.env` file

3. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## Authentication System

### Features

- ✅ JWT-based authentication
- ✅ Password hashing using bcrypt
- ✅ Role-based access control (admin, staff)
- ✅ Login with email or phone number
- ✅ Admin-only staff registration
- ✅ Protected routes middleware

### User Roles

- **admin** - Can register new staff members
- **staff** - Default role, limited permissions

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login (email/phone + password)
- `POST /api/auth/register-staff` - Register new staff (admin only)
- `GET /api/auth/me` - Get current authenticated user

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Customers

- `POST /api/customers` - Create customer
- `GET /api/customers` - List customers (search by name or phone)
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer (admin only)

### Loans

- `POST /api/loans` - Create loan and generate EMI schedule
- `GET /api/loans` - List loans (search by product name or IMEI, filter by customerId)
- `GET /api/loans/:id` - Get single loan details

### EMIs

- `GET /api/emis/:loanId` - Get full EMI schedule for a loan

## Environment Variables

Update `.env` file with your configuration:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sf-backend
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

## Usage Examples

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "1234567890",
    "role": "admin"
  }
}
```

### Register Staff (Admin Only)

```bash
POST /api/auth/register-staff
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "0987654321",
  "password": "securepass123",
  "role": "staff"
}

Response:
{
  "message": "Staff registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "0987654321",
    "role": "staff"
  }
}
```

### Get Current User

```bash
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "_id": "...",
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "1234567890",
  "role": "admin",
  "isActive": true,
  "createdAt": "2026-05-04T...",
  "updatedAt": "2026-05-04T..."
}
```

### Customer API Examples

#### Create Customer

```bash
POST /api/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Ravi Kumar",
  "phone": "9876543210",
  "alternatePhone": "9123456780",
  "aadhaar": "1234-5678-9012",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "kycDocumentType": "Aadhaar",
  "kycDocumentImage": "https://example.com/docs/kyc.jpg"
}

Response:
{
  "message": "Customer created successfully",
  "customer": {
    "_id": "...",
    "fullName": "Ravi Kumar",
    "phone": "9876543210",
    "aadhaar": "XXXX-XXXX-9012",
    "createdBy": "..."
  }
}
```

#### List Customers with Search

```bash
GET /api/customers?search=Ravi
Authorization: Bearer <token>
```

#### Get Customer by ID

```bash
GET /api/customers/<customerId>
Authorization: Bearer <token>
```

#### Update Customer

```bash
PUT /api/customers/<customerId>
Authorization: Bearer <token>
Content-Type: application/json

{
  "address": {
    "street": "456 New St",
    "city": "Pune"
  }
}
```

#### Delete Customer (Admin Only)

```bash
DELETE /api/customers/<customerId>
Authorization: Bearer <admin_token>
```

### Loan API Examples

#### Create Loan

```bash
POST /api/loans
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "<customerId>",
  "productName": "Smartphone",
  "imeiNumber": "123456789012345",
  "productPrice": 30000,
  "downPayment": 5000,
  "emiPlan": 12,
  "purchaseDate": "2026-05-04"
}
```

Response:

```json
{
  "message": "Loan created successfully",
  "loan": {
    "id": "...",
    "customerId": "<customerId>",
    "productName": "Smartphone",
    "imeiNumber": "123456789012345",
    "productPrice": 30000,
    "loginCharge": 500,
    "downPayment": 5000,
    "loanAmount": 25500,
    "emiPlan": 12,
    "monthlyEmi": 2125,
    "purchaseDate": "2026-05-04T00:00:00.000Z",
    "createdBy": "..."
  },
  "installmentsCreated": 12
}
```

#### List Loans

```bash
GET /api/loans?search=Smartphone&customerId=<customerId>
Authorization: Bearer <token>
```

#### Get Loan by ID

```bash
GET /api/loans/<loanId>
Authorization: Bearer <token>
```

#### Get EMI Schedule

```bash
GET /api/emis/<loanId>
Authorization: Bearer <token>
```

Response:

```json
{
  "loanId": "<loanId>",
  "schedule": [
    {
      "loanId": "<loanId>",
      "customerId": "<customerId>",
      "emiNumber": 1,
      "dueDate": "2026-06-04T00:00:00.000Z",
      "amount": 2125,
      "status": "Pending",
      "paidOn": null,
      "collectedBy": null
    },
    {
      "loanId": "<loanId>",
      "customerId": "<customerId>",
      "emiNumber": 2,
      "dueDate": "2026-07-04T00:00:00.000Z",
      "amount": 2125,
      "status": "Pending",
      "paidOn": null,
      "collectedBy": null
    }
  ]
}
```

## Protected Routes Usage

To protect routes in your controllers, use the middleware:

```javascript
const { protect, authorize } = require("../middleware/authMiddleware");

// Admin only route
router.post("/admin-action", protect, authorize("admin"), controllerFunction);

// Any authenticated user
router.get("/protected", protect, controllerFunction);
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Environment variable management
