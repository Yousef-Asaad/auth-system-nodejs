const express = require("express");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { sql, connectDB } = require("./db");

const app = express();

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

connectDB();

// ================= PAGES =================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get("/home", (req, res) => {
  if (!req.session.user) return res.redirect("/");
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

// ================= REGISTER =================
app.post("/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  const check = new sql.Request();
  check.input("email", sql.VarChar, email);

  const result = await check.query(`
    SELECT * FROM Users WHERE Email = @email
  `);

  if (result.recordset.length > 0) {
    return res.send("Email exists");
  }

  const hash = await bcrypt.hash(password, 10);

  const insert = new sql.Request();
  insert.input("username", sql.VarChar, username);
  insert.input("email", sql.VarChar, email);
  insert.input("password", sql.VarChar, hash);

  await insert.query(`
    INSERT INTO Users (Username, Email, Password)
    VALUES (@username, @email, @password)
  `);

  res.redirect("/");
});

// ================= LOGIN =================
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const request = new sql.Request();
  request.input("email", sql.VarChar, email);

  const result = await request.query(`
    SELECT * FROM Users WHERE Email = @email
  `);

  const user = result.recordset[0];

  const match = await bcrypt.compare(password, user.Password);

  if (!match) return res.send("Invalid credentials");

  req.session.user = {
    id: user.Id,
    username: user.Username
  };

  res.redirect("/home");
});
// ================= LOGOUT =================
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});
// ================= USER =================
app.get("/user", (req, res) => {
  if (!req.session.user) return res.json({ username: "Guest" });
  res.json(req.session.user);
});

// ================= PRODUCTS =================
app.get("/product", async (req, res) => {
  const result = await sql.query(`SELECT * FROM Products`);
  res.json(result.recordset);
});

// ================= APPLY PROMO (FINAL FIX) =================
app.post("/apply-promo", async (req, res) => {

  const { promoCode, productId } = req.body;
  const userId = req.session.user?.id;

  if (!userId) {
    return res.json({ success: false, message: "Login required" });
  }

  try {

    // get product
    const productRes = await sql.query(`
      SELECT * FROM Products WHERE Id=${productId}
    `);

    const product = productRes.recordset[0];

    // get promo
    const promoReq = new sql.Request();
    promoReq.input("code", sql.VarChar, promoCode);

    const promoResult = await promoReq.query(`
      SELECT * FROM PromoCodes WHERE Code=@code
    `);

    if (promoResult.recordset.length === 0) {
      return res.json({ success: false, message: "Invalid Promo Code" });
    }

    const promo = promoResult.recordset[0];

    // check already used (IMPORTANT FIX)
    const checkReq = new sql.Request();

    checkReq.input("userId", sql.Int, userId);
    checkReq.input("code", sql.VarChar, promoCode);

    const check = await checkReq.query(`
  SELECT * FROM UserAppliedPromos
  WHERE UserId=@userId AND PromoCode=@code
`);

    if (check.recordset.length > 0) {
      return res.json({
        success: false,
        message: "You already used this promo anywhere"
      });
    }

    // calculate price
    const finalPrice =
      product.Price - (product.Price * promo.DiscountPercent / 100);

    // save usage
    const insert = new sql.Request();
    insert.input("userId", sql.Int, userId);
    insert.input("productId", sql.Int, productId);
    insert.input("code", sql.VarChar, promoCode);

    await insert.query(`
      INSERT INTO UserAppliedPromos (UserId, ProductId, PromoCode)
      VALUES (@userId, @productId, @code)
    `);

    res.json({
      success: true,
      finalPrice,
      message: `${promo.DiscountPercent}% applied`
    });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on 5000");
});