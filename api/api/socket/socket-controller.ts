import { Server, Socket } from "socket.io";

export class SocketController {
    private static io: Server;

    static initializeSocket(server: Server) {
        SocketController.io = server;
        server.on("connection", (socket) => this.onConnection(socket));
    }

    static onConnection(socket: Socket) {
        console.log("User connected");
        SocketController.io.emit('onlineUser', SocketController.io.engine.clientsCount);

        socket.on("disconnect", () => this.onDisconnect());
    }

    static onDisconnect() {
        console.log("User disconnected");
        // Use a setTimeout to ensure the disconnect event has completed
        setTimeout(() => {
            SocketController.io.emit('onlineUser', SocketController.io.engine.clientsCount);
        }, 100);
    }
}