const express = require("express");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { sql, connectDB } = require("./db");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false
  })
);

//  CONNECT DB 
connectDB();


//  ROUTES 

// LOGIN PAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// REGISTER PAGE
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

// HOME PAGE (protected)
app.get("/home", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  res.sendFile(path.join(__dirname, "views", "home.html"));
});


//  REGISTER 
app.post("/auth/register", async (req, res) => {

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.send("All fields are required");
  }

  try {

    const checkRequest = new sql.Request();
    checkRequest.input("email", sql.VarChar, email);

    const checkUser = await checkRequest.query(`
      SELECT * FROM Users WHERE Email = @email
    `);

    if (checkUser.recordset.length > 0) {
      return res.send("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertRequest = new sql.Request();
    insertRequest.input("username", sql.VarChar, username);
    insertRequest.input("email", sql.VarChar, email);
    insertRequest.input("password", sql.VarChar, hashedPassword);

    await insertRequest.query(`
      INSERT INTO Users (Username, Email, Password)
      VALUES (@username, @email, @password)
    `);

    res.redirect("/");

  } catch (err) {
    console.log(err);
    res.send("Server Error");
  }
});


//  LOGIN 
app.post("/auth/login", async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.send("All fields are required");
  }

  try {

    const request = new sql.Request();
    request.input("email", sql.VarChar, email);

    const result = await request.query(`
      SELECT * FROM Users WHERE Email = @email
    `);

    if (result.recordset.length === 0) {
      return res.send("Invalid email or password");
    }

    const user = result.recordset[0];

    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      return res.send("Invalid email or password");
    }

    //  SESSION FIXED HERE
    req.session.user = {
      id: user.Id,
      username: user.Username
    };

    res.redirect("/home");

  } catch (err) {
    console.log(err);
    res.send("Server Error");
  }
});


//  USER API 
app.get("/user", (req, res) => {

  if (!req.session.user) {
    return res.json({ username: "Guest" });
  }

  res.json({
    username: req.session.user.username
  });
});


//  LOGOUT 
app.get("/logout", (req, res) => {

  req.session.destroy(() => {
    res.redirect("/");
  });

});


//  START 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});