import * as sqlite3 from 'sqlite3';
import {
    User,
    Ability,
    ProjectAbility,
    Project,
    Flame,
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
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            firstname TEXT,
            lastname TEXT,
            birthdate Date,
            email TEXT,
            password TEXT,
            permissions INTEGER
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS Project (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            ownerId INTEGER,
            Thumbnail TEXT,
            Description TEXT,
            DateOfCreation Date,
            Views INTEGER,
            Links TEXT,
            FOREIGN KEY(ownerId) REFERENCES User(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS ProjectMember (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            projectId INTEGER,
            FOREIGN KEY(userId) REFERENCES User(id),
            FOREIGN KEY(projectId) REFERENCES Project(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS Flame (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            projectId INTEGER,
            userId INTEGER,
            FOREIGN KEY(projectId) REFERENCES Project(id),
            FOREIGN KEY(userId) REFERENCES User(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS Notification (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            title TEXT,
            text TEXT,
            date Date,
            FOREIGN KEY(userId) REFERENCES User(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS UserAbility (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            abilityId INTEGER,
            FOREIGN KEY(userId) REFERENCES User(id),
            FOREIGN KEY(abilityId) REFERENCES Ability(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS ProjectAbility (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            projectId INTEGER,
            abilityId INTEGER,
            FOREIGN KEY(projectId) REFERENCES Project(id),
            FOREIGN KEY(abilityId) REFERENCES
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS Ability (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS DirectChat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            otherUserId INTEGER,
            FOREIGN KEY(userId) REFERENCES User(id),
            FOREIGN KEY(otherUserId) REFERENCES User(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS Message (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chatId INTEGER,
            userId INTEGER,
            message TEXT,
            date Date,
            FOREIGN KEY(chatId) REFERENCES DirectChat(id),
            FOREIGN KEY(userId) REFERENCES User(id)
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
                        id: row.id,
                        username: row.username,
                        firstname: row.firstname,
                        lastname: row.lastname,
                        birthdate: new Date(row.birthdate),
                        email: row.email,
                        password: row.password,
                        permissions: row.permissions
                    }));
                    resolve(users);
                }
            });
        });
    }

    static async getUser(id: number): Promise<User> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM User WHERE id = ?`, [id], (err, row: unknown) => {
                if (err) {
                    reject(err);
                } else {
                    const user: User = (row as any).map(row => ({
                        id: row.id,
                        username: row.username,
                        firstname: row.firstname,
                        lastname: row.lastname,
                        birthdate: new Date(row.birthdate),
                        email: row.email,
                        password: row.password,
                        permissions: row.permissions
                    }));
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
                        Thumbnail: row.Thumbnail,
                        Description: row.Description,
                        DateOfCreation: new Date(row.DateOfCreation),
                        Views: row.Views,
                        Links: row.Links
                    }));
                    resolve(projects);
                }
            });
        });
    }

    static async getProject(id: number): Promise<Project> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM Project WHERE id = ?`, [id], (err, row: unknown) => {
                if (err) {
                    reject(err);
                } else {
                    const project: Project = (row as any).map(row => ({
                        id: row.id,
                        name: row.name,
                        ownerId: row.ownerId,
                        Thumbnail: row.Thumbnail,
                        Description: row.Description,
                        DateOfCreation: new Date(row.DateOfCreation),
                        Views: row.Views,
                        Links: row.Links
                    }));
                    resolve(project);
                }
            });
        });
    }

    static async getFlamesByUserId(userId: number): Promise<Flame[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Flame WHERE userId = ?`, [userId], (err, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    const flames: Flame[] = (rows as any[]).map(row => ({
                        id: row.id,
                        projectId: row.projectId,
                        userId: row.userId
                    }));
                    resolve(flames);
                }
            });
        });
    }

    static async getFlamesByProjectId(projectId: number): Promise<Flame[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Flame WHERE projectId = ?`, [projectId], (err, rows: unknown[]) => {
                if (err) {
                    reject(err);
                } else {
                    const flames: Flame[] = (rows as any[]).map(row => ({
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
                                name: row.name
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
                                name: row.name
                            }));
                            resolve(abilities);
                        }
                    });
                }
            });
        });
    }

    //#endregionFromD

    //#region InsertDataToDB

    static async addUser(user: User): Promise<boolean> {
        if(!ValUser.isValid(user)) {
            return false;
        }

        let password = await ValUser.encryptPassword(user.password);

        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO User (username, firstname, lastname, birthdate, email, password, permissions) VALUES (?, ?, ?, ?, ?, ?, ?)`, [user.username, user.firstname, user.lastname, user.birthdate, user.email, password, user.permissions], (err) => {
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
