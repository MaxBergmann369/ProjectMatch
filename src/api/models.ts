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
    date: Date;
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
    parentId: number;
}

export interface DirectChat {
    id: number;
    userId: string;
    otherUserId: number;
}

export interface Message {
    id: number;
    chatId: number;
    userId: string;
    message: string;
    date: Date;
}