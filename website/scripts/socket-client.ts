import { io, Socket } from "socket.io-client";
import {keycloak} from "./keycloak";
import {HttpClient} from "./server-client";

export class SocketClient {
    private static instance: SocketClient;
    private socket: Socket;
    private bearer = `Bearer ${keycloak.token}`;

    private constructor() {
        this.socket = io(HttpClient.baseUrl);
        this.socket.emit('register', this.bearer);
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

    onMessage(callback: (data: any) => void) {
        this.socket.on('message', callback);
    }

    onNotification(callback: () => void) {
        this.socket.on('notification', callback);
    }

    onView(callback: (view: number) => void) {
        this.socket.on('view', callback);
    }

    onLike(callback: (like: number) => void) {
        this.socket.on('like', callback);
    }
}