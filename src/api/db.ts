import * as sqlite3 from 'sqlite3';

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
            password TEXT
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
}