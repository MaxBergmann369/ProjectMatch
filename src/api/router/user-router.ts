import express from "express";
import {Database} from "../db/db";
import {Utility} from "../db/utility";

const userRouter = express.Router();

export function createUserEndpoints() {
    /* region User */
    userRouter.post('/user', async (req, res) => {
        const {userId, username, firstname, lastname, email, clazz, birthdate, biografie, permissions, department} = req.body;

        const token = req.headers.authorization as string;

        const bd = new Date(birthdate);

        if(await Utility.addUser(userId, username, firstname, lastname, email, clazz, bd, biografie, permissions, department)) {
            res.status(200).send("User added");
        } else {
            res.status(400).send("User not added");
        }
    });

    userRouter.get('/user', async (req, res) => {
        const userId = req.query.userId as string;

        const user = await Utility.getUser(userId);

        if(user !== null) {
            res.status(200).send(user);
        } else {
            res.status(400).send("User not found");
        }
    });

    userRouter.put('/user', async (req, res) => {
        const {userId, username, firstname, lastname, email, clazz, birthdate, biografie, permissions, department} = req.body;

        const bd = new Date(birthdate);

        if(await Utility.updateUser(userId, username, firstname, lastname, email, clazz, bd, biografie, permissions, department)) {
            res.status(200).send("User updated");
        } else {
            res.status(400).send("User not updated");
        }
    });

    userRouter.delete('/user', async (req, res) => {
        const userId = req.query.userId as string;

        if(await Utility.deleteUser(userId)) {
            res.status(200).send("User deleted");
        } else {
            res.status(400).send("User not deleted");
        }
    });

    /* endregion */

    /* region UserAbility */

    userRouter.post('/userAbility', async (req, res) => {
        const {userId, abilityId} = req.body;

        if(await Utility.addUserAbility(userId, abilityId)) {
            res.status(200).send("User ability added");
        } else {
            res.status(400).send("User ability not added");
        }
    });

    userRouter.get('/userAbility', async (req, res) => {
        const userId = req.query.userId as string;

        const userAbility = await Utility.getUserAbilities(userId);

        if(userAbility !== null) {
            res.status(200).send(userAbility);
        } else {
            res.status(400).send("User ability not found");
        }
    });

    userRouter.delete('/userAbility', async (req, res) => {
        const userId = req.query.userId as string;
        const abilityId = req.query.abilityId as string;

        const abId: number = parseInt(abilityId);

        if (isNaN(abId)) {
            res.status(400).send("Invalid abilityId");
        }

        if (await Utility.deleteUserAbility(userId, abId)) {
            res.status(200).send("User ability deleted");
        } else {
            res.status(400).send("User ability not deleted");
        }
    });

    /* endregion */

    /* region Notification */

    userRouter.post('/notification', async (req, res) => {
        const {userId, title, text} = req.body;

        if(await Utility.addNotification(userId, title, text)) {
            res.status(200).send("Notification added");
        } else {
            res.status(400).send("Notification not added");
        }
    });

    userRouter.get('/notification', async (req, res) => {
        const userId = req.query.userId as string;

        const notification = await Utility.getNotifications(userId);

        if(notification !== null) {
            res.status(200).send(notification);
        } else {
            res.status(400).send("Notification not found");
        }
    });

    userRouter.delete('/notification', async (req, res) => {
        const userId = req.query.userId as string;
        const notificationId = req.query.notificationId as string;

        const notId: number = parseInt(notificationId);

        if (isNaN(notId)) {
            res.status(400).send("Invalid notificationId");
        }

        if (await Utility.deleteNotification(userId, notId)) {
            res.status(200).send("Notification deleted");
        } else {
            res.status(400).send("Notification not deleted");
        }
    });

    /* endregion */

    return userRouter;
}

module.exports = { createUserEndpoints };