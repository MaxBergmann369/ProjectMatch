import { Server, Socket } from "socket.io";
import {EndPoints} from "../db/validation";

export class SocketController {
    private static io: Server;
    private static userSocketMap = new Map<string, string>();

    static initializeSocket(server: Server) {
        SocketController.io = server;
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
        const recipientSocketId = this.userSocketMap.get(userId);
        if (recipientSocketId) {
            this.io.to(recipientSocketId).emit('message', chatId);
        }
    }

    static onDisconnect() {
        setTimeout(() => {
            SocketController.io.emit('onlineUser', SocketController.io.engine.clientsCount);
        }, 100);
    }
}