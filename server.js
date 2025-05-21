const express = require('express');
const db = require('./config/db');
const cors = require('cors');
require('dotenv').config();
require('./config/db')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(require('./routes/employee.routes'));
app.use(require('./routes/department.routes'));
app.listen((process.env.PORT), () => {
    console.log(`Server is running on http://127.0.0.1:${process.env.PORT}`);
    db.connectDB();
});