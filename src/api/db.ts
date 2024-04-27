import * as sqlite3 from 'sqlite3';
import {
    User,
    Ability,
    ProjectAbility,
    Project,
    View,
    Like,
    UserAbility,
    Message,
    DirectChat,
    Notification,
    ProjectMember
} from "./models";
import {ValUser} from "./validation";

const db = new sqlite3.Database('projectMatch.db');

export class Database {
    static createTables() {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS User (
            ifId TEXT PRIMARY KEY,
            username TEXT,
            firstname TEXT,
            lastname TEXT,
            birthdate TEXT,
            biografie TEXT,
            permissions INTEGER,
            department TEXT
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS Project (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            ownerId TEXT,
            thumbnail TEXT,
            description TEXT,
            dateOfCreation TEXT,
            links TEXT,
            maxMembers INTEGER,
            FOREIGN KEY(ownerId) REFERENCES User(ifId)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS ProjectMember (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT,
            projectId INTEGER,
            FOREIGN KEY(userId) REFERENCES User(ifId),
            FOREIGN KEY(projectId) REFERENCES Project(id)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS Like (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            projectId INTEGER,
            userId TEXT,
            FOREIGN KEY(projectId) REFERENCES Project(id),
            FOREIGN KEY(userId) REFERENCES User(ifId)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS View (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            projectId INTEGER,
            userId TEXT,
            FOREIGN KEY(projectId) REFERENCES Project(id),
            FOREIGN KEY(userId) REFERENCES User(ifId)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS Notification (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT,
            title TEXT,
            text TEXT,
            date TEXT,
            FOREIGN KEY(userId) REFERENCES User(ifId)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS UserAbility (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT,
            abilityId INTEGER,
            FOREIGN KEY(userId) REFERENCES User(ifId),
            FOREIGN KEY(abilityId) REFERENCES Ability(id)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS ProjectAbility (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            projectId INTEGER,
            abilityId INTEGER,
            FOREIGN KEY(projectId) REFERENCES Project(id),
            FOREIGN KEY(abilityId) REFERENCES Ability(id)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS Ability (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            parentId INTEGER,
            FOREIGN KEY(parentId) REFERENCES Ability(id)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS DirectChat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT,
            otherUserId TEXT,
            FOREIGN KEY(userId) REFERENCES User(ifId),
            FOREIGN KEY(otherUserId) REFERENCES User(ifId)
        )`);

            db.run(`CREATE TABLE IF NOT EXISTS Message (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chatId INTEGER,
            userId TEXT,
            message TEXT,
            date TEXT,
            FOREIGN KEY(chatId) REFERENCES DirectChat(id),
            FOREIGN KEY(userId) REFERENCES User(ifId)
        )`);
        });
    }

    static initData() {
        //admin account

    }

    //#region GetDataFromDB

    static async getUsers(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM User`, (err, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    const users: User[] = (rows as any[]).map(row => ({
                        ifId: row.ifId,
                        username: row.username,
                        firstname: row.firstname,
                        lastname: row.lastname,
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

    static async getUser(ifId: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM User WHERE ifId = ?`, [ifId], (err, row: any) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    const user: User = {
                        ifId: row.ifId,
                        username: row.username,
                        firstname: row.firstname,
                        lastname: row.lastname,
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

    static async getProjects(): Promise<Project[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Project`, (err, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    const projects: Project[] = (rows as any[]).map(row => ({
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

    static async getProject(id: number): Promise<Project | null> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM Project WHERE id = ?`, [id], (err, row: unknown) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    const project: Project = (row as any).map(row => ({
                        id: row.id,
                        name: row.name,
                        ownerId: row.ownerId,
                        thumbnail: row.thumbnail,
                        description: row.description,
                        dateOfCreation: new Date(row.DateOfCreation),
                        links: row.Links
                    }));
                    resolve(project);
                }
            });
        });
    }

    static async getProjectMembersByProjectId(projectId: number): Promise<ProjectMember[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ProjectMember WHERE projectId = ?`, [projectId], (err, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    const projectMembers: ProjectMember[] = (rows as any[]).map(row => ({
                        id: row.id,
                        projectId: row.projectId,
                        userId: row.userId
                    }));
                    resolve(projectMembers);
                }
            });
        });
    }

    static async getProjectsWhereUserIsMember(userId: number): Promise<ProjectMember[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ProjectMember WHERE userId = ?`, [userId], (err, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    const projectMembers: ProjectMember[] = (rows as any[]).map(row => ({
                        id: row.id,
                        projectId: row.projectId,
                        userId: row.userId
                    }));
                    resolve(projectMembers);
                }
            });
        });
    }

    static async getViewsByUserId(userId: number): Promise<View[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM View WHERE userId = ?`, [userId], (err, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    const views: View[] = (rows as any[]).map(row => ({
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
            db.get(`SELECT COUNT(*) FROM View WHERE projectId = ?`, [projectId], (err, row: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row['COUNT(*)']);
                }
            });
        });
    }

    static async getLikesByUserId(userId: number): Promise<Like[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Flame WHERE userId = ?`, [userId], (err, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    const flames: Like[] = (rows as any[]).map(row => ({
                        id: row.id,
                        projectId: row.projectId,
                        userId: row.userId
                    }));
                    resolve(flames);
                }
            });
        });
    }

    static async getLikesByProjectId(projectId: number): Promise<Like[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Flame WHERE projectId = ?`, [projectId], (err, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    const flames: Like[] = (rows as any[]).map(row => ({
                        id: row.id,
                        projectId: row.projectId,
                        userId: row.userId
                    }));
                    resolve(flames);
                }
            });
        });
    }

    static async getNotificationsByUserId(userId: number): Promise<Notification[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Notification WHERE userId = ?`, [userId], (err, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    const notifications: Notification[] = (rows as any[]).map(row => ({
                        id: row.id,
                        userId: row.userId,
                        title: row.title,
                        text: row.text,
                        date: new Date(row.date)
                    }));
                    resolve(notifications);
                }
            });
        });
    }

    static async getUsersAbilitiesByUserId(userId: number): Promise<Ability[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT abilityId FROM UserAbility WHERE userId = ?`, [userId], (err, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    const abilityIds: number[] = (rows as any[]).map(row => row.abilityId);
                    db.all(`SELECT * FROM Ability WHERE id IN (?)`, [abilityIds], (err, rows: unknown[]) => {
                        if (err) {
                            reject(err);
                        } else {
                            const abilities: Ability[] = (rows as any[]).map(row => ({
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

    static getProjectsAbilitiesByProjectId(projectId: number): Promise<Ability[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT abilityId FROM ProjectAbility WHERE projectId = ?`, [projectId], (err, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    const abilityIds: number[] = (rows as any[]).map(row => row.abilityId);
                    db.all(`SELECT * FROM Ability WHERE id IN (?)`, [abilityIds], (err, rows: unknown[]) => {
                        if (err) {
                            reject(err);
                        } else {
                            const abilities: Ability[] = (rows as any[]).map(row => ({
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

    static async getDirectChatsByUserId(userId: number): Promise<DirectChat[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM DirectChat WHERE userId = ?`, [userId], (err, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    const directChats: DirectChat[] = (rows as any[]).map(row => ({
                        id: row.id,
                        userId: row.userId,
                        otherUserId: row.otherUserId
                    }));
                    resolve(directChats);
                }
            });
        });
    }

    static async getMessagesByChatId(chatId: number): Promise<Message[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Message WHERE chatId = ?`, [chatId], (err, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    const messages: Message[] = (rows as any[]).map(row => ({
                        id: row.id,
                        chatId: row.chatId,
                        userId: row.userId,
                        message: row.message,
                        date: new Date(row.date)
                    }));
                    resolve(messages);
                }
            });
        });
    }

    //#endregionFromD

    //#region InsertDataToDB

    static async addUser(ifId: string, username: string, firstname: string, lastname: string, birthdate: string, biografie: string, permissions: number, department: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO User VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [ifId, username, firstname, lastname, birthdate, biografie, permissions, department], (err) => {
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
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO ProjectMember (userId, projectId) VALUES (?, ?)`, [userId, projectId], (err) => {
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
            db.run(`INSERT INTO Notification (userId, title, text, date) VALUES (?, ?, ?, ?)`, [userId, title, text, date], (err) => {
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

    static async addDirectChat(userId: string, otherUserId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO DirectChat (userId, otherUserId) VALUES (?, ?)`, [userId, otherUserId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async addMessage(chatId: number, userId: string, message: string, date: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO Message (chatId, userId, message, date) VALUES (?, ?, ?, ?)`, [chatId, userId, message, date], (err) => {
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

    static async updateUser(ifId: string, username: string, firstname: string, lastname: string, birthdate: string, biografie: string, permissions: number, department: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE User SET username = ?, firstname = ?, lastname = ?, birthdate = ?, biografie = ?, permissions = ?, department = ? WHERE ifId = ?`, [username, firstname, lastname, birthdate, biografie, permissions, department, ifId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async updateProject(id: number, name: string, ownerId: string, thumbnail: string, description: string, dateOfCreation: string, links: string, maxMembers: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE Project SET name = ?, ownerId = ?, thumbnail = ?, description = ?, dateOfCreation = ?, links = ?, maxMembers = ? WHERE id = ?`, [name, ownerId, thumbnail, description, dateOfCreation, links, maxMembers, id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async updateMessage(id: number, chatId: number, userId: string, message: string, date: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE Message SET chatId = ?, userId = ?, message = ?, date = ? WHERE id = ?`, [chatId, userId, message, date, id], (err) => {
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

    static async deleteUser(ifId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run("BEGIN TRANSACTION", async (beginErr) => {
                if (beginErr) {
                    reject(beginErr);
                    return;
                }

                try {
                    const successAbilities = await this.deleteUserAbilitiesByUserId(ifId);
                    const successProjects = await this.deleteProjectMembersByUserId(ifId);
                    const successViews = await this.deleteViewsByUserId(ifId);
                    const successLikes = await this.deleteLikesByUserId(ifId);
                    const successNotifications = await this.deleteNotificationsByUserId(ifId);
                    const successDirectChats = await this.deleteDirectChatsByUserId(ifId); // Added this line

                    if (successAbilities && successProjects && successViews && successLikes && successNotifications && successDirectChats) {
                        db.run(`DELETE FROM User WHERE ifId = ?`, [ifId], (deleteErr) => {
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

    static async deleteProjectMember(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM ProjectMember WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async deleteLike(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM Like WHERE id = ?`, [id], (err) => {
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

    static async deleteUserAbility(userId: number, abilityId: number): Promise<boolean> {
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
