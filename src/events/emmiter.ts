import { EventEmitter } from "events";
import { Server as SocketIOServer } from "socket.io";

class NotificationEmitter extends EventEmitter {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    super();
    this.io = io;
  }

}

export default NotificationEmitter;
