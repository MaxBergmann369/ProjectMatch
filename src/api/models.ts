export interface User {
    ifId: string;
    username: string;
    firstname: string;
    lastname: string;
    birthdate: Date;
    biografie: string;
    permissions: number;
    department: string;
}

export interface Project {
    id: number;
    name: string;
    ownerId: number;
    thumbnail: string;
    description: string;
    dateOfCreation: Date;
    views: number;
    links: string;
    maxMembers: number;
}

export interface ProjectMember {
    id: number;
    projectId: number;
    userId: number;
}

export interface Like {
    id: number;
    projectId: number;
    userId: number;
}

export interface Notification {
    id: number;
    userId: number;
    title: string;
    text: string;
    date: Date;
}

export interface UserAbility {
    id: number;
    userId: number;
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
}

export interface DirectChat {
    id: number;
    userId: number;
    otherUserId: number;
}

export interface Message {
    id: number;
    chatId: number;
    userId: number;
    message: string;
    date: Date;
}