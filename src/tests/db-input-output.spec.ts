import {Utility} from "../api/utility";
import {User} from "../api/models";

describe('database-test-user', () => {

    const ifId: string = 'IF210053';
    const ifId2: string = 'IF210063';
    const date: Date = new Date(Date.now());

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

    test('add-user-invalid-ifId', async() => {
        await Utility.addUser('12345678', user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);
        let dbUser: User | null = await Utility.getUser('12345678');
        expect(dbUser).toBeNull();

        await Utility.addUser('IF12345', user.username, user.firstname, user.lastname, user.birthdate, user.biografie, user.permissions, user.department);
        dbUser = await Utility.getUser('IF12345');
        expect(dbUser).toBeNull();
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