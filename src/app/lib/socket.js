import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.connectionPromise = null;
    this.reconnectionAttempts = 0;
    this.maxReconnectionAttempts = 3;
  }

  async connect(token) {
    // If already connected and same token, return existing socket
    if (this.socket && this.isConnected && this.socket.auth?.token === token) {
      console.log("🔄 Using existing socket connection");
      return this.socket;
    }

    // If connection is in progress, return the promise
    if (this.connectionPromise) {
      console.log("🔄 Connection already in progress");
      return this.connectionPromise;
    }

    console.log("🔌 Creating new socket connection...");

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        // Disconnect existing socket if any
        if (this.socket) {
          this.socket.disconnect();
          this.socket = null;
        }

        // 🧩 Strip `/api` if present in environment URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const baseUrl = apiUrl.replace(/\/api\/?$/, "");

        console.log("🌐 Socket base URL:", baseUrl);

        this.socket = io(baseUrl, {
          auth: { token },
          transports: ["websocket", "polling"],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: this.maxReconnectionAttempts,
          reconnectionDelay: 1000,
          timeout: 10000,
        });

        const connectionTimeout = setTimeout(() => {
          reject(new Error("Socket connection timeout"));
          this.connectionPromise = null;
        }, 10000);

        this.socket.on("connect", () => {
          clearTimeout(connectionTimeout);
          console.log("🟢 Socket connected:", this.socket.id);
          this.isConnected = true;
          this.reconnectionAttempts = 0;
          resolve(this.socket);
        });

        this.socket.on("disconnect", (reason) => {
          console.log("🔴 Socket disconnected:", reason);
          this.isConnected = false;
          this.connectionPromise = null;
        });

        this.socket.on("connect_error", (error) => {
          clearTimeout(connectionTimeout);
          console.error("🔴 Socket connection error:", error.message);
          this.isConnected = false;
          this.connectionPromise = null;
          this.reconnectionAttempts++;

          if (this.reconnectionAttempts >= this.maxReconnectionAttempts) {
            reject(
              new Error(
                `Connection failed after ${this.maxReconnectionAttempts} attempts`
              )
            );
          } else {
            reject(error);
          }
        });

        this.socket.on("error", (error) => {
          console.error("⚠️ Socket error:", error);
        });
      } catch (error) {
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  disconnect() {
    if (this.socket) {
      console.log("🔌 Disconnecting socket...");
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.connectionPromise = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.socket && this.isConnected;
  }
}
export const socketService = new SocketService();
