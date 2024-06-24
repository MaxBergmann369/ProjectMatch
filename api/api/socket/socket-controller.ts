import { Server, Socket } from "socket.io";
import {EndPoints} from "../db/validation";
import {Database} from "../db/db";

export class SocketController {
    private static io: Server;
    private static userSocketMap = new Map<string, string>();
    private static userProjectMap = new Map<string, number>();

    static async initializeSocket(server: Server) {
        SocketController.io = server;
        server.on("connection", (socket) => this.onConnection(socket));
    }

    static onConnection(socket: Socket) {
        socket.on("register", (authHeader) => {

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null || tokenUser.userId === null) {
                return;
            }

            SocketController.userSocketMap.set(tokenUser.userId, socket.id);
            SocketController.io.emit('onlineUser', SocketController.userSocketMap.size);
        });

        socket.on("disconnect", () => this.onDisconnect(socket));
    }

    static addMessage(chatId, userId) {
        const recipientSocketId = SocketController.userSocketMap.get(userId);
        if (recipientSocketId) {
            SocketController.io.to(recipientSocketId).emit('message', chatId);
        }
    }

    static updateNotification(userId) {
        const recipientSocketId = SocketController.userSocketMap.get(userId);
        if (recipientSocketId) {
            SocketController.io.to(recipientSocketId).emit('notification');
        }
    }

    static onGetProject(userId: string, projectId: number) {
        SocketController.userProjectMap.set(userId, projectId);
    }

    static async onLike(projectId: number) {
        const likes = await Database.getLikesByProjectId(projectId);
        SocketController.userProjectMap.forEach((value, key) => {
            if (value === projectId) {
                const recipientSocketId = SocketController.userSocketMap.get(key);
                if (recipientSocketId) {
                    SocketController.io.to(recipientSocketId).emit('like', likes);
                }
            }
        });
    }

    static async onView(projectId: number) {
        const views = await Database.getViewsByProjectId(projectId);
        SocketController.userProjectMap.forEach((value, key) => {
            if (value === projectId) {
                const recipientSocketId = SocketController.userSocketMap.get(key);
                if (recipientSocketId) {
                    SocketController.io.to(recipientSocketId).emit('view', views);
                }
            }
        });
    }

    static onDisconnect(socket: Socket) {
        //remove user from map
        SocketController.userSocketMap.forEach((value, key) => {
            if (value === socket.id) {
                SocketController.userSocketMap.delete(key);
                setTimeout(() => {
                    SocketController.io.emit('onlineUser', SocketController.userSocketMap.size);
                }, 100);
            }
        });
    }
}