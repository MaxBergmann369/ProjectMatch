import {Database} from './api/db/db';
import http from "http";
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import {createUserEndpoints} from "./api/router/user-router";
import {createProjectEndpoints} from "./api/router/project-router";
import {createChatEndpoints} from "./api/router/chat-router";
import helmet from "helmet";

const app = express();

const memoryStore = new session.MemoryStore();
app.use(session({
    secret: 'u4ZhRf6B@@FUmLsFmpeGSdQKmfZ@YVBYqc@zQh9Re2y3^VzLV5rST$9EbPW2&%X!9dLz5piKHBmjcMPU4hqZzm3ud6Y7h*aMzNA^^@BDn2!BC7a', //TODO: change secret and save in .env
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
app.use(helmet.frameguard({ action: "sameorigin" }));
const keycloak = new Keycloak({ store: memoryStore });

app.use(keycloak.middleware({
    logout: '/logout'
}));

app.get('/logout', keycloak.protect(), (req: any, res) => {
    req.kauth.logout();
    res.redirect('/');
});



app.use(express.json());
app.use(cors());

const userRouter = createUserEndpoints();
const projectRouter = createProjectEndpoints();
const chatRouter = createChatEndpoints();

app.use('/api',keycloak.protect(), userRouter);
app.use('/api',keycloak.protect(), projectRouter);
app.use('/api',keycloak.protect(), chatRouter);


app.use(express.static('website'));

const server = http.createServer(app);
const port: number = 3000;

Database.createTables();
Database.initData();

server.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});