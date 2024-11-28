# Role-Based Access Control API

A robust Node.js REST API implementing Role-Based Access Control (RBAC) with user authentication and product management features.

## Features

- User Authentication (Signup/Signin/Logout)
- Role-Based Access Control (Admin, Moderator, User)
- Product Management
- Redis Token Blacklisting
- Password Encryption
- Input Validation
- Error Handling
- Soft Delete Support
- Pagination for Product Listing
- Search & Filter Capabilities

## Tech Stack

- Node.js & Express.js
- PostgreSQL (with Sequelize ORM)
- Redis (for token management)
- JWT Authentication
- bcrypt (for password hashing)

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Redis
- npm or yarn

## Installation

1. Clone the repository:

 ```
 git clone https://github.com/your-repo.git
 cd <project-directory>
 ```

2. Install dependencies:

 ```
 npm install
 ```

3. Set up environment variables:

```
cp .env.sample .env
```

4. Create config.json file in config folder and add your database credentials:

```
{
  "development": {
    "username": "your_username",
    "password": "your_password",
    "database": "VRV_DEV",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "your_username",
    "password": "your_password",
    "database": "VRV_TEST",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "your_username",
    "password": "your_password",
    "database": "VRV_PROD",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}

```

5. create database, migrations and seed data:

```
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
``` 

## Project Structure

```
src/
├── config/             # Configuration files
├── controllers/        # Request handlers
├── middlewares/        # Custom middleware functions
├── migrations/         # Database migrations
├── models/            # Database models
├── repositories/      # Data access layer
├── routes/            # API routes
├── seeders/           # Database seeders
├── services/          # Business logic
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── app.js             # Application entry point
```

## API Endpoints

### User Routes
- `POST /api/v1/user/signup` - Register new user
- `POST /api/v1/user/signin` - User login
- `GET /api/v1/profile` - Get user profile
- `PATCH /api/v1/profile` - Update user profile
- `PATCH /api/v1/password` - Update password
- `POST /api/v1/user/logout` - User logout

### Admin/Moderator Routes
- `PATCH /api/v1/user/:id` - Update user (Admin/Moderator)
- `DELETE /api/v1/user/:id` - Delete user (Admin only)

### Product Routes
- `POST /api/v1/products` - Create product (Admin only)
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get single product
- `PUT /api/v1/products/:id` - Update product (Admin/Moderator)
- `DELETE /api/v1/products/:id` - Delete product (Admin only)

## Role Hierarchy

1. **Admin (roleId: 1)**
   - Full system access
   - Can manage users and products
   - Can delete users and products

2. **Moderator (roleId: 2)**
   - Can update users and products
   - Cannot delete users or products

3. **User (roleId: 3)**
   - Can view products
   - Can manage own profile
   - Default role for new users

## Error Handling

The API implements a centralized error handling system with three main error types:
- `AppError`: Base error class
- `ClientError`: For client-side errors (400-level)
- `ValidationError`: For data validation errors

## Security Features

- Password hashing using bcrypt
- JWT token authentication
- Token blacklisting with Redis
- Role-based access control
- Input validation
- SQL injection protection (via Sequelize)

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request





