
import Message from "../sequelize/models/messages";
export const newChatMessages = async(message:any) => {
    try {
      const newMessage =   await Message.create(message);
      if(!newMessage){
        return false;
      }else{
        return newMessage;
      }
    } catch (error:any) {
        throw new Error(error.message);
    };
};

export const pastMessages = async() =>{
    try {
        const currentMessages =  await Message.findAll();
        if(!currentMessages){
            return false;
        }else{
            return currentMessages;
          }
        } catch (error:any) {
            throw new Error(error.message);
       };
};
