import express from "express";
import {Database} from "./db";
import {Utility} from "./utility";

export const userRouter = express.Router();

export function createEndpoints() {
    //addUser Utility
    userRouter.post('/addUser', async (req, res) => {
        const {ifId, username, firstname, lastname, birthdate, biografie, permissions, department} = req.body;

        const token = req.headers.authorization as string;

        if(await Utility.addUser(ifId, username, firstname, lastname, birthdate, biografie, permissions, department)) {
            res.status(200).send("User added");
        } else {
            res.status(400).send("User not added");
        }
    });

    //getUser Utility
    userRouter.get('/getUser', async (req, res) => {
        const ifId = req.query.ifId as string;

        const user = await Utility.getUser(ifId);

        if(user !== null) {
            res.status(200).send(user);
        } else {
            res.status(400).send("User not found");
        }
    });

    //updateUser Utility
    userRouter.put('/updateUser', async (req, res) => {
        const {ifId, username, firstname, lastname, birthdate, biografie, permissions, department} = req.body;

        if(await Utility.updateUser(ifId, username, firstname, lastname, birthdate, biografie, permissions, department)) {
            res.status(200).send("User updated");
        } else {
            res.status(400).send("User not updated");
        }
    });

    //deleteUser Utility
    userRouter.delete('/deleteUser', async (req, res) => {
        const ifId = req.query.ifId as string;

        if(await Utility.deleteUser(ifId)) {
            res.status(200).send("User deleted");
        } else {
            res.status(400).send("User not deleted");
        }
    });

    //addUserAbility Utility
    userRouter.post('/addUserAbility', async (req, res) => {
        const {userId, abilityId} = req.body;

        if(await Utility.addUserAbility(userId, abilityId)) {
            res.status(200).send("User ability added");
        } else {
            res.status(400).send("User ability not added");
        }
    });

    //getUserAbility Utility
    userRouter.get('/getUserAbility', async (req, res) => {
        const userId = req.query.userId as string;

        const userAbility = await Utility.getUserAbilities(userId);

        if(userAbility !== null) {
            res.status(200).send(userAbility);
        } else {
            res.status(400).send("User ability not found");
        }
    });
}