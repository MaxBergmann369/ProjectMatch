import { Server, Socket } from "socket.io";
import {EndPoints} from "../db/validation";
import {Project} from "../../models";
import {Database} from "../db/db";

export class SocketController {
    private static io: Server;
    private static userSocketMap = new Map<string, string>();
    private static rankingData: Project[][] = [];

    static async initializeSocket(server: Server) {
        SocketController.io = server;
        SocketController.rankingData = await Database.getTop10Projects();
        server.on("connection", (socket) => this.onConnection(socket));
    }

    static onConnection(socket: Socket) {
        socket.on("register", (authHeader) => {

            const tokenUser = EndPoints.getToken(authHeader);

            if (tokenUser === null) {
                return;
            }

            this.userSocketMap.set(tokenUser.userId, socket.id);
        });

        SocketController.io.emit('onlineUser', SocketController.io.engine.clientsCount);

        socket.on("disconnect", () => this.onDisconnect());
    }

    static addMessage(chatId, userId) {
        const recipientSocketId = SocketController.userSocketMap.get(userId);
        if (recipientSocketId) {
            SocketController.io.to(recipientSocketId).emit('message', chatId);
        }
    }

    static updateNotification(userId) {
        const recipientSocketId = this.userSocketMap.get(userId);
        if (recipientSocketId) {
            SocketController.io.to(recipientSocketId).emit('notification');
        }
    }

    static async updateRanking(projectId: number, table: string) {
        if(this.rankingData.some((project) => project.some((p) => p.id === projectId))) {
            SocketController.io.emit('ranking', projectId, table);
            SocketController.rankingData = await Database.getTop10Projects();
        }
    }

    static onDisconnect() {
        setTimeout(() => {
            SocketController.io.emit('onlineUser', SocketController.io.engine.clientsCount);
        }, 100);
    }
}