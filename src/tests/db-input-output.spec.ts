import {Utility} from "../api/utility";
import {Project, User} from "../models";

describe('database-test-user', () => {

    const ifId: string = 'IF210053';
    const ifId2: string = 'IF210063';
    const ifId3: string = 'IF123456';
    const date: Date = new Date(new Date().getFullYear() - 11, 0, 1);

    const user: User = {
        ifId: ifId,
        username: "test123",
        firstname: "Max",
        lastname: "Mustermann",
        birthdate: new Date(date.toDateString()),
        biografie: "",
        permissions: 0,
        department: "Informatik"
    }

    /* region addUser */
    // Test cases for ifId
    test('add-user-invalid-ifId', async() => {
        const success = await Utility.addUser('12345678', user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);
        expect(success).toBeFalsy();

        await deleteUser('12345678');

        await Utility.addUser('IF12345', user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);

        await deleteUser('IF12345');
    });

    // Test cases for username
    test('add-user-invalid-username', async () => {
        // Invalid username: length < 4
        const success1 = await Utility.addUser(ifId3, 'usr', user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);
        expect(success1).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid username: length > 20
        const success2 = await Utility.addUser(ifId3, 'verylongusername1234567890', user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);
        expect(success2).toBeFalsy();

        await deleteUser(ifId3);
    });

    // Test cases for firstname
    test('add-user-invalid-firstname', async () => {
        // Invalid firstname: length < 1
        const success1 = await Utility.addUser(ifId3, user.username, '', user.lastname, user.birthdate, user.biografie, user.permissions, user.department);
        expect(success1).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid firstname: length > 20
        const success2 = await Utility.addUser(ifId3, user.username, 'verylongfirstname1234567890', user.lastname, user.birthdate, user.biografie, user.permissions, user.department);
        expect(success2).toBeFalsy();

        await deleteUser(ifId3);
    });

    // Test cases for lastname
    test('add-user-invalid-lastname', async () => {
        // Invalid lastname: length < 1
        const success1 = await Utility.addUser(ifId3, user.username, user.firstname, '', user.birthdate, user.biografie, user.permissions, user.department);
        expect(success1).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid lastname: length > 20
        const success2 = await Utility.addUser(ifId3, user.username, user.firstname, 'verylonglastname1234567890', user.birthdate, user.biografie, user.permissions, user.department);
        expect(success2).toBeFalsy();

        await deleteUser(ifId3);
    });

    // Test cases for birthdate
    test('add-user-invalid-birthdate', async () => {
        // Invalid birthdate: undefined
        let success = await Utility.addUser(ifId3, user.username, user.firstname, user.lastname, undefined, user.biografie, user.permissions, user.department);
        expect(success).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid birthdate: null
        success = await Utility.addUser(ifId3, user.username, user.firstname, user.lastname, null, user.biografie, user.permissions, user.department);
        expect(success).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid birthdate: more than 100 years ago
        const oldBirthdate = new Date(new Date().getFullYear() - 101, 0, 1); // More than 100 years ago
        success = await Utility.addUser(ifId3, user.username, user.firstname, user.lastname, oldBirthdate, user.biografie, user.permissions, user.department);
        expect(success).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid birthdate: less than 10 years ago
        const recentBirthdate = new Date(new Date().getFullYear() - 9, 0, 1); // Less than 10 years ago
        success = await Utility.addUser(ifId3, user.username, user.firstname, user.lastname, recentBirthdate, user.biografie, user.permissions, user.department);
        expect(success).toBeFalsy();

        await deleteUser(ifId3);
    });

    // Test cases for permissions
    test('add-user-invalid-permissions', async () => {
        // Invalid permissions: negative
        const success = await Utility.addUser(ifId3, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, -1, user.department);
        expect(success).toBeFalsy();

        await deleteUser(ifId3);
    });

    // Test cases for department
    test('add-user-invalid-department', async () => {
        // Invalid department: length < 1
        const success1 = await Utility.addUser(ifId3, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, '');
        expect(success1).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid department: length > 20
        const success2 = await Utility.addUser(ifId3, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, 'verylongdepartment1234567890');
        expect(success2).toBeFalsy();

        await deleteUser(ifId3);
    });

    // Test case for forbidden words in username, firstname, and lastname
    test('add-user-forbidden-words', async () => {
        // Invalid username with forbidden word
        const success1 = await Utility.addUser(ifId3, 'adminUser', user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);
        expect(success1).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid firstname with forbidden word
        const success2 = await Utility.addUser(ifId3, user.username, 'moderatorFirst', user.lastname, user.birthdate, user.biografie, user.permissions, user.department);
        expect(success2).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid lastname with forbidden word
        const success3 = await Utility.addUser(ifId3, user.username, user.firstname, 'userLast', user.birthdate, user.biografie, user.permissions, user.department);
        expect(success3).toBeFalsy();

        await deleteUser(ifId3);
    });

    test('add-user-valid', async() => {
        await Utility.addUser(user.ifId, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);
        await Utility.addUser(ifId2, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);

        let users: User[] | null = await Utility.getUsers();
        const dbUser: User | null = await Utility.getUser(ifId);

        expect(users.length).toBe(2);

        await Utility.deleteUser(ifId);

        users = await Utility.getUsers();

        expect(users.length).toBe(1);
        expect(user).toEqual(dbUser);

        await Utility.deleteUser(ifId2);

        users = await Utility.getUsers();
        expect(users.length).toBe(0);
    });

    /* endregion */

    /* region updateUser */

    test('update-user-invalid-ifId', async() => {
        await Utility.addUser(user.ifId, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);

        let dbUser: User | null = await Utility.getUser(ifId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            ifId: 'IF12345',
            username: "test1234",
            firstname: "Maximilian",
            lastname: "Muster",
            birthdate: new Date(date.toDateString()),
            biografie: "Test",
            permissions: 1,
            department: "Informatik"
        }

        const success = await Utility.updateUser(updatedUser.ifId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        expect(success).toBeFalsy();

        dbUser = await Utility.getUser(ifId);

        expect(user).toEqual(dbUser);

        await Utility.deleteUser(user.ifId);
        await Utility.deleteUser(updatedUser.ifId);
    });

    test('update-user-invalid-username', async() => {
        await Utility.addUser(user.ifId, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);

        let dbUser: User | null = await Utility.getUser(ifId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            ifId: ifId,
            username: "usr",
            firstname: "Maximilian",
            lastname: "Muster",
            birthdate: new Date(date.toDateString()),
            biografie: "Test",
            permissions: 1,
            department: "Informatik"
        }

        const success = await Utility.updateUser(updatedUser.ifId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        expect(success).toBeFalsy();

        dbUser = await Utility.getUser(ifId);

        expect(user).toEqual(dbUser);

        await Utility.deleteUser(user.ifId);
        await Utility.deleteUser(updatedUser.ifId);
    });

    test('update-user-invalid-firstname', async() => {
        await Utility.addUser(user.ifId, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);

        let dbUser: User | null = await Utility.getUser(ifId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            ifId: ifId,
            username: "test1234",
            firstname: "",
            lastname: "Muster",
            birthdate: new Date(date.toDateString()),
            biografie: "Test",
            permissions: 1,
            department: "Informatik"
        }

        const success = await Utility.updateUser(updatedUser.ifId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        expect(success).toBeFalsy();

        dbUser = await Utility.getUser(ifId);

        expect(user).toEqual(dbUser);

        await Utility.deleteUser(user.ifId);
        await Utility.deleteUser(updatedUser.ifId);
    });

    test('update-user-invalid-lastname', async() => {
        await Utility.addUser(user.ifId, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);

        let dbUser: User | null = await Utility.getUser(ifId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            ifId: ifId,
            username: "test1234",
            firstname: "Maximilian",
            lastname: "",
            birthdate: new Date(date.toDateString()),
            biografie: "Test",
            permissions: 1,
            department: "Informatik"
        }

        const success = await Utility.updateUser(updatedUser.ifId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        expect(success).toBeFalsy();

        dbUser = await Utility.getUser(ifId);

        expect(user).toEqual(dbUser);

        await Utility.deleteUser(user.ifId);
        await Utility.deleteUser(updatedUser.ifId);
    });

    test('update-user-invalid-birthdate', async() => {
        await Utility.addUser(user.ifId, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);

        let dbUser: User | null = await Utility.getUser(ifId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            ifId: ifId,
            username: "test1234",
            firstname: "Maximilian",
            lastname: "Muster",
            birthdate: null,
            biografie: "Test",
            permissions: 1,
            department: "Informatik"
        }

        const success = await Utility.updateUser(updatedUser.ifId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        expect(success).toBeFalsy();

        dbUser = await Utility.getUser(ifId);

        expect(user).toEqual(dbUser);

        await Utility.deleteUser(user.ifId);
        await Utility.deleteUser(updatedUser.ifId);
    });

    test('update-user-invalid-permissions', async() => {
        await Utility.addUser(user.ifId, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);

        let dbUser: User | null = await Utility.getUser(ifId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            ifId: ifId,
            username: "test1234",
            firstname: "Maximilian",
            lastname: "Muster",
            birthdate: new Date(date.toDateString()),
            biografie: "Test",
            permissions: -1,
            department: "Informatik"
        }

        const success = await Utility.updateUser(updatedUser.ifId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        expect(success).toBeFalsy();

        dbUser = await Utility.getUser(ifId);

        expect(user).toEqual(dbUser);

        await Utility.deleteUser(user.ifId);
        await Utility.deleteUser(updatedUser.ifId);
    });

    test('update-user-invalid-department', async() => {
        await Utility.addUser(user.ifId, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);

        let dbUser: User | null = await Utility.getUser(ifId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            ifId: ifId,
            username: "test1234",
            firstname: "Maximilian",
            lastname: "Muster",
            birthdate: new Date(date.toDateString()),
            biografie: "Test",
            permissions: 1,
            department: ""
        }

        const success = await Utility.updateUser(updatedUser.ifId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        expect(success).toBeFalsy();

        dbUser = await Utility.getUser(ifId);

        expect(user).toEqual(dbUser);

        await Utility.deleteUser(user.ifId);
        await Utility.deleteUser(updatedUser.ifId);
    });

    test('update-user-valid', async() => {
        await Utility.addUser(user.ifId, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);

        let dbUser: User | null = await Utility.getUser(ifId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            ifId: ifId,
            username: "test1234",
            firstname: "Maximilian",
            lastname: "Muster",
            birthdate: new Date(date.toDateString()),
            biografie: "Test",
            permissions: 1,
            department: "Informatik"
        }

        await Utility.updateUser(updatedUser.ifId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        dbUser = await Utility.getUser(ifId);

        expect(updatedUser).toEqual(dbUser);

        await Utility.deleteUser(user.ifId);
        await Utility.deleteUser(updatedUser.ifId);
    });

    /* endregion */

    /* region addUserAbility */

    test('add-user-ability-invalid-ifId', async() => {
        const success = await Utility.addUserAbility('12345678', 1);
        expect(success).toBeFalsy();
    });

    test('add-user-ability-invalid-abilityId', async() => {
        const success = await Utility.addUserAbility(ifId, -1);
        expect(success).toBeFalsy();
    });

    test('add-user-ability-valid', async() => {
        await Utility.addUser(ifId, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);

        let dbUser: User | null = await Utility.getUser(ifId);

        expect(dbUser).not.toBeNull();

        const success = await Utility.addUserAbility(ifId, 1);
        await Utility.deleteUser(ifId);
        expect(success).toBeTruthy();
    });

    /* endregion */

    /* region addNotification */

    test('add-notification-invalid-userId', async() => {
        const success = await Utility.addNotification('', 'Test', 'Test');
        expect(success).toBeFalsy();
    });

    test('add-notification-invalid-title', async() => {
        await Utility.addUser(ifId, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);

        const success = await Utility.addNotification(ifId, '', 'Test');
        await deleteNotification(ifId);
        await deleteUser(ifId, true);
        expect(success).toBeFalsy();
    });

    test('add-notification-invalid-text', async() => {
        await Utility.addUser(ifId, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);

        const success = await Utility.addNotification(ifId, 'Test', '');
        await deleteNotification(ifId);
        await deleteUser(ifId, true);
        expect(success).toBeFalsy();
    });

    test('add-notification-valid', async() => {
        await Utility.addUser(ifId, user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);

        let dbUser: User | null = await Utility.getUser(ifId);

        expect(dbUser).not.toBeNull();

        const success = await Utility.addNotification(ifId, 'Test', 'Test');
        await deleteNotification(ifId);
        await deleteUser(ifId, true);
        expect(success).toBeTruthy();
    });

    /* endregion */
});

describe('database-test-project', () => {
    const ifId: string = 'IF210053';
    const ifId2: string = 'IF210063';
    const project: Project = {
        id: null,
        name: 'test',
        ownerId: ifId,
        thumbnail: 'image.png',
        description: 'some description',
        dateOfCreation: null,
        links: 'https://www.google.com;https://www.youtube.com',
        maxMembers: 5
    }

    /* region addProject */
    test('add-project-invalid-name', async() => {
        // Invalid name: empty
        const success1 = await Utility.addProject('', project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await deleteProjectByName('', project.ownerId);
        expect(success1).toBeFalsy();

        // Invalid name: length > 20
        const success2 = await Utility.addProject('verylongprojectname1234567890verylongprojectname1234567890', project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await deleteProjectByName('verylongprojectname1234567890verylongprojectname1234567890', project.ownerId);
        expect(success2).toBeFalsy();
    });

    test('add-project-name-already-exists', async() => {
        await deleteProjectByName(project.name, project.ownerId);

        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeTruthy();

        const success2 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteUser(ifId, true);
        expect(success2).toBeFalsy();
    });

    test('add-project-invalid-ownerId', async() => {
        // Invalid ownerId: empty
        const success1 = await Utility.addProject(project.name, '', project.thumbnail, project.description, project.links, project.maxMembers);
        await deleteProjectByName(project.name, '');
        expect(success1).toBeFalsy();

        // Invalid ownerId: length < 8
        const success2 = await Utility.addProject(project.name, 'IF12345', project.thumbnail, project.description, project.links, project.maxMembers);
        await deleteProjectByName(project.name, 'IF12345');
        expect(success2).toBeFalsy();

        // Invalid ownerId: length > 8
        const success3 = await Utility.addProject(project.name, 'IF1234567', project.thumbnail, project.description, project.links, project.maxMembers);
        await deleteProjectByName(project.name, 'IF1234567');
        expect(success3).toBeFalsy();
    });

    test('add-project-invalid-thumbnail', async() => {
        // Invalid thumbnail: length > 255
        const success1 = await Utility.addProject(project.name, project.ownerId, 'verylongthumbnail1234567890'.repeat(25), project.description, project.links, project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        expect(success1).toBeFalsy();
    });

    test('add-project-invalid-description', async() => {
        // Invalid description: empty
        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, '', project.links, project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        expect(success1).toBeFalsy();

        // Invalid description: length > 1000
        const success2 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, 'verylongdescription1234567890'.repeat(100), project.links, project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        expect(success2).toBeFalsy();
    });

    test('add-project-invalid-links', async() => {
        // Invalid links: length > 1000
        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, 'https://www.google.com;'.repeat(100), project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        expect(success1).toBeFalsy();
    });

    test('add-project-invalid-maxMembers', async() => {
        // Invalid maxMembers: < 1
        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, 0);
        await deleteProjectByName(project.name, project.ownerId);
        expect(success1).toBeFalsy();

        // Invalid maxMembers: > 10
        const success2 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, 11);
        await deleteProjectByName(project.name, project.ownerId);
        expect(success2).toBeFalsy();
    });

    test('add-project-valid', async() => {
        await deleteProjectByName(project.name, project.ownerId);

        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteUser(ifId, true);
        expect(success).toBeTruthy();
    });

    /* endregion */

    /* region updateProject */
    test('update-project-invalid-id', async() => {
        const success = await Utility.updateProject(0, project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        expect(success).toBeFalsy();
    });

    test('update-project-invalid-ownerId', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeTruthy();

        const success2 = await Utility.updateProject(1, project.name, '', project.thumbnail, project.description, project.links, project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteProjectByName(project.name, '');
        await deleteUser(ifId, true);
        expect(success2).toBeFalsy();
    });

    test('update-project-invalid-name', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeTruthy();

        const success2 = await Utility.updateProject(1, '', project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteProjectByName('', project.ownerId);
        await deleteUser(ifId, true);
        expect(success2).toBeFalsy();

    });

    test('update-project-invalid-thumbnail', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeTruthy();

        const success2 = await Utility.updateProject(1, project.name, project.ownerId, 'verylongthumbnail1234567890'.repeat(25), project.description, project.links, project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteUser(ifId, true);
        expect(success2).toBeFalsy();
    });

    test('update-project-invalid-description', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeTruthy();

        const success2 = await Utility.updateProject(1, project.name, project.ownerId, project.thumbnail, '', project.links, project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteUser(ifId, true);
        expect(success2).toBeFalsy();
    });

    test('update-project-invalid-links', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeTruthy();

        const success2 = await Utility.updateProject(1, project.name, project.ownerId, project.thumbnail, project.description, 'https://www.google.com;'.repeat(100), project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteUser(ifId, true);
        expect(success2).toBeFalsy();
    });

    test('update-project-invalid-maxMembers', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeTruthy();

        const success2 = await Utility.updateProject(1, project.name, project.ownerId, project.thumbnail, project.description, project.links, 0);
        expect(success2).toBeFalsy();

        const success3 = await Utility.updateProject(1, project.name, project.ownerId, project.thumbnail, project.description, project.links, 11);
        expect(success3).toBeFalsy();

        await deleteProjectByName(project.name, project.ownerId);
        await deleteUser(ifId, true);
    });

    test('update-project-valid', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeTruthy();

        const success2 = await Utility.updateProject(1, 'test123', project.ownerId, 'newImage.png', 'some other', 'github.com;google.com', 6);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteProjectByName('test123', project.ownerId);
        await deleteUser(ifId, true);
        expect(success2).toBeTruthy();
    });

    /* endregion */

    /* region addProjectAbility */

    test('add-project-ability-invalid-projectId', async() => {
        const success = await Utility.addProjectAbility(0, 1);
        expect(success).toBeFalsy();
    });

    test('add-project-ability-invalid-abilityId', async() => {
        const success = await Utility.addProjectAbility(1, -1);
        expect(success).toBeFalsy();
    });

    test('add-project-ability-valid', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);

        const projectId = await Utility.getProjectId(project.name, project.ownerId);

        const success = await Utility.addProjectAbility(projectId, 1);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteUser(ifId, true);
        await Utility.deleteAbilityFromProject(projectId, 1);
        expect(success).toBeTruthy();
    });

    /* endregion */

    /* region addProjectMember */

    test('add-project-member-invalid-projectId', async() => {
        const success = await Utility.addProjectMember(0, ifId);
        expect(success).toBeFalsy();
    });

    test('add-project-member-invalid-userId', async() => {
        const success = await Utility.addProjectMember(1, '');
        await Utility.deleteProjectMember(1, '');
        expect(success).toBeFalsy();
    });

    test('add-project-member-valid', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);

        const projectId = await Utility.getProjectId(project.name, project.ownerId);

        const success = await Utility.addProjectMember(projectId, ifId);
        await Utility.deleteProjectMember(projectId, ifId);
        await deleteProjectByName(project.name, project.ownerId);
        await Utility.deleteUser(ifId);
        expect(success).toBeTruthy();
    });

    /* endregion */

    /* region addLike */

    test('add-like-invalid-projectId', async() => {
        const success = await Utility.addLike(0, ifId);
        expect(success).toBeFalsy();
    });

    test('add-like-invalid-userId', async() => {
        const success = await Utility.addLike(1, '');
        const projectId = await Utility.getProjectId(project.name, project.ownerId);
        await Utility.deleteLike(projectId, '');
        expect(success).toBeFalsy();
    });

    test('add-like-valid', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);

        const projectId = await Utility.getProjectId(project.name, project.ownerId);

        const success = await Utility.addLike(projectId, ifId);
        const dbLike = await Utility.getLikes(projectId);

        const dbProject = await Utility.getLikedProjectsByUserId(ifId);

        expect(dbProject[0].name).toBe(project.name);

        expect(dbLike.length).toBe(1);

        await Utility.deleteLike(projectId, ifId);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteUser(ifId, true);
        expect(success).toBeTruthy();
    });

    /* endregion */

    /* region addView */

    test('add-view-invalid-projectId', async() => {
        const success = await Utility.addView(0, ifId);
        expect(success).toBeFalsy();
    });

    test('add-view-invalid-userId', async() => {
        const success = await Utility.addView(1, '');
        await Utility.deleteViews(1);
        expect(success).toBeFalsy();
    });

    test('add-view-valid', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);

        const projectId: number = await Utility.getProjectId(project.name, project.ownerId);

        const success = await Utility.addView(projectId, ifId);
        const dbView = await Utility.getViews(projectId);

        const views = await Utility.getProjectViews(projectId);

        expect(views).toBe(1);

        expect(dbView.length).toBe(1);

        await Utility.deleteViews(projectId);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteUser(ifId, true);
        expect(success).toBeTruthy();
    });

    /* endregion */

    /* region otherTests */
    //test getProjectsWhereUserIsOwner
    test('get-projects-where-user-is-owner', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await Utility.addProject('test2', project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await Utility.addProject('test3', ifId2, project.thumbnail, project.description, project.links, project.maxMembers);

        const projects1 = await Utility.getProjectsWhereUserIsOwner(ifId);

        expect(projects1.length).toBe(2);

        const projects2 = await Utility.getProjectsWhereUserIsOwner(ifId2);

        expect(projects2).toBe(null);

        const projects3 = await Utility.getProjects();

        expect(projects3.length).toBe(2);

        await Utility.deleteProjectByName(project.name, project.ownerId);
        await Utility.deleteProjectByName('test2', project.ownerId);
        await Utility.deleteProjectByName('test3', ifId2);
        await Utility.deleteUser(ifId);
    });

    //test getProjectsWhereUserIsMember
    test('get-projects-where-user-is-member', async() => {
        await Utility.addUser(ifId, 'test1223', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await Utility.addProject('test2', project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await Utility.addProject('test3', ifId2, project.thumbnail, project.description, project.links, project.maxMembers);

        const projectId1 = await Utility.getProjectId(project.name, project.ownerId);
        const projectId2 = await Utility.getProjectId('test2', project.ownerId);
        const projectId3 = await Utility.getProjectId('test3', ifId2);

        await Utility.addProjectMember(projectId1, ifId2);
        await Utility.addProjectMember(projectId2, ifId2);
        await Utility.addProjectMember(projectId3, ifId2);

        const projects1 = await Utility.getProjectsWhereUserIsMember(ifId2);

        expect(projects1.length).toBe(3);

        const projects3 = await Utility.getProjects();

        expect(projects3.length).toBe(3);

        await Utility.deleteProjectMember(projectId1, ifId);
        await Utility.deleteProjectMember(projectId2, ifId);
        await Utility.deleteProjectMember(projectId3, ifId);
        await Utility.deleteProjectByName(project.name, project.ownerId);
        await Utility.deleteProjectByName('test2', project.ownerId);
        await Utility.deleteProjectByName('test3', ifId2);
        await Utility.deleteUser(ifId);
    });


});

describe('database-test-chat', () => {

    const ifId: string = 'IF210053';
    const ifId2: string = 'IF210063';
    const ifId3: string = 'IF210073';

    /* region addChat */
    test('add-chat-invalid-ifId', async() => {
         const success = await Utility.addDirectChat('ifId', ifId2);
         await Utility.deleteDirectChat('ifId', ifId2);
         expect(success).toBeFalsy();
    });

    test('add-chat-invalid-ifId2', async() => {
         const success = await Utility.addDirectChat(ifId, 'ifId');
         await Utility.deleteDirectChat(ifId, 'ifId');
         expect(success).toBeFalsy();
    });

    test('add-chat-already-exists', async() => {
        await Utility.deleteDirectChat(ifId, ifId2);

        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success = await Utility.addDirectChat(ifId, ifId2);
        expect(success).toBeTruthy();

        const success2 = await Utility.addDirectChat(ifId, ifId2);
        await Utility.deleteDirectChat(ifId, ifId2);
        await Utility.deleteDirectChat(ifId, ifId2);
        await deleteUser(ifId, true);
        await deleteUser(ifId2, true);
        expect(success2).toBeFalsy();
    });

    test('add-chat-valid', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success = await Utility.addDirectChat(ifId, ifId2);
        await Utility.deleteDirectChat(ifId, ifId2);
        await deleteUser(ifId, true);
        await deleteUser(ifId2, true);
        expect(success).toBeTruthy();
    });

    test('add-multiple-chats', async() => {
        await Utility.deleteDirectChat(ifId, ifId2);
        await Utility.deleteDirectChat(ifId, ifId3);
        await Utility.deleteDirectChat(ifId2, ifId3);

        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId3, 'test12345', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addDirectChat(ifId, ifId2);
        expect(success1).toBeTruthy();

        const success2 = await Utility.addDirectChat(ifId, ifId3);
        expect(success2).toBeTruthy();

        const success3 = await Utility.addDirectChat(ifId2, ifId3);
        expect(success3).toBeTruthy();

        const chats1 = await Utility.getDirectChats(ifId);
        const chats2 = await Utility.getDirectChats(ifId2);
        expect(chats1.length).toBe(2);
        expect(chats2.length).toBe(2);

        await Utility.deleteDirectChat(ifId, ifId2);
        await Utility.deleteDirectChat(ifId, ifId3);
        await Utility.deleteDirectChat(ifId2, ifId3);
        await deleteUser(ifId, true);
        await deleteUser(ifId2, true);
        await deleteUser(ifId3, true);
    });

    /* endregion */

    /* region addMessage */
    test('add-message-invalid-ifId', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addDirectChat(ifId, ifId2);
        expect(success1).toBeTruthy();

        const chat = await Utility.getDirectChat(ifId, ifId2);

        const success = await Utility.addMessage(chat.id, 'Test', ifId2);
        await deleteMessage(ifId, ifId2);
        await Utility.deleteDirectChat(ifId, ifId2);
        await deleteUser(ifId, true);
        await deleteUser(ifId2, true);

        expect(success).toBeFalsy();
    });

    test('add-message-invalid-text', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addDirectChat(ifId, ifId2);
        expect(success1).toBeTruthy();

        const chat = await Utility.getDirectChat(ifId, ifId2);

        const success = await Utility.addMessage(chat.id, ifId, '');
        await deleteMessage(ifId, ifId2);
        await Utility.deleteDirectChat(ifId, ifId2);
        await deleteUser(ifId, true);
        await deleteUser(ifId2, true);

        expect(success).toBeFalsy();
    });

    test('add-message-invalid-ifId2', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addDirectChat(ifId, ifId2);
        expect(success1).toBeTruthy();

        const chat = await Utility.getDirectChat(ifId, ifId2);

        const success = await Utility.addMessage(chat.id, ifId3, 'ifId');
        await deleteMessage(ifId, ifId2);
        await Utility.deleteDirectChat(ifId, ifId2);
        await deleteUser(ifId, true);
        await deleteUser(ifId2, true);

        expect(success).toBeFalsy();
    });

    test('add-message-valid', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addDirectChat(ifId, ifId2);
        expect(success1).toBeTruthy();

        const chat = await Utility.getDirectChat(ifId, ifId2);

        const success = await Utility.addMessage(chat.id, ifId, 'hello');
        await deleteMessage(ifId, ifId2);
        await Utility.deleteDirectChat(ifId, ifId2);
        await deleteUser(ifId, true);
        await deleteUser(ifId2, true);

        expect(success).toBeTruthy();
    });

    /* endregion */

    /* region updateMessage */
    test('update-message-invalid-id', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addDirectChat(ifId, ifId2);
        expect(success1).toBeTruthy();

        const chat = await Utility.getDirectChat(ifId, ifId2);

        const success = await Utility.updateMessage(0, chat.id, ifId, 'hello');
        await Utility.deleteDirectChat(ifId, ifId2);
        await deleteUser(ifId, true);
        await deleteUser(ifId2, true);
        expect(success).toBeFalsy();
    });

    test('update-message-invalid-chatId', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addDirectChat(ifId, ifId2);
        expect(success1).toBeTruthy();

        const chat = await Utility.getDirectChat(ifId, ifId2);

        const success = await Utility.updateMessage(1, 0, ifId, 'hello');
        await Utility.deleteDirectChat(ifId, ifId2);
        await deleteUser(ifId, true);
        await deleteUser(ifId2, true);
        expect(success).toBeFalsy();
    });

    test('update-message-invalid-ifId', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addDirectChat(ifId, ifId2);
        expect(success1).toBeTruthy();

        const chat = await Utility.getDirectChat(ifId, ifId2);

        const success = await Utility.updateMessage(1, chat.id, '', 'hello');
        await Utility.deleteDirectChat(ifId, ifId2);
        await deleteUser(ifId, true);
        await deleteUser(ifId2, true);
        expect(success).toBeFalsy();
    });

    test('update-message-invalid-text', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addDirectChat(ifId, ifId2);
        expect(success1).toBeTruthy();

        const chat = await Utility.getDirectChat(ifId, ifId2);

        const success = await Utility.updateMessage(1, chat.id, ifId, '');
        await Utility.deleteDirectChat(ifId, ifId2);
        await deleteUser(ifId, true);
        await deleteUser(ifId2, true);
        expect(success).toBeFalsy();
    });

    test('update-message-valid', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addDirectChat(ifId, ifId2);
        expect(success1).toBeTruthy();

        const chat = await Utility.getDirectChat(ifId, ifId2);

        const success = await Utility.addMessage(chat.id, ifId, 'hello');
        expect(success).toBeTruthy();

        const message = await Utility.getMessages(chat.id);

        const success2 = await Utility.updateMessage(message[0].id, chat.id, ifId, 'hello world');
        await Utility.deleteMessage(ifId, message[0].id);
        await Utility.deleteDirectChat(ifId, ifId2);
        await deleteUser(ifId, true);
        await deleteUser(ifId2, true);
        expect(success2).toBeTruthy();
    });

    /* endregion */

});

