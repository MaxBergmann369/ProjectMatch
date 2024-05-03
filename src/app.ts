import express from 'express';
// import Keycloak from 'keycloak-connect';
// import session from 'express-session';

const app = express();
const port = 3666;

// middleware
app.use(express.json());
app.use(express.static('website'));


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});