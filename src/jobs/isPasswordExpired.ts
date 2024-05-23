import cron from 'node-cron';
import EventEmitter from 'events';
import { getAllUsers } from '../services/user.service';
import { env } from '../utils/env';
import { sendEmailService } from '../services/mail.service';
import { passwordExpirationHtmlContent } from '../email-templates/passwordExpiredNotification';

let latestExpiredUserData = new Set<any>();
export let expiredUserData = new Set<any>();

class UpdatePasswordEventsEmitter extends EventEmitter {};
export const passwordEventEmitter = new UpdatePasswordEventsEmitter();

export const isPasswordExpired = () =>{
    const millseconddPerMin = 1000 * 60;
    cron.schedule('* * * * * *', async() => {
        const currentTime = Date.now();
        const users = await getAllUsers();
        const emailPromises = [];
        for (const user of users) {
            const lastPasswordUpdateTime:any = user.dataValues.lastPasswordUpdateTime;
            const timeDifference:any = currentTime - lastPasswordUpdateTime;
            if(timeDifference >= (millseconddPerMin * parseInt(env.password_expiration_time))&& !latestExpiredUserData.has(user.id)){
                passwordEventEmitter.emit("password expired",user);
                latestExpiredUserData.add(user.id);
                emailPromises.push(
                    sendEmailService(user, 'Password expired', passwordExpirationHtmlContent(user.name))
                );
            };
        };
        await Promise.all(emailPromises);
        expiredUserData = new Set([...latestExpiredUserData]);
    });
}
passwordEventEmitter.on("password expired", (user) => {
    expiredUserData.add(user);
});

export const clearExpiredUserData = (userId:any) => {
    latestExpiredUserData.delete(userId);
    expiredUserData.delete(userId);
};