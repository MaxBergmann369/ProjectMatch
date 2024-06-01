import {ValUser} from "../db/validation";
import {UserUtility} from "../db/utility/user-utility";
import {Database} from "../db/db";

class ProjectAlgo {
    private static data: Map<string, [number[], number[]]> = new Map<string, [number[], number[]]>();

    static async recommendProjects(userId: string, viewed: boolean = false): Promise<number[]> {
        if(!ValUser.isUserIdValid(userId)) {
            return null;
        }

        const userData = this.data.get(userId);

        if(userData === undefined) {
            await this.initUserData(userId);
        }
        else {
            const projects = userData[1];
            if(projects.length === 0) {
                userData[1] = await this.findProjects(userId, viewed);
            }

            if(projects.length > 5) {
                const userProjects = userData[1].splice(0, 5);
                userData[0].push(...userProjects);

                setTimeout(async () => {
                    const moreProjects = await this.findProjects(userId, viewed);
                    userData[1].push(...moreProjects);
                }, 0);

                return userProjects;
            }

            const userProjects = userData[1];
            userData[0].push(...userProjects);

            if(userProjects.length === 0) {
                userData[0] = [];
            }

            return userProjects;
        }
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
        const mostLiked = await Database.getProjectsAlgorithm(userId, viewed, 50, true, false);
        const mostViewed = await Database.getProjectsAlgorithm(userId, viewed, 50, false, true);
        const mostRecent = await Database.getProjectsAlgorithm(userId, viewed, 50, false, false);

        if(mostLiked === null || mostViewed === null || mostRecent === null ||
            mostLiked.length === 0 || mostViewed.length === 0 || mostRecent.length === 0) {
            return null;
        }

        const orderedProjects: number[] = [];

        const sentToUser = this.data.get(userId)[0];
        let index: number = 0;

        for(let i = 0; i < mostLiked.length + mostViewed.length + mostRecent.length; i++) {
            index = Math.floor(Math.random() * 3);

            if(index === 0) {
                const project = mostLiked.shift();

                if(!orderedProjects.includes(project) && !sentToUser.includes(project)) {
                    orderedProjects.push(project);
                }
            }
            else if(index === 1) {
                const project = mostViewed.shift();

                if(!orderedProjects.includes(project) && !sentToUser.includes(project)) {
                    orderedProjects.push(project);
                }
            }
            else if(index === 2) {
                const project = mostRecent.shift();

                if(!orderedProjects.includes(project) && !sentToUser.includes(project)) {
                    orderedProjects.push(project);
                }
            }
        }

        this.data[userId][0] = [];

        return orderedProjects;
    }
}