const express = require('express');
const config = require("dotenv/config");
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

app.use(cors());

app.all("*", (request, response) => {
    response.sendStatus(404);
});

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})