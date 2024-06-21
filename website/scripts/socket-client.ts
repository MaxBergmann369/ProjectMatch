import { io, Socket } from "socket.io-client";

export class SocketClient {
    private static instance: SocketClient;
    private socket: Socket;

    private constructor() {
        this.socket = io("http://localhost:3000");
    }

    public static getInstance(): SocketClient {
        if (!SocketClient.instance) {
            SocketClient.instance = new SocketClient();
        }
        return SocketClient.instance;
    }

    onOnlineUserUpdate(callback: (data: number) => void) {
        this.socket.on('onlineUser', callback);
    }
}