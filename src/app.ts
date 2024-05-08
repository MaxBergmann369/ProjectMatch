
import {Database} from './api/db';
import http from "http";
import express from "express";
import {userRouter} from "./api/user-router";

const app = express();

app.use(express.json());

app.use('/api', userRouter);
app.use(express.static('website'));

const server = http.createServer(app);
const port: number = 3000;

Database.createTables();
Database.initData();

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});