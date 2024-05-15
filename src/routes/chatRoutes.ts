import { Router } from "express";
import { joiRoom } from "../controllers/chatsController";
export const joinChatRoomRoutes = Router();
joinChatRoomRoutes.get('/',joiRoom);