import { Server as SocketIOServer, Socket } from "socket.io";
import NotificationEmitter from "./emmiter";

class EventHandler {
  private io: SocketIOServer;
  private notificationEmitter: NotificationEmitter;

  constructor(io: SocketIOServer, notificationEmitter: NotificationEmitter) {
    this.io = io;
    this.notificationEmitter = notificationEmitter;
    this.initialize();
  }

  private initialize() {
    this.io.on("connection", (socket: Socket) => {
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });


      socket.on("joinRoom", (userId: string) => {
        socket.join(userId)
        console.log(`Joined room: ${userId}`);
      })


      socket.on("custom", (data) => {
        this.notificationEmitter.emit("notification", {
          title: "your message was received",
          message: "looks good!",
          userId: "23",
        });
      });

    });
    this.notificationEmitter.on("deleted", (data) => {
      this.io.to(JSON.stringify(data.userId)).emit("notification", {
        id: data?.id,
        title: data?.title,
        message: data?.message,
        userId: data?.userId,
      });
    });

    this.notificationEmitter.on("expired", (data) => {
      this.io.to(JSON.stringify(data.userId)).emit("notification", {
        id: data?.id,
        title: data?.title,
        message: data?.message,
        userId: data?.userId,
      });
    });


    this.notificationEmitter.on("updated", (data) => {
      this.io.to(JSON.stringify(data.userId)).emit("notification", {
        tid: data?.id,
        title: data?.title,
        message: data?.message,
        userId: data?.userId,
      });
    });


    this.notificationEmitter.on("created", (data) => {
      this.io.to(JSON.stringify(data.userId)).emit("notification", {
        id: data?.id,
        title: data?.title,
        message: data?.message,
        userId: data?.userId,
      });
    });
    
  }
}

export default EventHandler;
