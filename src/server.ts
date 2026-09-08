import {buildApp} from "./app";
import {env} from "./config/env";
const server = buildApp();

let isShuttingDown = false;

async function gracefulShutdown(signal: string) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    server.log.info(`Received ${signal}. Gracefully shutting down server...`);

    //If request hang too long, timeout and force shutdown
    const forceExitTimeout = setTimeout(()=>{
        server.log.error("Forcefully shutting down server due to timeout.");
        process.exit(1);
    }, 10000);

    try {
        await server.close();
        clearTimeout(forceExitTimeout);
        server.log.info("Server closed successfully.");
        //close db and redis connections here
        process.exit(0);
    } catch (err) {
        server.log.error({ err }, 'Error during graceful shutdown');
        process.exit(1);
    }
}

const start = async () => {
    try {
        await server.listen({ port: env.PORT });
    } catch (err) {
        server.log.error({ err }, 'Error starting server');
        process.exit(1);
    }
}

['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => gracefulShutdown(signal));
})


start();


// const gracefulShutdown = async (signal: string) => {
//     server.log.info(`Received ${signal}. Closing server...`);

//     try{
//         await server.close();
//         server.log.info("Server closed successfully.");
//         process.exit(0);
//     }
//     catch (err) {
//         server.log.error("Error during server shutdown:", err);
//         process.exit(1);
//     }
// }

// process.once('SIGINT', () => gracefulShutdown('SIGINT'));
// process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));
