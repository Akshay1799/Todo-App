import { connectDB } from "./config/db.js";
import { config } from "./config/index.js";
import { app } from "./app.js";

const startServer = () => {
  connectDB()
    .then(() => {
      app.listen(config.port, () =>
        console.log(`Server is listening on PORT ${config.port}`)
      );
    })
    .catch((error) => {
      console.log(`Something went wrong: ${error.message}`);
    });
};

startServer();
