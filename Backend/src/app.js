const express = require("express");
const { connectDB } = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("", (req, res) => {
  res.json({
    message: "CareerBridge API is running",
  });
});


app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CareerBridge API is healthy",
  });
});

app.get("/api/jobs", async (req, res) => {
  try{
    const pool = await connectDB();

    const result = await pool
    .request()
    .query("SELECT * FROM Job WHERE Status = 1");
    res.json({
        success: true,
        count: result.recordset.length,
        data: result.recordset
});
} catch (error) {
  res.status(500).json({
    success: false,
    message: "Unable to retrieve jobs",
  });
}
});

app.get("/api/companies", async (req, res) => {
  try{
    const pool = await connectDB();

    const result = await pool
    .request()
    .query("SELECT * FROM Company");
    res.json({
        success: true,
        count: result.recordset.length,
        data: result.recordset
});
} catch (error) {
  res.status(500).json({
    success: false,
    message: "Unable to retrieve companies",
  });
}
});

app.get("/api/categories", async (req, res) => {
  try{
    const pool = await connectDB();

    const result = await pool
    .request()
    .query("SELECT * FROM Category");
    res.json({
        success: true,
        count: result.recordset.length,
        data: result.recordset
});
} catch (error) {
  res.status(500).json({
    success: false,
    message: "Unable to retrieve jobs",
  });
}
});

    app.listen(PORT, () => {
      console.log(`CareerBridge API running on port ${PORT}`);
    });

