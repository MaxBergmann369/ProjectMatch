import express from "express";
import {Utility} from "../db/utility";
import {EndPoints} from "../db/validation";

const userRouter = express.Router();

export function createUserEndpoints() {
    /* region User */
    userRouter.post('/user', async (req, res) => {
        try {
            const {username, birthdate} = req.body;

            /* region Authorization */
            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null) {
                res.sendStatus(400);
                return;
            }

            /* endregion */

            const userId = tokenUser.userId;
            const firstname = tokenUser.firstname;
            const lastname = tokenUser.lastname;
            const email = tokenUser.email;
            const clazz = tokenUser.class;
            const department = tokenUser.department;

            const bd = new Date(birthdate);

            if(await Utility.addUser(userId, username, firstname, lastname, email, clazz, bd, "", 1, department)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    userRouter.get('/user/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;

            /* region Authorization */
            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null) {
                res.sendStatus(400);
                return;
            }

            /* endregion */

            const user = await Utility.getUser(userId);

            if (user !== null) {
                res.status(200).send(user);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.sendStatus(400);
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

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            const bd = new Date(birthdate);

            if (await Utility.updateUser(userId, username, firstname, lastname, email, clazz, bd, biografie, permissions, department)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    userRouter.delete('/user/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            if (await Utility.deleteUser(userId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.status(400);
        }
    });

    /* endregion */

    /* region UserAbility */

    userRouter.post('/user/:userId/ability', async (req, res) => {
        try {
            const userId = req.params.userId;
            const abilityIds = req.body.abilityId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            for(const abilityId of abilityIds) {
                const abId: number = parseInt(abilityId);
                if (!isNaN(abId) && await Utility.addUserAbility(userId, abId)) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(400);
                }
            }
        } catch (e) {
            res.status(400);
        }
    });

    userRouter.get('/user/:userId/ability', async (req, res) => {
        try {
            const userId = req.params.userId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            const userAbility = await Utility.getUserAbilities(userId);

            if (userAbility !== null) {
                res.status(200).send(userAbility);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    userRouter.delete('/user/:userId/ability/:abilityId', async (req, res) => {
        try {
            const userId = req.query.userId as string;
            const abilityId = req.query.abilityId as string;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            const abId: number = parseInt(abilityId);

            if (isNaN(abId)) {
                res.sendStatus(400);
            }

            if (await Utility.deleteUserAbility(userId, abId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    /* endregion */

    /* region Notification */

    userRouter.post('/user/:userId/notification', async (req, res) => {
        try {
            const {title, text} = req.body;
            const userId = req.params.userId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            if(await Utility.addNotification(userId, title, text)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        }
        catch (e) {
            res.sendStatus(400);
        }
    });

    userRouter.get('/user/:userId/notification', async (req, res) => {
        try {
            const userId = req.params.userId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            const notification = await Utility.getNotifications(userId);

            if(notification !== null) {
                res.status(200).send(notification);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    userRouter.delete('/user/:userId/notification/:notId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const notId = parseInt(req.params.notId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase() || isNaN(notId)) {
                res.sendStatus(400);
                return;
            }

            if (await Utility.deleteNotification(userId, notId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.status(400);
        }
    });

    /* endregion */

    /* region Others */

    userRouter.get('/user/abilities', async (req, res) => {
        try {
            const abilities = await Utility.getAllAbilities();

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null) {
                res.sendStatus(400);
                return;
            }

            if(abilities !== null) {
                res.status(200).send(abilities);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    /* endregion */

    return userRouter;
}

module.exports = { createUserEndpoints };