export interface User {
    userId: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    clazz: string;
    birthdate: Date;
    biografie: string;
    permissions: number;
    department: string;
}

export interface Project {
    id: number;
    name: string;
    ownerId: string;
    thumbnail: string;
    description: string;
    dateOfCreation: Date;
    links: string;
    maxMembers: number;
}

export interface ProjectMember {
    id: number;
    projectId: number;
    userId: string;
    IsAccepted: boolean;
}

export interface View {
    id: number;
    projectId: number;
    userId: string;
}

export interface Like {
    id: number;
    projectId: number;
    userId: string;
}

export interface Notification {
    id: number;
    userId: string;
    title: string;
    text: string;
    dateTime: string;
}

export interface UserAbility {
    id: number;
    userId: string;
    abilityId: number;
}

export interface ProjectAbility {
    id: number;
    projectId: number;
    abilityId: number;
}

export interface Ability {
    id: number;
    name: string;
    parentId: number | null;
}

export interface DirectChat {
    id: number;
    userId: string;
    otherUserId: string;
}

export interface Message {
    id: number;
    chatId: number;
    userId: string;
    message: string;
    dateTime: string;
}

export enum Role {
    Unknown = 0,
    Student = 1,
    Teacher = 2,
    TestUser = 3
}

export enum Department {
    Unset = "Unknown",
    AD = "Abendschule",
    BG = "Biomedizin- und Gesundheitstechnik",
    FE = "Fachschule Elektronik",
    HE = "Höhere Elektronik",
    IF = "Informatik",
    IT = "Medientechnik"
}