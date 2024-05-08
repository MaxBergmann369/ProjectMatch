import {Database} from './api/db';
import http from "http";
import express from 'express';
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import {createEndpoints} from "./api/user-router";

const app = express();

/*
const memoryStore = new session.MemoryStore();
app.use(session({
    secret: 'some long secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
const keycloak = new Keycloak({ store: memoryStore });

app.use(keycloak.middleware({
    logout: '/logout'
}));

app.get('/logout', keycloak.protect(), (req: any, res) => {
    req.kauth.logout();
    res.redirect('/');
});

*/

app.use(express.json());

const userRouter = createEndpoints();
app.use('/api', userRouter);
app.use(express.static('website'));

const server = http.createServer(app);
const port: number = 3000;

Database.createTables();
Database.initData();

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});