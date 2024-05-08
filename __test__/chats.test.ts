import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import socketConfig from "../src/config/socketCofing";

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("chat routes", () => {
    let io:Server, serverSocket:any, clientSocket:any;
  
    beforeAll((done) => {
      const httpServer = createServer();
      io = new Server(httpServer);
      httpServer.listen(() => {
        const port = (httpServer.address() as AddressInfo).port;
        clientSocket = ioc(`http://localhost:${port}`);
        io.on("connection", (socket) => {
          serverSocket = socket;
        });
        clientSocket.on("connect", done);
      });
    });
  
    afterAll(() => {
      io.close();
      clientSocket.disconnect();
    });

    test("should test sockt so connection", (done) => {
        socketConfig(io)
        clientSocket.on("hello", (arg:any) => {
          expect(arg).toBe("world");
          done();
        });
        serverSocket.emit("hello", "world");
      });
})