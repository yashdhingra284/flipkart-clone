# Flipkart Clone

A full-stack e-commerce application built to replicate Flipkart's core functionality.

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS v4
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Nodemailer (email)

## Features
- Product listing with search and category filter
- Product detail page with image carousel
- Shopping cart with quantity management
- Wishlist functionality
- User authentication (Login/Signup)
- Order placement with email confirmation
- Order history
- Responsive design

## Database Schema
- users
- products
- cart_items
- orders
- order_items
- wishlist

## Setup Instructions

### Prerequisites
- Node.js
- PostgreSQL
- Git

### Backend Setup
1. Clone the repository
2. Go to backend folder
   cd backend
3. Install dependencies
   npm install
4. Create .env file using .env.example as template
5. Run the server
   node server.js

### Frontend Setup
1. Go to frontend folder
   cd flipkartscalarclone_final
2. Install dependencies
   npm install
3. Run the app
   npm run dev

## Environment Variables
Create a .env file in backend folder using .env.example as template.
For email functionality generate a Gmail App Password from:
https://myaccount.google.com/apppasswords

## Assumptions
- Default user is auto logged in for testing
- Images sourced from Unsplash
- Payment gateway not implemented
```

---

