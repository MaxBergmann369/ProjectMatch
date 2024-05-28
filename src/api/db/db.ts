import * as sqlite3 from 'sqlite3';
import {
    User,
    Ability,
    Project,
    View,
    Like,
    Message,
    DirectChat,
    Notification,
    ProjectMember, UserAbility, ProjectAbility
} from "../../models";

const db = new sqlite3.Database('projectMatch.db');

export class Database {
    static createTables() {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS User (
            userId TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            pfp TEXT,
            email TEXT NOT NULL,
            clazz TEXT NOT NULL,
            birthdate TEXT NOT NULL,
            biografie TEXT,
            permissions INTEGER NOT NULL,
            department TEXT NOT NULL
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS Project (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            ownerId TEXT NOT NULL,
            thumbnail TEXT NOT NULL,
            description TEXT,
            dateOfCreation TEXT NOT NULL,
            links TEXT,
            maxMembers INTEGER NOT NULL,
            FOREIGN KEY(ownerId) REFERENCES User(userId)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS ProjectMember (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            projectId INTEGER NOT NULL,
            isAccepted BOOLEAN NOT NULL,
            FOREIGN KEY(userId) REFERENCES User(userId),
            FOREIGN KEY(projectId) REFERENCES Project(id)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS Like (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            projectId INTEGER NOT NULL,
            userId TEXT NOT NULL,
            FOREIGN KEY(projectId) REFERENCES Project(id),
            FOREIGN KEY(userId) REFERENCES User(userId)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS View (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            projectId INTEGER NOT NULL,
            userId TEXT NOT NULL,
            FOREIGN KEY(projectId) REFERENCES Project(id),
            FOREIGN KEY(userId) REFERENCES User(userId)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS Notification (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            title TEXT NOT NULL,
            text TEXT NOT NULL,
            dateTime TEXT NOT NULL,
            FOREIGN KEY(userId) REFERENCES User(userId)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS UserAbility (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            abilityId INTEGER NOT NULL,
            FOREIGN KEY(userId) REFERENCES User(userId),
            FOREIGN KEY(abilityId) REFERENCES Ability(id)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS ProjectAbility (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            projectId INTEGER NOT NULL,
            abilityId INTEGER NOT NULL,
            FOREIGN KEY(projectId) REFERENCES Project(id),
            FOREIGN KEY(abilityId) REFERENCES Ability(id)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS Ability (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            parentId INTEGER,
            FOREIGN KEY(parentId) REFERENCES Ability(id) ON DELETE SET NULL
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS DirectChat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT NOT NULL,
            otherUserId TEXT NOT NULL,
            userLastOpenedDate TEXT,
            userLastOpenedTime TEXT,
            otherLastOpenedDate TEXT,
            otherLastOpenedTime TEXT,
            FOREIGN KEY(userId) REFERENCES User(userId),
            FOREIGN KEY(otherUserId) REFERENCES User(userId)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS Message (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chatId INTEGER NOT NULL,
            userId TEXT NOT NULL,
            message TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            FOREIGN KEY(chatId) REFERENCES DirectChat(id),
            FOREIGN KEY(userId) REFERENCES User(userId)
        )`);
        });
    }

    static initData() {
        db.serialize(async () => {
            // Add Abilities
            await this.insertAbilityIfNotExists("Programming");
            await this.insertAbilityIfNotExists("Design");

            // Programming
            const progId = await this.getParentIdByName("Programming");
            await this.insertAbilityIfNotExists("Java", progId);
            await this.insertAbilityIfNotExists("C#", progId);
            await this.insertAbilityIfNotExists("Python", progId);
            await this.insertAbilityIfNotExists("HTML", progId);
            await this.insertAbilityIfNotExists("CSS", progId);
            await this.insertAbilityIfNotExists("JavaScript", progId);
            await this.insertAbilityIfNotExists("TypeScript", progId);
            await this.insertAbilityIfNotExists("SQL", progId);
            await this.insertAbilityIfNotExists("C++", progId);
            await this.insertAbilityIfNotExists("C", progId);
            await this.insertAbilityIfNotExists("Ruby", progId);
            await this.insertAbilityIfNotExists("PHP", progId);
            await this.insertAbilityIfNotExists("Kotlin", progId);
            await this.insertAbilityIfNotExists("Go", progId);
            await this.insertAbilityIfNotExists("Assembly", progId);
            await this.insertAbilityIfNotExists("Rust", progId);
            await this.insertAbilityIfNotExists("F#", progId);

            // Design
            const designId = await this.getParentIdByName("Design");
            await this.insertAbilityIfNotExists("Photoshop", designId);
            await this.insertAbilityIfNotExists("Illustrator", designId);
            await this.insertAbilityIfNotExists("Gimp", designId);
            await this.insertAbilityIfNotExists("After Effects", designId);
            await this.insertAbilityIfNotExists("Premiere Pro", designId);
            await this.insertAbilityIfNotExists("Video-Editing", designId);
            await this.insertAbilityIfNotExists("3D-Design", designId);
            await this.insertAbilityIfNotExists("2D-Design", designId);
            await this.insertAbilityIfNotExists("UI/UX", designId);
            await this.insertAbilityIfNotExists("Web-Design", designId);
            await this.insertAbilityIfNotExists("Logo-Design", designId);
            await this.insertAbilityIfNotExists("Animation", designId);
            await this.insertAbilityIfNotExists("Character-Design", designId);

            // Java
            const javaId = await this.getParentIdByName("Java");
            await this.insertAbilityIfNotExists("Spring", javaId);
            await this.insertAbilityIfNotExists("Selenium", javaId);
            await this.insertAbilityIfNotExists("JavaFX", javaId);
            await this.insertAbilityIfNotExists("JavaEE", javaId);
            await this.insertAbilityIfNotExists("JavaSE", javaId);

            // C#
            const csId = await this.getParentIdByName("C#");
            await this.insertAbilityIfNotExists("ASP.NET", csId);
            await this.insertAbilityIfNotExists("ASP.NET Core", csId);
            await this.insertAbilityIfNotExists("Unity", csId);
            await this.insertAbilityIfNotExists("WPF", csId);
            await this.insertAbilityIfNotExists("UWP", csId);
            await this.insertAbilityIfNotExists("Xamarin", csId);
            await this.insertAbilityIfNotExists("Blazor", csId);
            await this.insertAbilityIfNotExists("Selenium", csId);

            // Python
            const pyId = await this.getParentIdByName("Python");
            await this.insertAbilityIfNotExists("PyQt", pyId);
            await this.insertAbilityIfNotExists("Tkinter", pyId);
            await this.insertAbilityIfNotExists("Pygame", pyId);
            await this.insertAbilityIfNotExists("Tensorflow", pyId);
            await this.insertAbilityIfNotExists("PyTorch", pyId);
            await this.insertAbilityIfNotExists("Pandas", pyId);
            await this.insertAbilityIfNotExists("Numpy", pyId);
            await this.insertAbilityIfNotExists("Selenium", pyId);

            // JavaScript
            const jsId = await this.getParentIdByName("JavaScript");
            await this.insertAbilityIfNotExists("React", jsId);
            await this.insertAbilityIfNotExists("Angular", jsId);
            await this.insertAbilityIfNotExists("Node.js", jsId);
            await this.insertAbilityIfNotExists("Express", jsId);
            await this.insertAbilityIfNotExists("jQuery", jsId);
            await this.insertAbilityIfNotExists("Cypress", jsId);
            await this.insertAbilityIfNotExists("Jest", jsId);

            // TypeScript
            const tsId = await this.getParentIdByName("TypeScript");
            await this.insertAbilityIfNotExists("Angular", tsId);
            await this.insertAbilityIfNotExists("React", tsId);
            await this.insertAbilityIfNotExists("Node.js", tsId);
            await this.insertAbilityIfNotExists("Express", tsId);
            await this.insertAbilityIfNotExists("NestJS", tsId);
            await this.insertAbilityIfNotExists("Jest", tsId);
            await this.insertAbilityIfNotExists("Webpack", tsId);

            // SQL
            const sqlId = await this.getParentIdByName("SQL");
            await this.insertAbilityIfNotExists("MySQL", sqlId);
            await this.insertAbilityIfNotExists("SQLite", sqlId);
            await this.insertAbilityIfNotExists("MongoDB", sqlId);

            // C++
            const cppId = await this.getParentIdByName("C++");
            await this.insertAbilityIfNotExists("Qt", cppId);
            await this.insertAbilityIfNotExists("OpenGL", cppId);
            await this.insertAbilityIfNotExists("DirectX", cppId);

            // Kotlin
            const kotlinId = await this.getParentIdByName("Kotlin");
            await this.insertAbilityIfNotExists("Android", kotlinId);
            await this.insertAbilityIfNotExists("Spring", kotlinId);
        });
    }

    static async insertAbilityIfNotExists(name: string, parentId: number | null = null): Promise<void> {
        return new Promise((resolve, reject) => {
            const sql:string = parentId ? `SELECT id FROM Ability WHERE name = ? AND parentId=?` : `SELECT id FROM Ability WHERE name = ? AND parentId IS ?`;
            db.get(sql, [name, parentId], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve();
                } else {
                    db.run(`INSERT INTO Ability (name, parentId) VALUES (?, ?)`, [name, parentId], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    }

    static async getParentIdByName(name: string): Promise<number | null> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT id FROM Ability WHERE name = ?`, [name], (err, row: Ability) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(row.id);
                } else {
                    resolve(null);
                }
            });
        });
    }

    //#region GetDataFromDB

    static async getUsers(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM User`, (err, rows: User[]) => {
                if (err) {
                    reject(err);
                } else {
                    const users: User[] = rows.map(row => ({
                        userId: row.userId,
                        username: row.username,
                        firstname: row.firstname,
                        lastname: row.lastname,
                        pfp: row.pfp,
                        email: row.email,
                        clazz: row.clazz,
                        birthdate: new Date(row.birthdate),
                        biografie: row.biografie,
                        permissions: row.permissions,
                        department: row.department
                    }));
                    resolve(users);
                }
            });
        });
    }

    static async getUser(userId: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM User WHERE userId = ?`, [userId], (err, row: User) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    const user: User = {
                        userId: row.userId,
                        username: row.username,
                        firstname: row.firstname,
                        lastname: row.lastname,
                        pfp: row.pfp,
                        email: row.email,
                        clazz: row.clazz,
                        birthdate: new Date(row.birthdate),
                        biografie: row.biografie,
                        permissions: row.permissions,
                        department: row.department
                    };
                    resolve(user);
                }
            });
        });
    }

    static async getUserIdByFullName(firstname: string, lastname: string): Promise<string> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT userId FROM User WHERE firstname = ? AND lastname = ?`, [firstname, lastname], (err, row: User) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.userId);
                }
            });
        });
    }

    static async getFullNameByUserId(userId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT firstname, lastname FROM User WHERE userId = ?`, [userId], (err, row: User) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.firstname + " " + row.lastname);
                }
            });
        });
    }

    static async getTop10UserMatching(firstname: string, lastname: string): Promise<[string, string][]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT userId, firstname, lastname FROM User WHERE firstname LIKE ? AND lastname LIKE ? ORDER BY LENGTH(firstname), LENGTH(lastname), firstname, lastname LIMIT 10`, [firstname + '%', lastname + '%'], (err, rows: User[]) => {
                if (err) {
                    reject(err);
                } else {
                    const users: [string, string][] = rows.map(row => [row.userId, row.firstname + " " + row.lastname]);
                    resolve(users);
                }
            });
        });
    }

    static async isNotificationOwner(userId: string, notificationId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM Notification WHERE userId = ? AND id = ?`, [userId, notificationId], (err, row: Notification) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row !== undefined);
                }
            });
        });
    }

    static async getProjects(): Promise<Project[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Project`, (err, rows: Project[]) => {
                if (err) {
                    reject(err);
                } else {
                    const projects: Project[] = rows.map(row => ({
                        id: row.id,
                        name: row.name,
                        ownerId: row.ownerId,
                        thumbnail: row.thumbnail,
                        description: row.description,
                        dateOfCreation: new Date(row.dateOfCreation),
                        links: row.links,
                        maxMembers: row.maxMembers
                    }));
                    resolve(projects);
                }
            });
        });
    }

    static async getProjectIdBy(ownerId: string, name: string): Promise<number | null> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT id FROM Project WHERE ownerId = ? AND name = ?`, [ownerId, name], (err, row: Project) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    resolve(row.id);
                }
            });
        });
    }

    static async getProject(id: number): Promise<Project | null> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM Project WHERE id = ?`, [id], (err, row: Project) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    const project: Project = {
                        id: row.id,
                        name: row.name,
                        ownerId: row.ownerId,
                        thumbnail: row.thumbnail,
                        description: row.description,
                        dateOfCreation: new Date(row.dateOfCreation),
                        links: row.links,
                        maxMembers: row.maxMembers
                    };
                    resolve(project);
                }
            });
        });
    }

    static async isUserOwnerOfProject(userId: string, projectId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM Project WHERE id = ? AND ownerId = ?`, [projectId, userId], (err, row: Project) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row !== undefined);
                }
            });
        });
    }

    static async getProjectsByOwnerId(ownerId: string): Promise<Project[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Project WHERE ownerId = ?`, [ownerId], (err, rows: Project[]) => {
                if (err) {
                    reject(err);
                } else {
                    const projects: Project[] = rows.map(row => ({
                        id: row.id,
                        name: row.name,
                        ownerId: row.ownerId,
                        thumbnail: row.thumbnail,
                        description: row.description,
                        dateOfCreation: new Date(row.dateOfCreation),
                        links: row.links,
                        maxMembers: row.maxMembers
                    }));
                    resolve(projects);
                }
            });
        });
    }

    static async getAmountOfProjectsByOwnerId(ownerId: string): Promise<number> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT COUNT(*) FROM Project WHERE ownerId = ?`, [ownerId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row['COUNT(*)'] || 0);
                }
            });
        });
    }

    static async getProjectMembersByProjectId(projectId: number): Promise<ProjectMember[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ProjectMember WHERE projectId = ? AND isAccepted = 1`, [projectId], (err, rows: ProjectMember[]) => {
                if (err) {
                    reject(err);
                } else {
                    const projectMembers: ProjectMember[] = rows.map(row => ({
                        id: row.id,
                        projectId: row.projectId,
                        userId: row.userId,
                        isAccepted: row.isAccepted
                    }));
                    resolve(projectMembers);
                }
            });
        });
    }

    static async getAmountOfProjectMembersByProjectId(projectId: number): Promise<number> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT COUNT(*) FROM ProjectMember WHERE projectId = ? AND isAccepted = 1`, [projectId], (err, row: number) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row['COUNT(*)']);
                }
            });
        });
    }

    static async getNotAcceptedProjectMembersByProjectId(projectId: number): Promise<ProjectMember[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ProjectMember WHERE projectId = ? AND isAccepted = 0`, [projectId], (err, rows: ProjectMember[]) => {
                if (err) {
                    reject(err);
                } else {
                    const projectMembers: ProjectMember[] = rows.map(row => ({
                        id: row.id,
                        projectId: row.projectId,
                        userId: row.userId,
                        isAccepted: row.isAccepted
                    }));
                    resolve(projectMembers);
                }
            });
        });
    }

    static async getProjectsWhereUserIsMember(userId: string): Promise<Project[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Project WHERE id IN (SELECT projectId FROM ProjectMember WHERE userId = ?)`, [userId], (err, rows: Project[]) => {
                if (err) {
                    reject(err);
                } else {
                    const projects: Project[] = rows.map(row => ({
                        id: row.id,
                        name: row.name,
                        ownerId: row.ownerId,
                        thumbnail: row.thumbnail,
                        description: row.description,
                        dateOfCreation: new Date(row.dateOfCreation),
                        links: row.links,
                        maxMembers: row.maxMembers
                    }));
                    resolve(projects);
                }
            });
        });
    }

    static async getLikedProjectsByUserId(userId: string): Promise<Project[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Project WHERE id IN (SELECT projectId FROM Like WHERE userId = ?)`, [userId], (err, rows: Project[]) => {
                if (err) {
                    reject(err);
                } else {
                    const projects: Project[] = rows.map(row => ({
                        id: row.id,
                        name: row.name,
                        ownerId: row.ownerId,
                        thumbnail: row.thumbnail,
                        description: row.description,
                        dateOfCreation: new Date(row.dateOfCreation),
                        links: row.links,
                        maxMembers: row.maxMembers
                    }));
                    resolve(projects);
                }
            });
        });
    }

    static async getViewsByProjectId(projectId: number): Promise<View[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM View WHERE projectId = ?`, [projectId], (err, rows: View[]) => {
                if (err) {
                    reject(err);
                } else {
                    const views: View[] = rows.map(row => ({
                        id: row.id,
                        projectId: row.projectId,
                        userId: row.userId
                    }));
                    resolve(views);
                }
            });
        });
    }

    static async getViewCount(projectId: number): Promise<number> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT COUNT(*) FROM View WHERE projectId = ?`, [projectId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row['COUNT(*)'] || 0);
                }
            });
        });
    }

    static async alreadyViewedProject(userId: string, projectId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM View WHERE userId = ? AND projectId = ?`, [userId, projectId], (err, row: View) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row !== undefined);
                }
            });
        });
    }

    static async getLikesByUserId(userId: string): Promise<Like[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Like WHERE userId = ?`, [userId], (err, rows: Like[]) => {
                if (err) {
                    reject(err);
                } else {
                    const likes: Like[] = rows.map(row => ({
                        id: row.id,
                        projectId: row.projectId,
                        userId: row.userId
                    }));
                    resolve(likes);
                }
            });
        });
    }

    static async getLikesByProjectId(projectId: number): Promise<Like[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Like WHERE projectId = ?`, [projectId], (err, rows: Like[]) => {
                if (err) {
                    reject(err);
                } else {
                    const likes: Like[] = rows.map(row => ({
                        id: row.id,
                        projectId: row.projectId,
                        userId: row.userId
                    }));
                    resolve(likes);
                }
            });
        });
    }

    static async getNotificationsByUserId(userId: string): Promise<Notification[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Notification WHERE userId = ?`, [userId], (err, rows: Notification[]) => {
                if (err) {
                    reject(err);
                } else {
                    const notifications: Notification[] = rows.map(row => ({
                        id: row.id,
                        userId: row.userId,
                        title: row.title,
                        text: row.text,
                        dateTime: row.dateTime
                    }));
                    resolve(notifications);
                }
            });
        });
    }

    static async getUserAbilitiesByUserId(userId: string): Promise<Ability[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT abilityId FROM UserAbility WHERE userId = ?`, [userId], async (err, rows: UserAbility[]) => {
                if (err) {
                    reject(err);
                } else {
                    const abilityIds: number[] = rows.map(row => row.abilityId);

                    const abilities: Ability[] = [];
                    for (const abilityId of abilityIds) {
                        const ability = await this.getAbilityById(abilityId);
                        if (ability) {
                            abilities.push(ability);
                        }
                    }

                    resolve(abilities);
                }
            });
        });
    }

    static async userAbilityAlreadyExists(userId: string, abilityId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM UserAbility WHERE userId = ? AND abilityId = ?`, [userId, abilityId], (err, row: UserAbility) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row !== undefined);
                }
            });
        });
    }

    static getProjectAbilitiesByProjectId(projectId: number): Promise<Ability[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT abilityId FROM ProjectAbility WHERE projectId = ?`, [projectId], (err, rows: ProjectAbility[]) => {
                if (err) {
                    reject(err);
                } else {
                    const abilityIds: number[] = rows.map(row => row.abilityId);
                    db.all(`SELECT * FROM Ability WHERE id IN (?)`, [abilityIds], (err, rows: Ability[]) => {
                        if (err) {
                            reject(err);
                        } else {
                            const abilities: Ability[] = rows.map(row => ({
                                id: row.id,
                                name: row.name,
                                parentId: row.parentId
                            }));
                            resolve(abilities);
                        }
                    });
                }
            });
        });
    }

    static async projectAbilityAlreadyExists(projectId: number, abilityId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM ProjectAbility WHERE projectId = ? AND abilityId = ?`, [projectId, abilityId], (err, row: ProjectAbility) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row !== undefined);
                }
            });
        });
    }

    static async getAbilities(): Promise<Ability[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Ability`, (err, rows: Ability[]) => {
                if (err) {
                    reject(err);
                } else {
                    const abilities: Ability[] = rows.map(row => ({
                        id: row.id,
                        name: row.name,
                        parentId: row.parentId
                    }));
                    resolve(abilities);
                }
            });
        });
    }

    static async getAbilityById(abilityId: number): Promise<Ability | null> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM Ability WHERE id = ?`, [abilityId], (err, row: Ability) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    const ability: Ability = {
                        id: row.id,
                        name: row.name,
                        parentId: row.parentId
                    };
                    resolve(ability);
                }
            });
        });
    }

    static async getDirectChatsByUserId(userId: string): Promise<DirectChat[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM DirectChat WHERE userId = ? OR otherUserId = ?`, [userId, userId], (err, rows: DirectChat[]) => {
                if (err) {
                    reject(err);
                } else {
                    const directChats: DirectChat[] = rows.map(row => ({
                        id: row.id,
                        userId: row.userId,
                        otherUserId: row.otherUserId,
                        userLastOpenedDate: row.userLastOpenedDate,
                        userLastOpenedTime: row.userLastOpenedTime,
                        otherLastOpenedDate: row.otherLastOpenedDate,
                        otherLastOpenedTime: row.otherLastOpenedTime
                    }));
                    resolve(directChats);
                }
            });
        });
    }

    static async getDirectChatByUserIds(userId: string, otherUserId: string): Promise<DirectChat | null> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM DirectChat WHERE (userId = ? AND otherUserId = ?) OR (userId = ? AND otherUserId = ?)`, [userId, otherUserId, otherUserId, userId], (err, row: DirectChat) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    const directChat: DirectChat = {
                        id: row.id,
                        userId: row.userId,
                        otherUserId: row.otherUserId,
                        userLastOpenedDate: row.userLastOpenedDate,
                        userLastOpenedTime: row.userLastOpenedTime,
                        otherLastOpenedDate: row.otherLastOpenedDate,
                        otherLastOpenedTime: row.otherLastOpenedTime
                    };
                    resolve(directChat);
                }
            });
        });
    }

    static async getDirectChatById(chatId: number): Promise<DirectChat | null> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM DirectChat WHERE id = ?`, [chatId], (err, row: DirectChat) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    const directChat: DirectChat = {
                        id: row.id,
                        userId: row.userId,
                        otherUserId: row.otherUserId,
                        userLastOpenedDate: row.userLastOpenedDate,
                        userLastOpenedTime: row.userLastOpenedTime,
                        otherLastOpenedDate: row.otherLastOpenedDate,
                        otherLastOpenedTime: row.otherLastOpenedTime
                    };
                    resolve(directChat);
                }
            });
        });
    }

    static async getUnreadMessagesByChatId(chatId: number, userId: string): Promise<number> {
        return new Promise((resolve, reject) => {
            // Get the DirectChat record
            db.get(`SELECT * FROM DirectChat WHERE id = ? AND (userId = ? OR otherUserId = ?)`, [chatId, userId, userId], (err, row: DirectChat) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(0);
                } else {
                    // Determine the last opened date and time for the user
                    const lastOpenedDate = row.userId === userId ? row.userLastOpenedDate : row.otherLastOpenedDate;
                    const lastOpenedTime = row.userId === userId ? row.userLastOpenedTime : row.otherLastOpenedTime;

                    // Get the count of messages that were sent after the last opened date and time
                    db.get(`SELECT COUNT(*) FROM Message WHERE chatId = ? AND userId != ? AND date > ? OR (date = ? AND time > ?)`, [chatId, userId, lastOpenedDate, lastOpenedDate, lastOpenedTime], (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row['COUNT(*)'] || 0);
                        }
                    });
                }
            });
        });
    }

    static async getMessagesByChatId(chatId: number, min: number, max:number): Promise<Message[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Message WHERE chatId = ? ORDER BY id DESC LIMIT ? OFFSET ?`, [chatId, max - min, min], (err, rows: Message[]) => {
                if (err) {
                    reject(err);
                } else {
                    const messages: Message[] = rows.map(row => ({
                        id: row.id,
                        chatId: row.chatId,
                        userId: row.userId,
                        message: row.message,
                        date: row.date,
                        time: row.time
                    }));
                    resolve(messages);
                }
            });
        });
    }

    static async getAmountOfMessages(chatId: number): Promise<number> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT COUNT(*) FROM Message WHERE chatId = ?`, [chatId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row['COUNT(*)'] || 0);
                }
            });
        });
    }

    //#endregionFromD

    //#region InsertDataToDB

    static async addUser(userId: string, username: string, firstname: string, lastname: string, pfp:string, email: string, clazz: string, birthdate: string, biografie: string, permissions: number, department: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO User (userId, username, firstname, lastname, email, clazz, birthdate, biografie, permissions, department) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userId, username, firstname, lastname, email, clazz, birthdate, biografie, permissions, department], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async addProject(name: string, ownerId: string, thumbnail: string, description: string, dateOfCreation: string, links: string, maxMembers: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO Project (name, ownerId, thumbnail, description, dateOfCreation, links, maxMembers) VALUES (?, ?, ?, ?, ?, ?, ?)`, [name, ownerId, thumbnail, description, dateOfCreation, links, maxMembers], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async addProjectMember(userId: string, projectId: number): Promise<boolean> {
        //set isAccepted true
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO ProjectMember (userId, projectId, isAccepted) VALUES (?, ?, ?)`, [userId, projectId, false], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async addView(userId: string, projectId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO View (userId, projectId) VALUES (?, ?)`, [userId, projectId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async addLike(userId: string, projectId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO Like (userId, projectId) VALUES (?, ?)`, [userId, projectId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async addNotification(userId: string, title: string, text: string, date: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO Notification (userId, title, text, dateTime) VALUES (?, ?, ?, ?)`, [userId, title, text, date], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async addUserAbility(userId: string, abilityId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO UserAbility (userId, abilityId) VALUES (?, ?)`, [userId, abilityId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async addUserAbilities(userId: string, abilityIds: number[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run("BEGIN TRANSACTION", async (beginErr) => {
                if (beginErr) {
                    reject(beginErr);
                    return;
                }

                try {
                    for (const abilityId of abilityIds) {
                        await this.addUserAbility(userId, abilityId);
                    }

                    db.run("COMMIT", commitErr => {
                        if (commitErr) {
                            reject(commitErr);
                        } else {
                            resolve(true);
                        }
                    });
                } catch (err) {
                    db.run("ROLLBACK", rollbackErr => {
                        if (rollbackErr) {
                            reject(rollbackErr);
                        } else {
                            resolve(false);
                        }
                    });
                }
            });
        });
    }

    static async addProjectAbility(projectId: number, abilityId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO ProjectAbility (projectId, abilityId) VALUES (?, ?)`, [projectId, abilityId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async addAbility(name: string, parentId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO Ability (name, parentId) VALUES (?, ?)`, [name, parentId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async addDirectChat(userId: string, otherUserId: string, date: string, time: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO DirectChat (userId, otherUserId, userLastOpenedDate, userLastOpenedTime) VALUES (?, ?, ?, ?, ?, ?)`, [userId, otherUserId, date, time], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async addMessage(chatId: number, userId: string, message: string, date: string, time: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO Message (chatId, userId, message, date, time) VALUES (?, ?, ?, ?, ?)`, [chatId, userId, message, date, time], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    //#endregion

    //#region UpdateDataInDB

    static async updateUser(userId: string, username: string, firstname: string, lastname: string, pfp:string, email:string, clazz:string, birthdate: string, biografie: string, permissions: number, department: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE User SET username = ?, firstname = ?, lastname = ?, email = ?, clazz = ?, birthdate = ?, biografie = ?, permissions = ?, department = ? WHERE userId = ?`, [username, firstname, lastname, email, clazz, birthdate, biografie, permissions, department, userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async updateProject(id: number, name: string, ownerId: string, thumbnail: string, description: string, links: string, maxMembers: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE Project SET name = ?, ownerId = ?, thumbnail = ?, description = ?, links = ?, maxMembers = ? WHERE id = ?`, [name, ownerId, thumbnail, description, links, maxMembers, id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async acceptProjectMember(userId: string, projectId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE ProjectMember SET isAccepted = ? WHERE userId = ? AND projectId = ?`, [true, userId, projectId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async updateDirectChatLastOpened(chatId: number, userId: string, date: string, time: string): Promise<boolean> {
        //you have to look if userId === userId than userLastOpenedDate else userId === otherUserId otherLastOpenedDate
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM DirectChat WHERE id = ?`, [chatId], (err, row: DirectChat) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    reject(new Error("Chat not found"));
                } else {
                    const lastOpenedDate = row.userId === userId ? 'userLastOpenedDate' : 'otherLastOpenedDate';
                    const lastOpenedTime = row.userId === userId ? 'userLastOpenedTime' : 'otherLastOpenedTime';
                    db.run(`UPDATE DirectChat SET ${lastOpenedDate} = ?, ${lastOpenedTime} = ? WHERE id = ?`, [date, time, chatId], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        });
    }

    static async updateMessage(id: number, chatId: number, userId: string, message: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE Message SET chatId = ?, userId = ?, message = ? WHERE id = ?`, [chatId, userId, message, id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }
    //#endregion

    //#region DeleteDataFromDB

    static async deleteUser(userId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run("BEGIN TRANSACTION", async (beginErr) => {
                if (beginErr) {
                    reject(beginErr);
                    return;
                }

                try {
                    const successAbilities = await this.deleteUserAbilitiesByUserId(userId);
                    const successProjects = await this.deleteProjectMembersByUserId(userId);
                    const successViews = await this.deleteViewsByUserId(userId);
                    const successLikes = await this.deleteLikesByUserId(userId);
                    const successNotifications = await this.deleteNotificationsByUserId(userId);
                    const successDirectChats = await this.deleteDirectChatsByUserId(userId);

                    if (successAbilities && successProjects && successViews && successLikes && successNotifications && successDirectChats) {
                        db.run(`DELETE FROM User WHERE userId = ?`, [userId], (deleteErr) => {
                            if (deleteErr) {
                                db.run("ROLLBACK", rollbackErr => {
                                    if (rollbackErr) {
                                        reject(rollbackErr);
                                    } else {
                                        resolve(false);
                                    }
                                });
                            } else {
                                db.run("COMMIT", commitErr => {
                                    if (commitErr) {
                                        reject(commitErr);
                                    } else {
                                        resolve(true);
                                    }
                                });
                            }
                        });
                    } else {
                        db.run("ROLLBACK", rollbackErr => {
                            if (rollbackErr) {
                                reject(rollbackErr);
                            } else {
                                resolve(false);
                            }
                        });
                    }
                } catch (error) {
                    db.run("ROLLBACK", rollbackErr => {
                        if (rollbackErr) {
                            reject(rollbackErr);
                        } else {
                            reject(error);
                        }
                    });
                }
            });
        });
    }

    static async deleteDirectChatsByUserId(userId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM DirectChat WHERE userId = ?`, [userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteNotificationsByUserId(userId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM Notification WHERE userId = ?`, [userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteUserAbilitiesByUserId(userId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM UserAbility WHERE userId = ?`, [userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteProjectMembersByUserId(userId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM ProjectMember WHERE userId = ?`, [userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteViewsByUserId(userId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM View WHERE userId = ?`, [userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteLikesByUserId(userId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM Like WHERE userId = ?`, [userId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteProject(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run("BEGIN TRANSACTION", async (beginErr) => {
                if (beginErr) {
                    reject(beginErr);
                    return;
                }

                try {
                    const successMembers = await this.deleteProjectMembersByProjectId(id);
                    const successViews = await this.deleteViewsByProjectId(id);
                    const successLikes = await this.deleteLikesByProjectId(id);
                    const successAbilities = await this.deleteProjectAbilitiesByProjectId(id);

                    if (successMembers && successViews && successLikes && successAbilities) {
                        db.run(`DELETE FROM Project WHERE id = ?`, [id], (deleteErr) => {
                            if (deleteErr) {
                                db.run("ROLLBACK", rollbackErr => {
                                    if (rollbackErr) {
                                        reject(rollbackErr);
                                    } else {
                                        resolve(false);
                                    }
                                });
                            } else {
                                db.run("COMMIT", commitErr => {
                                    if (commitErr) {
                                        reject(commitErr);
                                    } else {
                                        resolve(true);
                                    }
                                });
                            }
                        });
                    } else {
                        db.run("ROLLBACK", rollbackErr => {
                            if (rollbackErr) {
                                reject(rollbackErr);
                            } else {
                                resolve(false);
                            }
                        });
                    }
                } catch (error) {
                    db.run("ROLLBACK", rollbackErr => {
                        if (rollbackErr) {
                            reject(rollbackErr);
                        } else {
                            reject(error);
                        }
                    });
                }
            });
        });
    }

    static async deleteProjectMembersByProjectId(projectId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM ProjectMember WHERE projectId = ?`, [projectId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteViewsByProjectId(projectId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM View WHERE projectId = ?`, [projectId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteLikesByProjectId(projectId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM Like WHERE projectId = ?`, [projectId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteProjectAbilitiesByProjectId(projectId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM ProjectAbility WHERE projectId = ?`, [projectId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteProjectMember(userId: string, projectId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM ProjectMember WHERE userId = ? AND projectId = ?`, [userId, projectId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteLike(userId: string, projectId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM Like WHERE userId = ? AND projectId = ?`, [userId, projectId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteMessage(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM Message WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteDirectChat(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run("BEGIN TRANSACTION", async (beginErr) => {
                if (beginErr) {
                    reject(beginErr);
                    return;
                }

                try {
                    const successMessages = await this.deleteMessagesByChatId(id);

                    if (successMessages) {
                        db.run(`DELETE FROM DirectChat WHERE id = ?`, [id], (deleteErr) => {
                            if (deleteErr) {
                                db.run("ROLLBACK", rollbackErr => {
                                    if (rollbackErr) {
                                        reject(rollbackErr);
                                    } else {
                                        resolve(false);
                                    }
                                });
                            } else {
                                db.run("COMMIT", commitErr => {
                                    if (commitErr) {
                                        reject(commitErr);
                                    } else {
                                        resolve(true);
                                    }
                                });
                            }
                        });
                    } else {
                        db.run("ROLLBACK", rollbackErr => {
                            if (rollbackErr) {
                                reject(rollbackErr);
                            } else {
                                resolve(false);
                            }
                        });
                    }
                } catch (error) {
                    db.run("ROLLBACK", rollbackErr => {
                        if (rollbackErr) {
                            reject(rollbackErr);
                        } else {
                            reject(error);
                        }
                    });
                }
            });
        });
    }

    static async deleteMessagesByChatId(chatId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM Message WHERE chatId = ?`, [chatId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteNotification(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM Notification WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteUserAbility(userId: string, abilityId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM UserAbility WHERE userId = ? AND abilityId = ?`, [userId, abilityId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteProjectAbility(projectId: number, abilityId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM ProjectAbility WHERE projectId = ? AND abilityId = ?`, [projectId, abilityId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    //#endregion
}
