import express from "express";
import {Utility} from "../db/utility";

const projectRouter = express.Router();

export function createProjectEndpoints() {

    /* region Project */

    projectRouter.post('/project', async (req, res) => {
        const {name, ownerId, thumbnail, description, links, maxMembers} = req.body;

        if(await Utility.addProject(name, ownerId, thumbnail, description, links, maxMembers)) {
            res.status(200).send("Project added");
        } else {
            res.status(400).send("Project not added");
        }
    });

    projectRouter.get('/project', async (req, res) => {
        const projectId = req.query.projectId as string;

        const id = parseInt(projectId);

        if(isNaN(id)) {
            res.status(400).send("Invalid project id");
            return;
        }

        const project = await Utility.getProject(id);

        if(project !== null) {
            res.status(200).send(project);
        } else {
            res.status(400).send("Project not found");
        }
    });

    projectRouter.get('/projects', async (req, res) => {
        const projects = await Utility.getProjects();

        if(projects !== null) {
            //TODO: algorithm
            res.status(200).send(projects);
        } else {
            res.status(400).send("Projects not found");
        }
    });

    projectRouter.get('/myProjects', async (req, res) => {
        const userId = req.query.userId as string;

        const projects = await Utility.getProjectsWhereUserIsOwner(userId);

        if(projects !== null) {
            res.status(200).send(projects);
        } else {
            res.status(400).send("Projects not found");
        }
    });

    projectRouter.put('/project', async (req, res) => {
        const {id, name, ownerId, thumbnail, description, links, maxMembers} = req.body;

        if(await Utility.updateProject(id, name, ownerId, thumbnail, description, links, maxMembers)) {
            res.status(200).send("Project updated");
        } else {
            res.status(400).send("Project not updated");
        }
    });

    projectRouter.delete('/project', async (req, res) => {
        const userId = req.query.userId as string;
        const projectId = req.query.projectId as string;

        const id = parseInt(projectId);

        if(isNaN(id)) {
            res.status(400).send("Invalid project id");
            return;
        }

        if(await Utility.deleteProject(userId, id)) {
            res.status(200).send("Project deleted");
        } else {
            res.status(400).send("Project not deleted");
        }
    });

    /* endregion */

    /* region ProjectMember */

    projectRouter.post('/projectMember', async (req, res) => {
        const {projectId, userId} = req.body;

        if(await Utility.addProjectMember(projectId, userId)) {
            res.status(200).send("Project member added");
        } else {
            res.status(400).send("Project member not added");
        }
    });

    projectRouter.get('/projectMembers', async (req, res) => {
        const projectId = req.query.projectId as string;

        const id = parseInt(projectId);

        if(isNaN(id)) {
            res.status(400).send("Invalid project id");
            return;
        }

        const projectMembers = await Utility.getProjectMembers(id);

        if(projectMembers !== null) {
            res.status(200).send(projectMembers);
        } else {
            res.status(400).send("Project members not found");
        }
    });

    projectRouter.get('/userIsMember', async (req, res) => {
        const userId = req.query.userId as string;

        const projects = await Utility.getProjectsWhereUserIsMember(userId);

        if(projects !== null) {
            res.status(200).send(projects);
        } else {
            res.status(400).send("Projects not found");
        }
    });

    projectRouter.put('/projectMember', async (req, res) => {
        const {projectId, userId} = req.body;

        if(await Utility.projectMemberAccepted(projectId, userId)) {
            res.status(200).send("Project member updated");
        } else {
            res.status(400).send("Project member not updated");
        }
    });

    projectRouter.delete('/projectMember', async (req, res) => {
        const projectId = req.query.projectId as string;
        const userId = req.query.userId as string;

        const id = parseInt(projectId);

        if(isNaN(id)) {
            res.status(400).send("Invalid project id");
            return;
        }

        if(await Utility.deleteProjectMember(id, userId)) {
            res.status(200).send("Project member deleted");
        } else {
            res.status(400).send("Project member not deleted");
        }
    });

    /* endregion */

    /* region View */

    projectRouter.post('/view', async (req, res) => {
        const {projectId, userId} = req.body;

        if(await Utility.addView(projectId, userId)) {
            res.status(200).send("View added");
        } else {
            res.status(400).send("View not added");
        }
    });

    projectRouter.get('/views', async (req, res) => {
        const projectId = req.query.projectId as string;

        const id = parseInt(projectId);

        if(isNaN(id)) {
            res.status(400).send("Invalid project id");
            return;
        }

        const views = await Utility.getViews(id);

        if(views !== null) {
            res.status(200).send(views);
        } else {
            res.status(400).send("Views not found");
        }
    });

    /* endregion */

    /* region Like */

    projectRouter.post('/like', async (req, res) => {
        const {projectId, userId} = req.body;

        if(await Utility.addLike(projectId, userId)) {
            res.status(200).send("Like added");
        } else {
            res.status(400).send("Like not added");
        }
    });

    projectRouter.get('/likes', async (req, res) => {
        const projectId = req.query.projectId as string;

        const id = parseInt(projectId);

        if(isNaN(id)) {
            res.status(400).send("Invalid project id");
            return;
        }

        const likes = await Utility.getLikes(id);

        if(likes !== null) {
            res.status(200).send(likes);
        } else {
            res.status(400).send("Likes not found");
        }
    });

    projectRouter.delete('/like', async (req, res) => {
        const projectId = req.query.projectId as string;
        const userId = req.query.userId as string;

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
    });

    /* endregion */

    /* region projectAbility */

    projectRouter.post('/projectAbility', async (req, res) => {
        const {projectId, abilityId} = req.body

        if(await Utility.addProjectAbility(projectId, abilityId)) {
            res.status(200).send("Project ability added");
        } else {
            res.status(400).send("Project ability not added");
        }
    });

    projectRouter.get('/projectAbilities', async (req, res) => {
        const projectId = req.query.projectId as string;

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
    });

    projectRouter.delete('/projectAbility', async (req, res) => {
        const projectId = req.query.projectId as string;
        const abilityId = req.query.abilityId as string;

        const id = parseInt(projectId);
        const abId = parseInt(abilityId);

        if(isNaN(id)) {
            res.status(400).send("Invalid project id");
            return;
        }

        if(isNaN(abId)) {
            res.status(400).send("Invalid ability id");
            return;
        }

        if(await Utility.deleteAbilityFromProject(id, abId)) {
            res.status(200).send("Project ability deleted");
        } else {
            res.status(400).send("Project ability not deleted");
        }
    });

    /* endregion */

    return projectRouter;
}

module.exports = { createProjectEndpoints };