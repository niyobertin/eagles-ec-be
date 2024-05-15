import { Socket,Server } from "socket.io";
import { Request,Response } from "express";
import { newChatMessages, pastMessages} from "../services/chatServices";
import { chatMessageSchema } from "../schemas/messageSchema";

export const  sendMessages = async(io:Server,data:any) =>{
    const {sender,userId,message}:any = data;
    const newMessage = {
        sender,
        userId,
        message
    }
    const validated:any = chatMessageSchema.validate(newMessage);
    if(validated.error){
        io.emit('validation error', { message: validated.error.message });
    }else{
        const sentMessage:any = await newChatMessages(newMessage);
        if(sentMessage){
            io.emit('chat message',sentMessage);
        };
    }
}

export const  getPastMessages = async(socket:Socket) =>{
    const currentMessage:any = await pastMessages();
    if(currentMessage){
        socket.emit('past messages',currentMessage);
    };
}
export const joiRoom = async(req:Request,res:Response) => {
    const element = `
    <a href="/api/v1/chats">Login to join the room</a> 
    `
     res.send(element);
}

