const express = require('express');
const config = require("dotenv/config");
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const passport = require("passport");
const authRouter = require("./routes/authRoutes");
const eventRouter = require("./routes/eventRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use(cors());

app.get("/", (request, response) => {
    response.send("Hello World!");
});

app.use("/auth", authRouter);
app.use(authMiddleware.authenticate("jwt", { session: false }));
app.use("/event", eventRouter);

app.all("*", (request, response) => {
    response.json({
        message: "Erreur 404",
        status: 404
    })
});

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})