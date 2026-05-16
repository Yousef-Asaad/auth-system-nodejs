const sql = require("mssql");

const config = {
  user: "appuser",
  password: "12345678!",
  server: "127.0.0.1",
  port: 1433,
  database: "LoginDB",
  options: {
    trustServerCertificate: true
  }
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log("DB Connected");
  } catch (err) {
    console.log("DB Error:", err.message);
  }
};

module.exports = {
  sql,
  connectDB
};