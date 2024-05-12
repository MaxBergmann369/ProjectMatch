import express from "express";
import {Utility} from "../db/utility";

const projectRouter = express.Router();

export function createProjectEndpoints() {

    /* region Project */
    projectRouter.post('/projects', async (req, res) => {
        try {
            const {name, ownerId, thumbnail, description, links, maxMembers} = req.body;

            if (await Utility.addProject(name, ownerId, thumbnail, description, links, maxMembers)) {
                res.status(200).send("Project added");
            } else {
                res.status(400).send("Project not added");
            }
        } catch (e) {
            res.status(400).send("Project not added");
        }
    });

    projectRouter.get('/projects/:projId', async (req, res) => {
        try {
            const id = parseInt(req.params.projId);

            if (isNaN(id)) {
                res.status(400).send("Invalid project id");
                return;
            }

            const project = await Utility.getProject(id);

            if (project !== null) {
                res.status(200).send(project);
            } else {
                res.status(400).send("Project not found");
            }
        } catch (e) {
            res.status(400).send("Project not found");
        }
    });

    projectRouter.get('/projects', async (req, res) => {
        try {
            const projects = await Utility.getProjects();

            if (projects !== null) {
                //TODO: algorithm
                res.status(200).send(projects);
            } else {
                res.status(400).send("Projects not found");
            }
        } catch (e) {
            res.status(400).send("Projects not found");
        }
    });

    projectRouter.get('/projects/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;

            const projects = await Utility.getProjectsWhereUserIsOwner(userId);

            if (projects !== null) {
                res.status(200).send(projects);
            } else {
                res.status(400).send("Projects not found");
            }
        } catch (e) {
            res.status(400).send("Projects not found");
        }
    });

    projectRouter.put('/projects', async (req, res) => {
        try {
            const {id, name, ownerId, thumbnail, description, links, maxMembers} = req.body;

            if (await Utility.updateProject(id, name, ownerId, thumbnail, description, links, maxMembers)) {
                res.status(200).send("Project updated");
            } else {
                res.status(400).send("Project not updated");
            }
        } catch (e) {
            res.status(400).send("Project not updated");
        }
    });

    projectRouter.delete('/projects/:userId/:projId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const projectId = req.params.projId;

            const id = parseInt(projectId);

            if (isNaN(id)) {
                res.status(400).send("Invalid project id");
                return;
            }

            if (await Utility.deleteProject(userId, id)) {
                res.status(200).send("Project deleted");
            } else {
                res.status(400).send("Project not deleted");
            }
        } catch (e) {
            res.status(400).send("Project not deleted");
        }
    });

    /* endregion */

    /* region ProjectMember */

    projectRouter.post('/projects/:projId/members', async (req, res) => {
        try {
            const {userId} = req.body;
            const projectId = parseInt(req.params.projId);
            if (isNaN(projectId)) {
                res.status(400).send("Invalid project id");
                return;
            }

            if(await Utility.addProjectMember(projectId, userId)) {
                res.status(200).send("Project member added");
            } else {
                res.status(400).send("Project member not added");
            }
        } catch (e) {
            res.status(400).send("Project member not added");
        }
    });

    projectRouter.get('/projects/:projId', async (req, res) => {
        try {
            const projectId = req.params.projId;

            const id = parseInt(projectId);

            if (isNaN(id)) {
                res.status(400).send("Invalid project id");
                return;
            }

            const projectMembers = await Utility.getProjectMembers(id);

            if (projectMembers !== null) {
                res.status(200).send(projectMembers);
            } else {
                res.status(400).send("Project members not found");
            }
        }
        catch (e) {
            res.status(400).send("Project members not found");
        }
    });

    projectRouter.get('/projects/members/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;
            const projects = await Utility.getProjectsWhereUserIsMember(userId);

            if (projects !== null) {
                res.status(200).send(projects);
            } else {
                res.status(400).send("Projects not found");
            }
        } catch (e) {
            res.status(400).send("Projects not found");
        }
    });

    projectRouter.put('/projects/:projId/members', async (req, res) => {
        try {
            const {userId} = req.body;
            const projectId = parseInt(req.params.projId);
            if (isNaN(projectId)) {
                res.status(400).send("Invalid project id");
                return;
            }

            if (await Utility.projectMemberAccepted(projectId, userId)) {
                res.status(200).send("Project member updated");
            } else {
                res.status(400).send("Project member not updated");
            }
        } catch (e) {
            res.status(400).send("Project member not updated");
        }
    });

    projectRouter.delete('/projects/:projId/members/:userId', async (req, res) => {
        try {
            const projectId = req.params.projId;
            const userId = req.params.userId;

            const id = parseInt(projectId);

            if (isNaN(id)) {
                res.status(400).send("Invalid project id");
                return;
            }

            if (await Utility.deleteProjectMember(id, userId)) {
                res.status(200).send("Project member deleted");
            } else {
                res.status(400).send("Project member not deleted");
            }
        } catch (e) {
            res.status(400).send("Project member not deleted");
        }
    });

    /* endregion */

    /* region View */

    projectRouter.post('/views', async (req, res) => {
        try {
            const {projectId, userId} = req.body;

            if (await Utility.addView(projectId, userId)) {
                res.status(200).send("View added");
            } else {
                res.status(400).send("View not added");
            }
        } catch (e) {
            res.status(400).send("View not added");
        }
    });

    projectRouter.get('/views/:projId', async (req, res) => {
        try {
            const projectId = req.params.projId;

            const id = parseInt(projectId);

            if (isNaN(id)) {
                res.status(400).send("Invalid project id");
                return;
            }

            const views = await Utility.getViews(id);

            if (views !== null) {
                res.status(200).send(views);
            } else {
                res.status(400).send("Views not found");
            }
        } catch (e) {
            res.status(400).send("Views not found");
        }
    });

    /* endregion */

    /* region Like */

    projectRouter.post('/likes', async (req, res) => {
        try {
            const {projectId, userId} = req.body;

            if(await Utility.addLike(projectId, userId)) {
                res.status(200).send("Like added");
            } else {
                res.status(400).send("Like not added");
            }
        } catch (e) {
            res.status(400).send("Like not added");
        }
    });

    projectRouter.get('/likes/:projId', async (req, res) => {
        try {
            const projectId = req.params.projId;

            const id = parseInt(projectId);

            if (isNaN(id)) {
                res.status(400).send("Invalid project id");
                return;
            }

            const likes = await Utility.getLikes(id);

            if (likes !== null) {
                res.status(200).send(likes);
            } else {
                res.status(400).send("Likes not found");
            }
        } catch (e) {
            res.status(400).send("Likes not found");
        }
    });

    projectRouter.delete('/likes/:projId/:userId', async (req, res) => {
        try {
            const projectId = req.params.projId;
            const userId = req.params.userId;

            const id = parseInt(projectId);

            if(isNaN(id)) {
                res.status(400).send("Invalid project id");
                return;
            }

            if(await Utility.deleteLike(id, userId)) {
                res.status(200).send("Like deleted");
            } else {
                res.status(400).send("Like not deleted");
            }
        } catch (e) {
            res.status(400).send("Like not deleted");
        }
    });

    /* endregion */

    /* region projectAbility */

    projectRouter.post('/projects/:projId/abilities', async (req, res) => {
        try {
            const {abilityId} = req.body
            const projectId = parseInt(req.params.projId);
            if (isNaN(projectId)) {
                res.status(400).send("Invalid project id");
                return;
            }

            if (await Utility.addProjectAbility(projectId, abilityId)) {
                res.status(200).send("Project ability added");
            } else {
                res.status(400).send("Project ability not added");
            }
        } catch (e) {
            res.status(400).send("Project ability not added");
        }
    });

    projectRouter.get('/projects/:projId/abilities', async (req, res) => {
        try {
            const projectId = req.params.projId;

            const id = parseInt(projectId);

            if(isNaN(id)) {
                res.status(400).send("Invalid project id");
                return;
            }

            const projectAbilities = await Utility.getAbilitiesByProjectId(id);

            if(projectAbilities !== null) {
                res.status(200).send(projectAbilities);
            } else {
                res.status(400).send("Project abilities not found");
            }
        } catch (e) {
            res.status(400).send("Project abilities not found");
        }
    });

    projectRouter.delete('/projects/:projId/abilities/:abilityId', async (req, res) => {
        try {
            const projectId = req.params.projId;
            const abilityId = req.params.abilityId;

            const id = parseInt(projectId);
            const abId = parseInt(abilityId);

            if (isNaN(id)) {
                res.status(400).send("Invalid project id");
                return;
            }

            if (isNaN(abId)) {
                res.status(400).send("Invalid ability id");
                return;
            }

            if (await Utility.deleteAbilityFromProject(id, abId)) {
                res.status(200).send("Project ability deleted");
            } else {
                res.status(400).send("Project ability not deleted");
            }
        } catch (e) {
            res.status(400).send("Project ability not deleted");
        }
    });

    /* endregion */

    return projectRouter;
}

module.exports = { createProjectEndpoints };