/* region Help-Functions */
async function deleteUser(ifId: string, flag:boolean = false) {
    if(!flag) {
        const dbUser: User | null = await Utility.getUser(ifId);
        expect(dbUser).toBeNull();
    }

    await Utility.deleteUser(ifId);
}



async function deleteProject(id: number, ownerId: string) {
    const dbProject: Project | null = await Utility.getProject(id);
    await Utility.deleteProject(ownerId, id);

    expect(dbProject).toBeNull();
}

async function deleteProjectByName(name: string, ownerId: string) {
    await Utility.deleteProjectByName(name, ownerId);
}

async function deleteNotification(userId: string) {
    let dbNotification = await Utility.getNotifications(userId);

    for(const notification of dbNotification) {
        await Utility.deleteNotification(userId, notification.id);
    }

    dbNotification = await Utility.getNotifications(userId);
    expect(dbNotification.length).toBe(0);
}

async function deleteMessage(userId: string, otherUserId: string) {
    const chat = await Utility.getDirectChat(userId, otherUserId);
    let dbMessage = await Utility.getMessages(chat.id);

    for(const message of dbMessage) {
        await Utility.deleteMessage(userId, message.id);
    }

    dbMessage = await Utility.getMessages(chat.id);
    expect(dbMessage.length).toBe(0);
}

/* endregion */