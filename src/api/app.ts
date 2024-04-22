
import {Database} from './db';
import http from "http";
import express from "express";
import {sqlRouter} from "./sql-router";

const app = express();

app.use(express.json());

app.use('/api', sqlRouter);

const server = http.createServer(app);
const port: number = 3000;

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});