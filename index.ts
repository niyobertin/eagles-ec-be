import sequelize, { connect } from "./src/config/dbConnection";
import { env } from "./src/utils/env";
import app from "./src/utils/server";

app.listen(env.port, async () => {
	await connect();
	await sequelize
		.sync()
		.then(() => {
			console.log(" db synced and server is running");
		})
		.catch((error: any) => {
			console.log(error.message);
		});
});
