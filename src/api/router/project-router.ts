import express from "express";
import {ProjectUtility} from "../db/utility/project-utility";;
import {EndPoints} from "../db/validation";

const projectRouter = express.Router();

const userToViews = new Map<string, number[]>();

export function createProjectEndpoints() {

    /* region Project */
    projectRouter.post('/projects', async (req, res) => {
        try {
            const {name, ownerId, thumbnail, description, links, maxMembers} = req.body;

            if (await ProjectUtility.addProject(name, ownerId, thumbnail, description, links, maxMembers)) {
                res.sendStatus(200);
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

            if (isNaN(id)) {
                res.sendStatus(400);
                return;
            }

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

    projectRouter.get('/projects/:showOld', async (req, res) => {
        try {
            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);
            if (!tokenUser){
                res.sendStatus(400);
                return;
            }
            let showOld = req.params.showOld === "true";
            const prevViews = userToViews.get(tokenUser.userId)??[];
            const limit = 5;
            const projects = await ProjectUtility.getProjects(tokenUser.userId, showOld, limit, prevViews);
            if (projects !== null && projects.length > 0) {
                const views = projects.map(value => value.id);
                if (projects.length < limit){
                    showOld = true;
                }
                userToViews.set(tokenUser.userId, showOld? prevViews.concat(views) : views);
                //TODO: algorithm
                res.status(200).send(projects);
            } else {
                if (showOld){
                    userToViews.set(tokenUser.userId, []);
                }
                res.sendStatus(404);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.get('/projects/owner/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;

            const projects = await ProjectUtility.getProjectsWhereUserIsOwner(userId);

            if (projects !== null) {
                res.status(200).send(projects);
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

            if (await ProjectUtility.updateProject(id, name, ownerId, thumbnail, description, links, maxMembers)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.delete('/projects/:userId/:projId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const projectId = req.params.projId;

            const id = parseInt(projectId);

            if (isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            if (await ProjectUtility.deleteProject(userId, id)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    /* endregion */

    /* region ProjectMember */

    projectRouter.post('/projects/:projId/members', async (req, res) => {
        try {
            const {userId} = req.body;
            const projectId = parseInt(req.params.projId);
            if (isNaN(projectId)) {
                res.sendStatus(400);
                return;
            }

            if(await ProjectUtility.addProjectMember(projectId, userId)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.get('/projects/:projId', async (req, res) => {
        try {
            const projectId = req.params.projId;

            const id = parseInt(projectId);

            if (isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            const projectMembers = await ProjectUtility.getProjectMembers(id);

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

    projectRouter.get('/projects/members/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const projects = await ProjectUtility.getProjectsWhereUserIsMember(userId);

            if (projects !== null) {
                res.status(200).send(projects);
            } else {
                res.sendStatus(400);
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

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase() || isNaN(projectId)) {
                res.sendStatus(400);
                return;
            }

            if (await ProjectUtility.projectMemberAccepted(projectId, userId)) {
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

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase() || isNaN(projectId)) {
                res.sendStatus(400);
                return;
            }

            if (await ProjectUtility.deleteProjectMember(projectId, userId)) {
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
            const {projectId, userId} = req.body;

            const id = parseInt(projectId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase() || isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            if (await ProjectUtility.addView(id, userId)) {
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
                res.status(200).send(views);
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
            const {projectId, userId} = req.body;

            const id = parseInt(projectId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase() || isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            if(await ProjectUtility.addLike(id, userId)) {
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
                res.status(200).send(likes);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.delete('/likes/:projId/:userId', async (req, res) => {
        try {
            const projectId = parseInt(req.params.projId);
            const userId = req.params.userId;

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId.toLowerCase() !== userId.toLowerCase() || isNaN(projectId)) {
                res.sendStatus(400);
                return;
            }

            if(await ProjectUtility.deleteLike(projectId, userId)) {
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
            const {abilityId} = req.body;
            const projectId = parseInt(req.params.projId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || isNaN(projectId)) {
                res.sendStatus(400);
                return;
            }

            if (await ProjectUtility.addProjectAbility(projectId, abilityId)) {
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

            if (await ProjectUtility.deleteAbilityFromProject(projectId, abilityId)) {
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