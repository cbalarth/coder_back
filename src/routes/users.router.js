import { Router, json } from "express";

const usersRouter = Router();
usersRouter.use(json());

let users = [];

usersRouter.get("/", (req, res) => {
    res.send(users)
});

usersRouter.post("/", (req, res) => {
    const newUser = {
        ...req.body,
    }
    users = [...users, newUser];

    res.send(newUser);
});

export default usersRouter;