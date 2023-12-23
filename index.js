const express = require("express");
require('dotenv').config()

// Initialize Express
const app = express();
const mysql = require('mysql2')
const dbConn = mysql.createConnection(process.env.DATABASE_URL)

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get("/user", (req, res) => {
    dbConn.query('SELECT * FROM users', function( err, results ) {
        res.send(results)
    })
})

app.get("/gallerry/all", (req, res) => {
    let sortBy = req.query.sortBy || 'ล่าสุด';
    let filterBy = req.query.filterBy || 'all';
    const sqlQuery = `
    SELECT 
        artwork.artw_id, artwork.artw_desc, artwork.ex_img_id,
        example_img.ex_img_path, example_img.ex_img_name, artwork.created_at
    FROM 
        artwork
    JOIN 
        example_img ON artwork.ex_img_id = example_img.ex_img_id
    WHERE 
        artwork.deleted_at IS NULL 
    UNION
    SELECT
        example_img.artw2_id, artwork.artw_desc, artwork.ex_img_id,
        example_img.ex_img_path, example_img.ex_img_name, example_img.created_at
    FROM
        example_img
    JOIN
        artwork ON example_img.artw2_id = artwork.artw_id
    WHERE
        example_img.cms_id IS NULL AND artwork.deleted_at IS NULL
    ORDER BY created_at ${sortBy === 'เก่าสุด' ? 'ASC' : 'DESC'}
    `;
    dbConn.query(sqlQuery, [sortBy], (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        return res.status(200).json({ results, message: 'Success' });
    });
})

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

module.exports = app;