import {Server} from "socket.io";

export class SocketController {

    private static onlineUser: number = 0;

    get onlineUser(): number {
        return this.onlineUser;
    }
    
    static initializeSocket(server: Server) {
        server.on("connection", this.onConnection);
        server.on("disconnect", this.onDisconnect);
    }
    
    static onConnection(socket: any) {
        SocketController.onlineUser++;
    }
    
    static onDisconnect(socket: any) {
        SocketController.onlineUser--;
    }
}