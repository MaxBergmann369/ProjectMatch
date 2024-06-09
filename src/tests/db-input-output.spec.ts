import {Utility} from "../api/db/utility";
import {Project, User} from "../models";

describe('database-test-user', () => {

    const ifId: string = 'IF210053';
    const ifId2: string = 'IF210063';
    const ifId3: string = 'IF123456';
    const itId1: string = 'IT123456';
    const itId2: string = 'IT210053';
    const itId3: string = 'IT210063';
  
    const date: Date = new Date(new Date().getFullYear() - 11, 0, 1);
    const birthdateAlin: Date = new Date(2007, 2, 24);
  
    const userIf: User = {
        userId: "IF123456",
        username: "sachSpieler",
        firstname: "Max",
        lastname: "Bergmann",
        email: "b.bergmann@students.htl-leonding.ac.at",
        clazz: "3BHIF",
        birthdate: date,
        biografie: "Ich spiele gerne Schach",
        permissions: 1,
        department: "Informatik"
    };

    const userIt: User = {
        userId: itId1,
        username: "alinjsc5",
        firstname: "Alin",
        lastname: "Jasic",
        email: "a.jasic@students.htl-leonding.ac.at",
        clazz: "3AHITM",
        birthdate: birthdateAlin,
        biografie: "test",
        permissions: 1,
        department: "Medientechnik"
    };


    /* region addUser */
    // Test cases for ifId
    test('add-userIf-invalid-ifId', async() => {
        const success = await Utility.addUser('12345678', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success).toBeFalsy();

        await deleteUser('12345678');

        const success1 = await Utility.addUser('IF12345', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success1).toBeFalsy();

        await deleteUser('IF12345');

        const success2 = await Utility.addUser('ÄÖ123456', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success2).toBeFalsy();

        await deleteUser('ÄÖ123456');

        const success3 = await Utility.addUser('FI987654', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success3).toBeFalsy();

        await deleteUser('FI987654');

        const success4 = await Utility.addUser('HaLLOICH', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success4).toBeFalsy();

        await deleteUser('HaLLOICH');

        const success5 = await Utility.addUser('IF1234567', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success5).toBeFalsy();

        await deleteUser('IF1234567');

        const success6 = await Utility.addUser('IF12d345', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success6).toBeFalsy();

        await deleteUser('IF12d345');

        const success7 = await Utility.addUser('IF123v56', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success7).toBeFalsy();

        await deleteUser('IF123v56');

        const success8 = await Utility.addUser('123456IF', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success8).toBeFalsy();

        await deleteUser('123456IF');

        const success9 = await Utility.addUser('I1F23456', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success9).toBeFalsy();

        await deleteUser('IF12345');

        const success10 = await Utility.addUser('I123456F', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success10).toBeFalsy();

        await deleteUser('I123456F');

        const success11 = await Utility.addUser('12IF3456', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success11).toBeFalsy();

        await deleteUser('12IF3456');

        const success12 = await Utility.addUser('HÖ855854', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success12).toBeFalsy();

        await deleteUser('HÖ855854');

        const success13 = await Utility.addUser('IF123456d', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success13).toBeFalsy();

        await deleteUser('IF123456d');

        const success14 = await Utility.addUser('IF12!456', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success14).toBeFalsy();

        await deleteUser('IF12!456');

        const success15 = await Utility.addUser('I1234567', userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success15).toBeFalsy();

        await deleteUser('I1234567');

    });


    // Test cases for username
    test('add-userIf-invalid-username', async () => {
        // Invalid username: length < 4
        const success1 = await Utility.addUser(ifId3, 'usr', userIf.firstname, userIf.lastname, userIf.email, userIf.clazz,userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success1).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid username: length > 20
        const success2 = await Utility.addUser(ifId3, 'verylongusername1234567890', userIf.firstname, userIf.lastname, userIf.email, userIf.clazz,userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success2).toBeFalsy();

        await deleteUser(ifId3);
    });


    // Test cases for firstname
    test('add-userIf-invalid-firstname', async () => {
        // Invalid firstname: length < 1
        const success1 = await Utility.addUser(ifId3, userIf.username, '', userIf.lastname, userIf.email, userIf.clazz,userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success1).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid firstname: length > 20
        const success2 = await Utility.addUser(ifId3, userIf.username, 'verylongfirstname1234567890', userIf.lastname, userIf.email, userIf.clazz,userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success2).toBeFalsy();

        await deleteUser(ifId3);
    });


    // Test cases for lastname
    test('add-userIf-invalid-lastname', async () => {
        // Invalid lastname: length < 1
        const success1 = await Utility.addUser(ifId3, userIf.username, userIf.firstname, '',userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success1).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid lastname: length > 20
        const success2 = await Utility.addUser(ifId3, userIf.username, userIf.firstname, 'verylonglastname1234567890',userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success2).toBeFalsy();

        await deleteUser(ifId3);
    });

    // Test cases for birthdate
    test('add-userIf-invalid-birthdate', async () => {
        // Invalid birthdate: undefined
        let success = await Utility.addUser(ifId3, userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, undefined, userIf.biografie, userIf.permissions, userIf.department);
        expect(success).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid birthdate: null
        success = await Utility.addUser(ifId3, userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, null, userIf.biografie, userIf.permissions, userIf.department);
        expect(success).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid birthdate: more than 100 years ago
        const oldBirthdate = new Date(new Date().getFullYear() - 101, 0, 1); // More than 100 years ago
        success = await Utility.addUser(ifId3, userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, oldBirthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid birthdate: less than 10 years ago
        const recentBirthdate = new Date(new Date().getFullYear() - 9, 0, 1); // Less than 10 years ago
        success = await Utility.addUser(ifId3, userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, recentBirthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success).toBeFalsy();

        await deleteUser(ifId3);
    });

    // Test cases for permissions
    test('add-userIf-invalid-permissions', async () => {
        // Invalid permissions: negative
        const success = await Utility.addUser(ifId3, userIf.username, userIf.firstname, userIf.lastname,userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, -1, userIf.department);
        expect(success).toBeFalsy();

        await deleteUser(ifId3);
    });

    // Test cases for department
    test('add-userIf-invalid-department', async () => {
        // Invalid department: length < 1
        const success1 = await Utility.addUser(ifId3, userIf.username, userIf.firstname, userIf.lastname,userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, '');
        expect(success1).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid department: length > 20
        const success2 = await Utility.addUser(ifId3, userIf.username, userIf.firstname, userIf.lastname,userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, 'verylongdepartment1234567890');
        expect(success2).toBeFalsy();

        await deleteUser(ifId3);
    });

    // Test case for forbidden words in username, firstname, and lastname
    test('add-userIf-forbidden-words', async () => {
        // Invalid username with forbidden word
        const success1 = await Utility.addUser(ifId3, 'adminUser', userIf.firstname, userIf.lastname,userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success1).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid firstname with forbidden word
        const success2 = await Utility.addUser(ifId3, userIf.username, 'moderatorFirst', userIf.lastname,userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success2).toBeFalsy();

        await deleteUser(ifId3);

        // Invalid lastname with forbidden word
        const success3 = await Utility.addUser(ifId3, userIf.username, userIf.firstname, 'userLast',userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success3).toBeFalsy();

        await deleteUser(ifId3);
    });

    test('add-user-valid', async() => {
        await deleteUser(userIf.userId, true);
        await deleteUser(ifId2, true);
  
        await Utility.addUser(userIf.userId, userIf.username, userIf.firstname, userIf.lastname,userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        await Utility.addUser(ifId2, userIf.username, userIf.firstname, userIf.lastname,userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);


        let users: User[] | null = await Utility.getUsers();
        const dbUser: User | null = await Utility.getUser(userIf.userId);

        expect(users.length).toBe(2);

        await Utility.deleteUser(userIf.userId);

        users = await Utility.getUsers();

        expect(users.length).toBe(1);
        expect(userIf).toEqual(dbUser);

        await Utility.deleteUser(ifId2);

        users = await Utility.getUsers();
        expect(users.length).toBe(0);
    });

    test('add-userIf-invalid-eMail', async() => {
        const success = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, 'test@test', userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success).toBeFalsy();

        await deleteUser(ifId);

        const success1 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, 'hallo meine @ mail', userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success1).toBeFalsy();

        await deleteUser(ifId);

        const success2 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, '@', userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success2).toBeFalsy();

        await deleteUser(ifId);

        const success3 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, 'mail@', userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success3).toBeFalsy();

        await deleteUser(ifId);

        const success4 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, '@test', userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success4).toBeFalsy();

        await deleteUser(ifId);

        const success5 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, '.@.', userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success5).toBeFalsy();

        await deleteUser(ifId);

        const success6 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, '@gmail.com', userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success6).toBeFalsy();

        await deleteUser(ifId);

        const success7 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, 'test@.com', userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success7).toBeFalsy();

        await deleteUser(ifId);
    });

    test('add-userIf-valid-eMail', async() => {
        const success = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, 'm.bergmann@students.htl-leonindg.ac.at', userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success).toBeTruthy();

        await deleteUser(ifId, true);


        const success1 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, 'alin.jassic@gmail.com', userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success1).toBeTruthy();

        await deleteUser(ifId, true);

        const success3 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, 'adam@hoellerl.at', userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success3).toBeTruthy();

        await deleteUser(ifId, true);
    });

    test('add-userIf-invalid-class', async() => {
        const success = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, '6AHIF', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success).toBeFalsy();

        await deleteUser(ifId);

        const success1 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, '-BHIF', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success1).toBeFalsy();

        await deleteUser(ifId);

        const success2 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, 'CAHIF', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success2).toBeFalsy();

        await deleteUser(ifId);

        const success3 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, '', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success3).toBeFalsy();

        await deleteUser(ifId);

        const success4 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, '123456', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success4).toBeFalsy();

        await deleteUser(ifId);

        const success5 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, '3ahif', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success5).toBeFalsy();

        await deleteUser(ifId);

        const success6 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, 'BHIF5', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success6).toBeFalsy();

        await deleteUser(ifId);

        const success7 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, 'O_F10', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success7).toBeFalsy();

        await deleteUser(ifId);

        const success8 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, '1AHELHA', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success8).toBeFalsy();

        await deleteUser(ifId);

        const success9 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, '5BHI', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success9).toBeFalsy();

        await deleteUser(ifId);

        const success10 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, 'B2HIF', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success10).toBeFalsy();

        await deleteUser(ifId);

        const success11 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, 'CHELA', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success11).toBeFalsy();

        await deleteUser(ifId);
    });

    test('add-userIf-valid-class', async() => {
        //await deleteUser(ifId , true);

        const success = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, '1AHIF', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success).toBeTruthy();

        await deleteUser(ifId, true);

        const success1 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, '2AHELA', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success1).toBeTruthy();

        await deleteUser(ifId, true);

        const success2 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, '3AHBG', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success2).toBeTruthy();

        await deleteUser(ifId, true);

        const success3 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, '4AFEL', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success3).toBeTruthy();

        await deleteUser(ifId, true);

        const success4 = await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, '5CHIF', userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);
        expect(success4).toBeTruthy();

        await deleteUser(ifId, true);
    });

    /* endregion */

    /* region updateUser */

    test('update-userIf-invalid-ifId', async() => {
        await Utility.addUser(userIf.userId, userIf.username, userIf.firstname, userIf.lastname,userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);

        let dbUser: User | null = await Utility.getUser(userIf.userId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            userId: 'IF12345',
            username: "test1234",
            firstname: "Maximilian",
            lastname: "Muster",
            email: "test@test.at",
            clazz: "5BHITM",
            birthdate: new Date(date.toDateString()),
            biografie: "Test",
            permissions: 1,
            department: "Informatik"
        };

        const success = await Utility.updateUser(updatedUser.userId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.email, updatedUser.clazz,updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        expect(success).toBeFalsy();

        dbUser = await Utility.getUser(updatedUser.userId);

        expect(dbUser).toBeNull();

        await Utility.deleteUser(userIf.userId);
        await Utility.deleteUser(updatedUser.userId);
    });

    test('update-userIf-invalid-username', async() => {
        await Utility.addUser(userIf.userId, userIf.username, userIf.firstname, userIf.lastname,userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);

        let dbUser: User | null = await Utility.getUser(userIf.userId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            userId: userIf.userId,
            username: "usr",
            firstname: "Maximilian",
            lastname: "Muster",
            email: "test@test.at",
            clazz: "5BHITM",
            birthdate: new Date(date.toDateString()),
            biografie: "Test",
            permissions: 1,
            department: "Informatik"
        };

        const success = await Utility.updateUser(updatedUser.userId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.email, updatedUser.clazz, updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        expect(success).toBeFalsy();

        dbUser = await Utility.getUser(userIf.userId);

        expect(userIf).toEqual(dbUser);

        await Utility.deleteUser(userIf.userId);
        await Utility.deleteUser(updatedUser.userId);
    });

    test('update-userIf-invalid-firstname', async() => {
        await Utility.addUser(userIf.userId, userIf.username, userIf.firstname, userIf.lastname,userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);

        let dbUser: User | null = await Utility.getUser(userIf.userId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            userId: userIf.userId,
            username: "test1234",
            firstname: "",
            lastname: "Muster",
            email: "test@test.at",
            clazz: "5BHITM",
            birthdate: new Date(date.toDateString()),
            biografie: "Test",
            permissions: 1,
            department: "Informatik"
        };

        const success = await Utility.updateUser(updatedUser.userId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.email, updatedUser.clazz,updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        expect(success).toBeFalsy();

        dbUser = await Utility.getUser(userIf.userId);

        expect(userIf).toEqual(dbUser);

        await Utility.deleteUser(userIf.userId);
        await Utility.deleteUser(updatedUser.userId);
    });

    test('update-userIf-invalid-lastname', async() => {
        await Utility.addUser(userIf.userId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);

        let dbUser: User | null = await Utility.getUser(userIf.userId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            userId: userIf.userId,
            username: "test1234",
            firstname: "Maximilian",
            lastname: "",
            email: "test@test.at",
            clazz: "5BHITM",
            birthdate: new Date(date.toDateString()),
            biografie: "Test",
            permissions: 1,
            department: "Informatik"
        };

        const success = await Utility.updateUser(updatedUser.userId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.email, updatedUser.clazz, updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        expect(success).toBeFalsy();

        dbUser = await Utility.getUser(userIf.userId);

        expect(userIf).toEqual(dbUser);

        await Utility.deleteUser(userIf.userId);
        await Utility.deleteUser(updatedUser.userId);
    });

    test('update-userIf-invalid-birthdate', async() => {
        await Utility.addUser(userIf.userId, userIf.username, userIf.firstname, userIf.lastname,userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);

        let dbUser: User | null = await Utility.getUser(userIf.userId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            userId: userIf.userId,
            username: "test1234",
            firstname: "Maximilian",
            lastname: "Muster",
            email: "test@test.at",
            clazz: "5BHITM",
            birthdate: null,
            biografie: "Test",
            permissions: 1,
            department: "Informatik"
        };

        const success = await Utility.updateUser(updatedUser.userId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.email, updatedUser.clazz, updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        expect(success).toBeFalsy();

        dbUser = await Utility.getUser(userIf.userId);

        expect(userIf).toEqual(dbUser);

        await Utility.deleteUser(userIf.userId);
        await Utility.deleteUser(updatedUser.userId);
    });

    test('update-userIf-invalid-permissions', async() => {
        await Utility.addUser(userIf.userId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);

        let dbUser: User | null = await Utility.getUser(userIf.userId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            userId: userIf.userId,
            username: "test1234",
            firstname: "Maximilian",
            lastname: "Muster",
            email: "test@test.at",
            clazz: "5BHITM",
            birthdate: new Date(date.toDateString()),
            biografie: "Test",
            permissions: -1,
            department: "Informatik"
        };

        const success = await Utility.updateUser(updatedUser.userId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.email, updatedUser.clazz, updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        expect(success).toBeFalsy();

        dbUser = await Utility.getUser(userIf.userId);

        expect(userIf).toEqual(dbUser);

        await Utility.deleteUser(userIf.userId);
        await Utility.deleteUser(updatedUser.userId);
    });

    test('update-userIf-invalid-department', async() => {
        await Utility.addUser(userIf.userId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);

        let dbUser: User | null = await Utility.getUser(userIf.userId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            userId: userIf.userId,
            username: "test1234",
            firstname: "Maximilian",
            lastname: "Muster",
            email: "test@test.at",
            clazz: "5BHITM",
            birthdate: new Date(date.toDateString()),
            biografie: "Test",
            permissions: 1,
            department: ""
        };

        const success = await Utility.updateUser(updatedUser.userId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.email, updatedUser.clazz,updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        expect(success).toBeFalsy();

        dbUser = await Utility.getUser(userIf.userId);

        expect(userIf).toEqual(dbUser);

        await Utility.deleteUser(userIf.userId);
        await Utility.deleteUser(updatedUser.userId);
    });

    test('update-userIf-valid', async() => {
        await Utility.addUser(userIf.userId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);

        let dbUser: User | null = await Utility.getUser(userIf.userId);

        expect(dbUser).not.toBeNull();

        const updatedUser: User = {
            userId: userIf.userId,
            username: "test1234",
            firstname: "Maximilian",
            lastname: "Muster",
            email: "test@test.at",
            clazz: "5BHITM",
            birthdate: new Date(date.toDateString()),
            biografie: "Test",
            permissions: 1,
            department: "Informatik"
        };

        await Utility.updateUser(updatedUser.userId, updatedUser.username, updatedUser.firstname, updatedUser.lastname, updatedUser.email, updatedUser.clazz, updatedUser.birthdate, updatedUser.biografie, updatedUser.permissions, updatedUser.department);

        dbUser = await Utility.getUser(userIf.userId);

        expect(updatedUser).toEqual(dbUser);

        await Utility.deleteUser(userIf.userId);
        await Utility.deleteUser(updatedUser.userId);
    });

    /* endregion */

    /* region addUserAbility */

    test('add-userIf-ability-invalid-ifId', async() => {
        const success = await Utility.addUserAbility('12345678', 1);
        expect(success).toBeFalsy();
    });

    test('add-userIf-ability-invalid-abilityId', async() => {
        const success = await Utility.addUserAbility(ifId, -1);
        expect(success).toBeFalsy();
    });

    test('add-userIf-ability-valid', async() => {
        await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);

        const dbUser: User | null = await Utility.getUser(ifId);

        expect(dbUser).not.toBeNull();

        const success = await Utility.addUserAbility(ifId, 1);
        const dbUserAbilities = await Utility.getUserAbilities(ifId);

        expect(dbUserAbilities.length).toBe(1);

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
        await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);

        const success = await Utility.addNotification(ifId, '', 'Test');
        await deleteNotification(ifId);
        await deleteUser(ifId, true);
        expect(success).toBeFalsy();
    });

    test('add-notification-invalid-text', async() => {
        await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);

        const success = await Utility.addNotification(ifId, 'Test', '');
        await deleteNotification(ifId);
        await deleteUser(ifId, true);
        expect(success).toBeFalsy();
    });

    test('add-notification-valid', async() => {
        await Utility.addUser(ifId, userIf.username, userIf.firstname, userIf.lastname, userIf.email, userIf.clazz, userIf.birthdate, userIf.biografie, userIf.permissions, userIf.department);

        const dbUser: User | null = await Utility.getUser(ifId);

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
    };

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

        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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

        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeTruthy();

        const success2 = await Utility.updateProject(1, project.name, '', project.thumbnail, project.description, project.links, project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteProjectByName(project.name, '');
        await deleteUser(ifId, true);
        expect(success2).toBeFalsy();
    });

    test('update-project-invalid-name', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeTruthy();

        const success2 = await Utility.updateProject(1, '', project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteProjectByName('', project.ownerId);
        await deleteUser(ifId, true);
        expect(success2).toBeFalsy();

    });

    test('update-project-invalid-thumbnail', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeTruthy();

        const success2 = await Utility.updateProject(1, project.name, project.ownerId, 'verylongthumbnail1234567890'.repeat(25), project.description, project.links, project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteUser(ifId, true);
        expect(success2).toBeFalsy();
    });

    test('update-project-invalid-description', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeTruthy();

        const success2 = await Utility.updateProject(1, project.name, project.ownerId, project.thumbnail, '', project.links, project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteUser(ifId, true);
        expect(success2).toBeFalsy();
    });

    test('update-project-invalid-links', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        expect(success1).toBeTruthy();

        const success2 = await Utility.updateProject(1, project.name, project.ownerId, project.thumbnail, project.description, 'https://www.google.com;'.repeat(100), project.maxMembers);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteUser(ifId, true);
        expect(success2).toBeFalsy();
    });

    test('update-project-invalid-maxMembers', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);

        const projectId = await Utility.getProjectId(project.name, project.ownerId);

        const success = await Utility.addProjectAbility(projectId, 3);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteUser(ifId, true);
        await Utility.deleteAbilityFromProject(projectId, 1);
        expect(success).toBeTruthy();
    });

    /* endregion */

    /* region addProjectMember */

    test('add-project-member-invalid-projectId', async() => {
        const success = await Utility.addMemberRequest(0, ifId);
        expect(success).toBeFalsy();
    });

    test('add-project-member-invalid-userId', async() => {
        const success = await Utility.addMemberRequest(1, '');
        await Utility.deleteProjectMember(1, '');
        expect(success).toBeFalsy();
    });

    test('add-project-member-valid', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);

        const projectId = await Utility.getProjectId(project.name, project.ownerId);

        const success = await Utility.addMemberRequest(projectId, ifId);
        await Utility.deleteProjectMember(projectId, ifId);
        await deleteProjectByName(project.name, project.ownerId);
        await Utility.deleteUser(ifId);
        expect(success).toBeTruthy();
    });

    test('get-pending-requests-invalid', async() => {
        const success = await Utility.getPendingRequests(-1);
        expect(success).toBeNull();

        const success1 = await Utility.getPendingRequests(0);
        expect(success1).toBeNull();


       await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);

        const projectId = await Utility.getProjectId(project.name, project.ownerId);

        const success3 = await Utility.getPendingRequests(projectId);
        await deleteProjectByName(project.name, project.ownerId);
        expect(success3).toBeNull();

    });

    test('get-pending-requests-valid', async() => {
        await Utility.addUser(ifId, 'test1233', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);

        const projectId = await Utility.getProjectId(project.name, project.ownerId);

        await Utility.addMemberRequest(projectId, ifId);

        const success = await Utility.getPendingRequests(projectId);

        expect(success).toEqual([{"IsAccepted": 0, "id": 1, "projectId": projectId, "userId": ifId}]);

        await Utility.addUser(ifId2, 'someone', 'Alin', 'Jasic', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 13, 0, 1), 'HOI', 0, 'Informatik');

        await Utility.addMemberRequest(projectId, ifId2);

        const success1 = await Utility.getPendingRequests(projectId);

        expect(success1).toEqual([{"IsAccepted": 0, "id": 1, "projectId": projectId, "userId": ifId}, {"IsAccepted": 0, "id": 2, "projectId": projectId, "userId": ifId2}]);

        await Utility.deleteProjectMember(projectId, ifId);
        await Utility.deleteProjectMember(projectId, ifId2);
        await deleteProjectByName(project.name, project.ownerId);
        await Utility.deleteUser(ifId);
        await Utility.deleteUser(ifId2);
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
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF',new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
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
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF',new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);

        const projectId: number = await Utility.getProjectId(project.name, project.ownerId);

        const success = await Utility.addView(projectId, ifId);
        const dbView = await Utility.getViews(projectId);

        const viewsByProject = await Utility.getProjectViews(projectId);
        const views = await Utility.getViews(projectId);

        expect(views).toBe(1);
        expect(viewsByProject.length).toBe(views);

        expect(dbView).toBe(1);

        await Utility.deleteViews(projectId);
        await deleteProjectByName(project.name, project.ownerId);
        await deleteUser(ifId, true);
        expect(success).toBeTruthy();
    });

    /* endregion */

    /* region otherTests */
    //test getProjectsWhereUserIsOwner
    test('get-projects-where-user-is-owner', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await Utility.addProject('test2', project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await Utility.addProject('test3', ifId2, project.thumbnail, project.description, project.links, project.maxMembers);

        const projects1 = await Utility.getProjectsWhereUserIsOwner(ifId);

        expect(projects1.length).toBe(2);

        const projects2 = await Utility.getProjectsWhereUserIsOwner(ifId2);

        expect(projects2).toBe(null);

        const projects3 = await Utility.getProjects(undefined, undefined, undefined, undefined);

        expect(projects3.length).toBe(2);

        await Utility.deleteProjectByName(project.name, project.ownerId);
        await Utility.deleteProjectByName('test2', project.ownerId);
        await Utility.deleteProjectByName('test3', ifId2);
        await Utility.deleteUser(ifId);
    });

    //test getProjectsWhereUserIsMember
    test('get-projects-where-user-is-member', async() => {
        await Utility.addUser(ifId, 'test1223', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        await Utility.addProject(project.name, project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await Utility.addProject('test2', project.ownerId, project.thumbnail, project.description, project.links, project.maxMembers);
        await Utility.addProject('test3', ifId2, project.thumbnail, project.description, project.links, project.maxMembers);

        const projectId1 = await Utility.getProjectId(project.name, project.ownerId);
        const projectId2 = await Utility.getProjectId('test2', project.ownerId);
        const projectId3 = await Utility.getProjectId('test3', ifId2);

        await Utility.addMemberRequest(projectId1, ifId2);
        await Utility.addMemberRequest(projectId2, ifId2);
        await Utility.addMemberRequest(projectId3, ifId2);

        const projects1 = await Utility.getProjectsWhereUserIsMember(ifId2);

        expect(projects1.length).toBe(3);

        const projects3 = await Utility.getProjects(undefined, undefined, undefined, undefined);

        expect(projects3.length).toBe(3);

        await Utility.deleteProjectMember(projectId1, ifId);
        await Utility.deleteProjectMember(projectId2, ifId);
        await Utility.deleteProjectMember(projectId3, ifId);
        await Utility.deleteProjectByName(project.name, project.ownerId);
        await Utility.deleteProjectByName('test2', project.ownerId);
        await Utility.deleteProjectByName('test3', ifId2);
        await Utility.deleteUser(ifId);
    });

    /* endregion */
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

        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann', 'test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann', 'test@test.at', '3BHIF',new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann', 'test@test.at', '3BHIF',new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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

        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId3, 'test12345', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

        const success1 = await Utility.addDirectChat(ifId, ifId2);
        expect(success1).toBeTruthy();

        await Utility.getDirectChat(ifId, ifId2);

        const success = await Utility.updateMessage(1, 0, ifId, 'hello');
        await Utility.deleteDirectChat(ifId, ifId2);
        await deleteUser(ifId, true);
        await deleteUser(ifId2, true);
        expect(success).toBeFalsy();
    });

    test('update-message-invalid-ifId', async() => {
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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
        await Utility.addUser(ifId, 'test123', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');
        await Utility.addUser(ifId2, 'test1234', 'Max', 'Mustermann','test@test.at', '3BHIF', new Date(new Date().getFullYear() - 11, 0, 1), '', 0, 'Informatik');

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

