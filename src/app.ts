import {Database} from './api/db/db';
import http from "http";
import express from 'express';
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import {createUserEndpoints} from "./api/router/user-router";
import {createProjectEndpoints} from "./api/router/project-router";
import {createChatEndpoints} from "./api/router/chat-router";

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

const userRouter = createUserEndpoints();
const projectRouter = createProjectEndpoints();
const chatRouter = createChatEndpoints();

app.use('/api', userRouter);
app.use('/api', projectRouter);
app.use('/api', chatRouter);

app.use(express.static('website'));

const server = http.createServer(app);
const port: number = 3000;

Database.createTables();
Database.initData();

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});