import express from "express";
import {Utility} from "../db/utility";
import jwt from "jsonwebtoken";
import {TokenUser} from "../../website/scripts/tokenUser";
import {User} from "../../models";

const userRouter = express.Router();

export function createUserEndpoints() {
    /* region User */
    userRouter.post('/user', async (req, res) => {
        try {
            const {username, birthdate} = req.body;

            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(400).send("Invalid or missing token");
                return;
            }

            const token = authHeader.split(" ")[1];

            const decodedToken  = jwt.decode(token);
            if (!decodedToken) {
                res.status(400).send("Invalid token");
                return;
            }

            const tokenUser = new TokenUser(decodedToken);

            const userId = tokenUser.userId;
            const firstname = tokenUser.firstname;
            const lastname = tokenUser.lastname;
            const email = tokenUser.email;
            const clazz = tokenUser.class;
            const department = tokenUser.department;

            const bd = new Date(birthdate);

            if(await Utility.addUser(userId, username, firstname, lastname, email, clazz, bd, "", 1, department)) {
                res.status(200).send("User added");
            } else {
                res.status(400).send("User not added");
            }
        } catch (e) {
            res.status(400).send("User not added");
        }
    });

    userRouter.get('/user/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;

            const user = await Utility.getUser(userId);

            if (user !== null) {
                res.status(200).send(user);
            } else {
                res.status(400).send("User not found");
            }
        } catch (e) {
            res.status(400).send("User not found");
        }
    });

    userRouter.put('/user', async (req, res) => {
        try {
            const {
                userId,
                username,
                firstname,
                lastname,
                email,
                clazz,
                birthdate,
                biografie,
                permissions,
                department
            } = req.body;

            const bd = new Date(birthdate);

            if (await Utility.updateUser(userId, username, firstname, lastname, email, clazz, bd, biografie, permissions, department)) {
                res.status(200).send("User updated");
            } else {
                res.status(400).send("User not updated");
            }
        } catch (e) {
            res.status(400).send("User not updated");
        }
    });

    userRouter.delete('/user/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;

            if (await Utility.deleteUser(userId)) {
                res.status(200).send("User deleted");
            } else {
                res.status(400).send("User not deleted");
            }
        } catch (e) {
            res.status(400).send("User not deleted");
        }
    });

    /* endregion */

    /* region UserAbility */

    userRouter.post('/user/:userId/ability', async (req, res) => {
        try {
            const userId = req.params.userId;
            const abilityId = parseInt(req.body.abilityId);

            if (isNaN(abilityId)) {
                res.status(400).send("Invalid Ability Id");
                return;
            }

            if (await Utility.addUserAbility(userId, abilityId)) {
                res.status(200).send("User ability added");
            } else {
                res.status(400).send("User ability not added");
            }
        } catch (e) {
            res.status(400).send("User ability not added");
        }
    });

    userRouter.get('/user/:userId/ability', async (req, res) => {
        try {


            const userId = req.params.userId;
            const userAbility = await Utility.getUserAbilities(userId);

            if (userAbility !== null) {
                res.status(200).send(userAbility);
            } else {
                res.status(400).send("User ability not found");
            }
        } catch (e) {
            res.status(400).send("User ability not found");
        }
    });

    userRouter.delete('/user/:userId/ability/:abilityId', async (req, res) => {
        try {
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
        } catch (e) {
            res.status(400).send("User ability not deleted");
        }
    });

    /* endregion */

    /* region Notification */

    userRouter.post('/user/:userId/notification', async (req, res) => {
        try {
            const {title, text} = req.body;
            const userId = req.params.userId;

            if(await Utility.addNotification(userId, title, text)) {
                res.status(200).send("Notification added");
            } else {
                res.status(400).send("Notification not added");
            }
        }
        catch (e) {
            res.status(400).send("Notification not added");
        }
    });

    userRouter.get('/user/:userId/notification', async (req, res) => {
        try {
            const userId = req.params.userId;

            const notification = await Utility.getNotifications(userId);

            if(notification !== null) {
                res.status(200).send(notification);
            } else {
                res.status(400).send("Notification not found");
            }
        } catch (e) {
            res.status(400).send("Notification not found");
        }
    });

    userRouter.delete('/user/:userId/notification/:notId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const notId = parseInt(req.params.notId);


            if (isNaN(notId)) {
                res.status(400).send("Invalid notificationId");
            }

            if (await Utility.deleteNotification(userId, notId)) {
                res.status(200).send("Notification deleted");
            } else {
                res.status(400).send("Notification not deleted");
            }
        } catch (e) {
            res.status(400).send("Notification not deleted");
        }
    });

    /* endregion */

    /* region Others */

    userRouter.get('/user/abilities', async (req, res) => {
        try {
            const abilities = await Utility.getAllAbilities();

            if(abilities !== null) {
                res.status(200).send(abilities);
            } else {
                res.status(400).send("Abilities not found");
            }
        } catch (e) {
            res.status(400).send("Abilities not found");
        }
    });

    /* endregion */

    return userRouter;
}

module.exports = { createUserEndpoints };