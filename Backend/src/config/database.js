const sql = require("mssql");
require("dotenv").config();


const config = {
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT || 1433),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: String(process.env.DB_ENCRYPT).toLowerCase() === 'true',
        trustServerCertificate:
            String(process.env.DB_TRUST_SERVER_CERTIFICATE).toLowerCase() !==
            'false'
    },
    pool: { min: 0, max: 10, idleTimeoutMillis: 30000 }
};

const connectDB = async () => {
  try {
   const pool = await sql.connect(config); // assigns to the module-level variable
    console.log("Connected to SQL Server");
    return pool;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};


module.exports = {
  sql,
  connectDB,
};

