# 🔐 Auth System with Promo Code Feature

A simple full-stack authentication system built using Node.js, Express, SQL Server, and vanilla HTML/CSS/JS.

---

## 🚀 Features

- User Registration
- User Login / Logout
- Session-based Authentication
- Protected Home Page
- Product Listing
- Promo Code System (One-time use per user)
- Dynamic price update after discount

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- SQL Server
- Express Session
- Bcrypt
- HTML / CSS / JavaScript

---

## 📦 Installation

```bash
git clone https://github.com/USERNAME/auth-system-nodejs.git
cd auth-system-nodejs
npm install
⚙️ Setup Database

Create database LoginDB and run:

Users Table:
- Id
- Username
- Email
- Password

Products Table:
- Id
- Name
- Price
- Image

PromoCodes Table:
- Id
- Code
- DiscountPercent

UserAppliedPromos Table:
- Id
- UserId
- ProductId
- PromoCode
- CreatedAt
▶️ Run Project
node index.js

Then open:

http://localhost:5000
🔐 Security Features
Password hashing using bcrypt
SQL Injection protection using parameterized queries
Session-based auth
👨‍💻 Author
Yousef Asaad