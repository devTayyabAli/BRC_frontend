import { io } from "socket.io-client";
import { ENV } from "./env";
let socket = null;

const connectSocket = () => {
  if (!socket) {
    const socketInstance = new io(ENV?.socketUrl || "http://localhost:8000");
    // const socketInstance = new io(ENV?.serverUrl || 'http://localhost:7000');

    return socketInstance;
  }
};

export default { connectSocket, socket };
