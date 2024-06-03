import express from "express";
import {UserUtility} from "../db/utility/user-utility";;
import {EndPoints} from "../db/validation";

const userRouter = express.Router();

export function createUserEndpoints() {
    /* region Others */

    userRouter.get('/user/abilities', async (req, res) => {
        try {
            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null) {
                res.sendStatus(400);
                return;
            }

            const abilities = await UserUtility.getAllAbilities();

            if(abilities !== null) {
                res.status(200).send(abilities);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    userRouter.get('/user/fullName/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null) {
                res.sendStatus(400);
                return;
            }

            const fullName = await UserUtility.getFullNameByUserId(userId);

            if (fullName !== null) {
                res.status(200).send(fullName);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    userRouter.get('/user/top10/:fullName', async (req, res) => {
        try {
            const fullName = req.params.fullName;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null) {
                res.sendStatus(400);
                return;
            }

            const users = await UserUtility.getTop10UserMatching(fullName);

            if (users !== null) {
                res.status(200).send(users);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    /* endregion */

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

            if(await UserUtility.addUser(userId, username, firstname, lastname, "", email, clazz, bd, "", 1, department)) {
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

            const user = await UserUtility.getUser(userId);

            if (user !== null) {
                res.status(200).send(user);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    userRouter.get('/userId/:fullName', async (req, res) => {
        try {
            const fullName = req.params.fullName;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null) {
                res.sendStatus(400);
                return;
            }

            const userId = await UserUtility.getUserIdByFullName(fullName);

            if (userId !== null) {
                res.status(200).send(userId);
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
                birthdate,
                pfp
            } = req.body;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            const bd = new Date(birthdate);

            const user = await UserUtility.getUser(userId);

            if (await UserUtility.updateUser(userId, username, user.firstname, user.lastname, pfp, user.email, user.clazz, bd, user.biografie, user.permissions, user.department)) {
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

            if (await UserUtility.deleteUser(userId)) {
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

    userRouter.post('/user/:userId/abilities', async (req, res) => {
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
                if (!isNaN(abId) && await UserUtility.addUserAbility(userId, abId)) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(400);
                }
            }
        } catch (e) {
            res.status(400);
        }
    });

    userRouter.get('/user/:userId/abilities', async (req, res) => {
        try {
            const userId = req.params.userId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            const userAbility = await UserUtility.getUserAbilities(userId);

            if (userAbility !== null) {
                res.status(200).send(userAbility);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    userRouter.delete('/user/:userId/abilities/:abilityId', async (req, res) => {
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

            if (await UserUtility.deleteUserAbility(userId, abId)) {
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

            if(await UserUtility.addNotification(userId, title, text)) {
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

            const notification = await UserUtility.getNotifications(userId);

            if(notification !== null) {
                res.status(200).send(notification);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    userRouter.put('/user/notification', async (req, res) => {
        try {
            const {userId, notId} = req.body;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase()) {
                res.sendStatus(400);
                return;
            }

            if(await UserUtility.notificationsSeen(userId, notId)) {
                res.sendStatus(200);
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

            if (await UserUtility.deleteNotification(userId, notId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.status(400);
        }
    });

    /* endregion */

    return userRouter;
}

module.exports = { createUserEndpoints };