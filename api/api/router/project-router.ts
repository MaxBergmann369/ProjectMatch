import express from "express";
import {ProjectUtility} from "../db/utility/project-utility";
import {EndPoints} from "../db/validation";
import {ProjectAlgo} from "../algorithm/project-recomendation";
import {Database} from "../db/db";
import {SocketController} from "../socket/socket-controller";

const projectRouter = express.Router();

export function createProjectEndpoints() {

    /* region Project */
    projectRouter.post('/projects', async (req, res) => {
        try {
            const {name, ownerId, thumbnail, description, links, maxMembers} = req.body;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);
            if (tokenUser === null || tokenUser.userId.toLowerCase() !== ownerId.toLowerCase()){
                res.sendStatus(400);
                return;
            }

            const projectId = await ProjectUtility.addProject(name, ownerId, thumbnail, description, links, maxMembers);

            if (projectId >= 0) {
                res.status(200).send(projectId.toString());
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.get('/projects/id/:projId', async (req, res) => {
        try {
            const id = parseInt(req.params.projId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser.userId === null || isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            SocketController.onGetProject(tokenUser.userId, id);

            const project = await ProjectUtility.getProject(id);

            if (project !== null) {
                res.status(200).send(project);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.get('/projects/top10', async (req, res) => {
        try {
            const projects = await Database.getTop10Projects();

            if (projects !== null) {
                res.status(200).send(projects);
            } else {
                res.sendStatus(404);
            }
        }
        catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.get('/projects/:showOld', async (req, res) => {
        try {
            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);
            if (!tokenUser){
                res.sendStatus(400);
                return;
            }

            const showOld = req.params.showOld === "true";
            const limit: number = 5;

            const projectIds = await ProjectAlgo.recommendProjects(tokenUser.userId, showOld, limit);
            const projects = await ProjectUtility.getProjects(projectIds);
            if (projects !== null && projects.length > 0) {
                res.status(200).send(projects);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.delete('/deleteData', async (req, res) => {
        try {
            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);
            if (!tokenUser){
                res.sendStatus(400);
                return;
            }

            if (ProjectAlgo.deleteUserData(tokenUser.userId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.put('/projects', async (req, res) => {
        try {
            const {id, name, ownerId, thumbnail, description, links, maxMembers} = req.body;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);
            if (tokenUser === null || tokenUser.userId.toLowerCase() !== ownerId.toLowerCase()){
                res.sendStatus(400);
                return;
            }

            if (await ProjectUtility.updateProject(id, name, ownerId, thumbnail, description, links, maxMembers)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.delete('/projects/:projId', async (req, res) => {
        try {
            const projectId = req.params.projId;

            const id = parseInt(projectId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);
            if (tokenUser.userId === null || isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            if (await ProjectUtility.deleteProject(tokenUser.userId, id)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    // projectRouter.post('/projects/:projId/abilities', async (req, res) => {
    //     try {
    //         const {abilityIds} = req.body;
    //         const projectId = parseInt(req.params.projId);
    //
    //         if (isNaN(projectId)) {
    //             res.sendStatus(400);
    //             return;
    //         }
    //
    //         if (await ProjectUtility.addProjectAbilities(projectId, abilityIds)) {
    //             res.sendStatus(200);
    //         } else {
    //             res.sendStatus(400);
    //         }
    //
    //     } catch (e) {
    //         res.sendStatus(400);
    //     }
    // });
    /* endregion */

    /* region ProjectMember */

    projectRouter.post('/projects/members/:projId', async (req, res) => {
        try {
            const projectId = parseInt(req.params.projId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);
            if (tokenUser.userId === null || isNaN(projectId)) {
                res.sendStatus(400);
                return;
            }

            if(await ProjectUtility.addMemberRequest(projectId, tokenUser.userId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.get('/projects/members/:projId/:isAccepted', async (req, res) => {
        try {
            const projectId = req.params.projId;
            const isAccepted = req.params.isAccepted === "true";

            const id = parseInt(projectId);

            if (isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            const projectMembers = await ProjectUtility.getProjectMembers(id, isAccepted);

            if (projectMembers !== null) {
                res.status(200).send(projectMembers);
            } else {
                res.sendStatus(400);
            }
        }
        catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.get('/projects/membersCnt/:projId/:isAccepted', async (req, res) => {
        try {
            const projectId = req.params.projId;
            const isAccepted = req.params.isAccepted === "true";

            const id = parseInt(projectId);

            if (isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            const projectMembers = await Database.getProjectMembersCnt(id, isAccepted);

            if (projectMembers !== null) {
                res.status(200).send(projectMembers.toString());
            } else {
                res.sendStatus(400);
            }
        }
        catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.get('/projects/liked/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const projects = await ProjectUtility.getLikedProjectsByUserId(userId);

            if (projects !== null) {
                res.status(200).send(projects);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.get('/users/members/:userId/:isAccepted', async (req, res) => {
        try {
            const userId = req.params.userId;
            const isAccepted = req.params.isAccepted === "true";
            const projects = await ProjectUtility.getProjectsWhereUserIsMember(userId, isAccepted);

            if (projects !== null) {
                res.status(200).send(projects);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.put('/projects/:projId/members/:userId', async (req, res) => {
        try {
            const projectId = parseInt(req.params.projId);
            const userId = req.params.userId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser.userId === null || isNaN(projectId)) {
                res.sendStatus(400);
                return;
            }

            if (await ProjectUtility.projectMemberAccepted(projectId, tokenUser.userId, userId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.delete('/projects/:projId/members/:userId', async (req, res) => {
        try {
            const projectId = parseInt(req.params.projId);
            const userId = req.params.userId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser.userId === null || isNaN(projectId)){
                res.sendStatus(400);
                return;
            }

            if (await ProjectUtility.deleteProjectMember(projectId, tokenUser.userId, userId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    /* endregion */

    /* region View */

    projectRouter.post('/views', async (req, res) => {
        try {
            const {projectId} = req.body;

            const id = parseInt(projectId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser.userId === null || isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            if (await ProjectUtility.addView(id, tokenUser.userId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.get('/views/:projId', async (req, res) => {
        try {
            const projectId = parseInt(req.params.projId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || isNaN(projectId)) {
                res.sendStatus(400);
                return;
            }

            const views = await ProjectUtility.getViews(projectId);

            if (views !== null) {
                res.status(200).send(views.toString());
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    /* endregion */

    /* region Like */

    projectRouter.post('/likes', async (req, res) => {
        try {
            const {projectId} = req.body;

            const id = parseInt(projectId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser.userId === null || isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            if(await ProjectUtility.addLike(id, tokenUser.userId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.get('/isLiked/:projId/:userId', async (req, res) => {
        try {
            const projectId = parseInt(req.params.projId);
            const userId = req.params.userId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || isNaN(projectId)) {
                res.sendStatus(400);
                return;
            }

            if(await ProjectUtility.isProjectLikedByUser(projectId, userId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.get('/likes/:projId', async (req, res) => {
        try {
            const projectId = parseInt(req.params.projId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || isNaN(projectId)) {
                res.sendStatus(400);
                return;
            }

            const likes = await ProjectUtility.getLikes(projectId);

            if (likes !== null) {
                res.status(200).send(likes.toString());
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.delete('/likes/:projId', async (req, res) => {
        try {
            const projectId = parseInt(req.params.projId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser.userId === null || isNaN(projectId)) {
                res.sendStatus(400);
                return;
            }

            if(await ProjectUtility.deleteLike(projectId, tokenUser.userId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    /* endregion */

    /* region projectAbility */

    projectRouter.post('/projects/:projId/abilities', async (req, res) => {
        try {
            const {abilityIds} = req.body;
            const projectId = parseInt(req.params.projId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || isNaN(projectId) || !await ProjectUtility.isUserOwnerOfProject(tokenUser.userId, projectId)) {
                res.sendStatus(400);
                return;
            }

            if (await ProjectUtility.addProjectAbilities(projectId, abilityIds)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.get('/projects/:projId/abilities', async (req, res) => {
        try {
            const projectId = parseInt(req.params.projId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || isNaN(projectId)) {
                res.sendStatus(400);
                return;
            }
            const projectAbilities = await ProjectUtility.getAbilitiesByProjectId(projectId);
            if(projectAbilities !== null) {
                res.status(200).send(projectAbilities);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.delete('/projects/:projId/abilities/:abilityId', async (req, res) => {
        try {
            const projectId = parseInt(req.params.projId);
            const abilityId = parseInt(req.params.abilityId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || isNaN(projectId) || isNaN(abilityId)) {
                res.sendStatus(400);
                return;
            }

            if (await ProjectUtility.deleteAbilityFromProject(projectId, abilityId, tokenUser.userId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    /* endregion */

    return projectRouter;
}

module.exports = { createProjectEndpoints };