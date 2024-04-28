import {Utility} from "../api/utility";
import {Project, User} from "../api/models";

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

        expect(success).toBeTruthy();

        await Utility.deleteUser(ifId);
    });

    /* endregion */
});

describe('database-test-project', () => {
    const ifId: string = 'IF210053';
    const project: Project = {
        id: null,
        name: 'test',
        ownerId: ifId,
        thumbnail: '',
        description: '',
        dateOfCreation: null,
        links: 'https://www.google.com;https://www.youtube.com',
        maxMembers: 5
    }

    test('add-project-invalid-name', async() => {
        // Invalid name: empty
        const success1 = await Utility.addProject('', project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeFalsy();

        // Invalid name: length > 20
        const success2 = await Utility.addProject('verylongprojectname1234567890', project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success2).toBeFalsy();
    });

    test('add-project-invalid-ownerId', async() => {
        // Invalid ownerId: empty
        const success1 = await Utility.addProject(project.name, '', project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeFalsy();

        // Invalid ownerId: length < 8
        const success2 = await Utility.addProject(project.name, 'IF12345', project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success2).toBeFalsy();

        // Invalid ownerId: length > 8
        const success3 = await Utility.addProject(project.name, 'IF1234567', project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success3).toBeFalsy();
    });

    test('add-project-invalid-thumbnail', async() => {
        // Invalid thumbnail: length > 255
        const success1 = await Utility.addProject(project.name, project.ownerId, 'verylongthumbnail1234567890'.repeat(25), project.description, project.links, project.maxMembers);
        expect(success1).toBeFalsy();

    });
});

/* region Help-Functions */
async function deleteUser(ifId: string) {
    const dbUser: User | null = await Utility.getUser(ifId);
    await Utility.deleteUser(ifId);

    expect(dbUser).toBeNull();
}

async function deleteProject(id: number, ownerId: string) {
    const dbProject: Project | null = await Utility.getProject(id);
    const success = await Utility.deleteProject(id);

    expect(success).toBeTruthy();

    expect(dbProject).toBeNull();
}

/* endregion */