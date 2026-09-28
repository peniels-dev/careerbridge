const { sql, connectDB } = require("../config/database");


// Get all active categories
const getCategories = async (req, res) => {
    try {
        const pool = await connectDB();

        const result = await pool.request().query(`
            SELECT
                CategoryID,
                CategoryName,
                Description,
                CreatedDate,
                Status
            FROM Category
            WHERE Status = 1
            ORDER BY CategoryName ASC
        `);

        return res.status(200).json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error("Error getting categories:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load categories"
        });
    }
};


module.exports = {
    getCategories
};

