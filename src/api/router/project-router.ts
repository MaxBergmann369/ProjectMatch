import express from "express";
import {Utility} from "../db/utility";
import {EndPoints} from "../db/validation";

const projectRouter = express.Router();

export function createProjectEndpoints() {

    /* region Project */
    projectRouter.post('/projects', async (req, res) => {
        try {
            const {name, ownerId, thumbnail, description, links, maxMembers} = req.body;

            if (await Utility.addProject(name, ownerId, thumbnail, description, links, maxMembers)) {
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
            const id = parseInt(req.params.projId);

            if (isNaN(id)) {
                res.sendStatus(400);
                return;
            }

            const project = await Utility.getProject(id);

            if (project !== null) {
                res.status(200).send(project);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400)
        }
    });

    projectRouter.get('/projects', async (req, res) => {
        try {
            const projects = await Utility.getProjects();

            if (projects !== null) {
                //TODO: algorithm
                res.status(200).send(projects);
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            res.sendStatus(400);
        }
    });

    projectRouter.get('/projects/owner/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;

            const projects = await Utility.getProjectsWhereUserIsOwner(userId);

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

            if (await Utility.updateProject(id, name, ownerId, thumbnail, description, links, maxMembers)) {
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

            if (await Utility.deleteProject(userId, id)) {
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

            if(await Utility.addProjectMember(projectId, userId)) {
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

            const projectMembers = await Utility.getProjectMembers(id);

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
            const projects = await Utility.getProjectsWhereUserIsMember(userId);

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

            if (await Utility.projectMemberAccepted(projectId, userId)) {
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

            if (await Utility.deleteProjectMember(projectId, userId)) {
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

            if (await Utility.addView(id, userId)) {
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

            const views = await Utility.getViews(projectId);

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

            if(await Utility.addLike(id, userId)) {
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

            const likes = await Utility.getLikes(projectId);

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

            if(await Utility.deleteLike(projectId, userId)) {
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
            const {abilityId} = req.body
            const projectId = parseInt(req.params.projId);

            const authHeader = req.headers.authorization;

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || isNaN(projectId)) {
                res.sendStatus(400);
                return;
            }

            if (await Utility.addProjectAbility(projectId, abilityId)) {
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

            const projectAbilities = await Utility.getAbilitiesByProjectId(projectId);

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

            if (await Utility.deleteAbilityFromProject(projectId, abilityId)) {
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