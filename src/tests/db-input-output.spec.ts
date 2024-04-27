import {Utility} from "../api/utility";
import {User} from "../api/models";

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
});

async function deleteUser(ifId: string) {
    const dbUser: User | null = await Utility.getUser(ifId);
    const success = await Utility.deleteUser(ifId);

    expect(success).toBeTruthy();

    expect(dbUser).toBeNull();
}