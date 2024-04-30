
import {Database} from './api/db';
import http from "http";
import express from "express";
import {sqlRouter} from "./api/sql-router";

const app = express();

app.use(express.json());

app.use('/api', sqlRouter);
app.use(express.static('website'));

const server = http.createServer(app);
const port: number = 3000;

Database.createTables();
Database.initData();

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});