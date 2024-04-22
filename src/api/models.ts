import e from "express";

export interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    birthdate: Date;
    email: string;
    password: string;
    permissions: number;
}

export interface Project {
    id: number;
    name: string;
    ownerId: number;
    Thumbnail: string;
    Description: string;
    DateOfCreation: Date;
    Views: number;
    Links: string;
}

export interface ProjectMember {
    id: number;
    projectId: number;
    userId: number;
}

export interface Flame {
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