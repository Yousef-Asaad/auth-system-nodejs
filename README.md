🔐 Auth System Project (Node.js + SQL Server)
📌 Overview

This is a simple full-stack authentication system built using:

Node.js (Express)
SQL Server
bcrypt (Password Hashing)
express-session (Authentication)

The system includes:

User Registration
User Login
Protected Home Page
Session-based Authentication
🚀 Features

✔ User Registration
✔ User Login
✔ Password Hashing (bcrypt)
✔ Session Authentication
✔ Protected Routes
✔ Logout System
✔ SQL Injection Protection (Parameterized Queries)

🧱 Project Structure
auth-system-nodejs/
│
├── index.js
├── db.js
├── package.json
├── package-lock.json
│
├── public/
│   ├── style.css
│   └── script.js
│
├── views/
│   ├── login.html
│   ├── register.html
│   └── home.html

⚙️ Installation
1) Clone project
git clone https://github.com/USERNAME/auth-system-nodejs.git
cd auth-system-nodejs
2) Install dependencies
npm install
🗄️ Database Setup (SQL Server)

Run this script:

CREATE DATABASE AuthProjectDB;

USE AuthProjectDB;

CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY,
    Username VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(255)
);
▶️ Run Project
node index.js

Then open:

http://localhost:5000
🔐 Security Features
Passwords hashed using bcrypt
Parameterized SQL queries to prevent SQL Injection
Session-based authentication
Protected routes for Home page
🧠 How It Works
User registers → password is hashed → stored in DB
User logs in → password is compared using bcrypt
If valid → session is created

Home page shows:

Welcome Back, Username
🚪 Routes
Route	Description
/	Login Page
/register	Register Page
/home	Dashboard (Protected)
/logout	Logout

👨‍💻 Author
Yousef Asaad