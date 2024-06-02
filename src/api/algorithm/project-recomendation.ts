import {ValUser} from "../db/validation";
import {UserUtility} from "../db/utility/user-utility";
import {Database} from "../db/db";

export class ProjectAlgo {
    private static data: Map<string, [number[], number[]]> = new Map<string, [number[], number[]]>();

    static async recommendProjects(userId: string, viewed: boolean = false, limit: number): Promise<number[]> {
        if(!ValUser.isUserIdValid(userId) || limit < 1 || limit > 50) {
            return null;
        }

        let userData = this.data.get(userId);

        if(userData === undefined) {
            await this.initUserData(userId);
        }

        userData = this.data.get(userId);

        const projects = userData[1];

        if(projects.length === 0 || projects.length <= limit + 1) {
            const moreProjects = await this.findProjects(userId, viewed);
            userData[1].push(...moreProjects);
        }

        const userProjects = userData[1].splice(0, limit);
        userData[0].push(...userProjects);

        return userProjects;
    }

    static async deleteUserData(userId: string) {
        this.data.delete(userId);
    }

    private static async initUserData(userId: string) {
        const user = await UserUtility.getUser(userId);

        if(user === null) {
            return null;
        }

        this.data.set(userId, [[], []]);
    }

    private static async findProjects(userId: string, viewed: boolean) {
        try {
            const mostLiked = await Database.getProjectsAlgorithm(userId, viewed, 50, true, false);
            const mostViewed = await Database.getProjectsAlgorithm(userId, viewed, 50, false, true);
            const mostRecent = await Database.getProjectsAlgorithm(userId, viewed, 50, false, false);

            if (mostLiked === null || mostViewed === null || mostRecent === null ||
                mostLiked.length === 0 || mostViewed.length === 0 || mostRecent.length === 0) {
                return [];
            }

            const orderedProjects: number[] = [];

            const sentToUser = this.data.get(userId)[0];
            const otherProjects = this.data.get(userId)[1];

            for (let i = 0; i < mostLiked.length + mostViewed.length + mostRecent.length; i++) {

                if (i%2 === 0) {
                    const project = mostLiked.shift();

                    if (!orderedProjects.includes(project) && !sentToUser.includes(project) && !otherProjects.includes(project)) {
                        orderedProjects.push(project);
                    }
                } else if (i%3 === 0) {
                    const project = mostViewed.shift();

                    if (!orderedProjects.includes(project) && !sentToUser.includes(project) && !otherProjects.includes(project)) {
                        orderedProjects.push(project);
                    }
                } else {
                    const project = mostRecent.shift();

                    if (!orderedProjects.includes(project) && !sentToUser.includes(project) && !otherProjects.includes(project)) {
                        orderedProjects.push(project);
                    }
                }
            }

            this.data.get(userId)[0] = [];

            return orderedProjects;
        }
        catch (e) {
            return [];
        }
    }
}