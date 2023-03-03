import express from "express";
import __dirname from "./utils.js";
import usersRouter from "./routes/users.router.js";

const app = express();

app.use(express.static(__dirname + "/../public"));

app.use('/api/users', usersRouter);

app.listen(8080, () => {
    console.log("Server Listening - Port 8080");
});