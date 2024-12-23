const express = require('express');
const mysql = require('mysql2'); 
const bodyparser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyparser.json());
app.use(cors());


const db = mysql.createPool({
    connectionLimit: 10, 
    host: 'mysql', 
    user: 'root',
    password: 'Sairam@04',
    database: 'fstask'
});


db.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
    } else {
        console.log("MySQL connected using Connection Pool");
        connection.release();
    }
});


app.post("/api/employees", (req, res) => {
    const { first_name, last_name, employee_id, email, phone, department, date_of_joining, role } = req.body;

    const query = `
        INSERT INTO employees (first_name, last_name, employee_id, email, phone, department, date_of_joining, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [first_name, last_name, employee_id, email, phone, department, date_of_joining, role], (err, result) => {
        if (err) {
            console.error("Error inserting data into the database:", err);
            if (err.code === "ER_DUP_ENTRY") {
                res.status(400).json({ error: "Employee ID or Email already exists." });
            } else {
                res.status(500).json({ error: "Database error." });
            }
            return;
        }
        res.json({ message: "Employee added successfully" });
    });
});
app.get("/api/employees", (req, res) => {
    const query = "SELECT * FROM employees";

    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching data from the database:", err);
            res.status(500).json({ error: "Database error." });
            return;
        }
        res.json(result);
});
});
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);

});
