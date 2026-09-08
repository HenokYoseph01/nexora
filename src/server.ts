import { buildApp } from "./app";
import { env } from "./config/env";

const server = buildApp();
let isShuttingDown = false;

async function gracefulShutdown(signal: string) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    server.log.info(`Received ${signal}. Gracefully shutting down server...`);

    // Keep a deadline in case active requests or resource cleanup hang.
    const forceExitTimeout = setTimeout(() => {
        server.log.error("Forcefully shutting down server due to timeout.");
        process.exit(1);
    }, 10_000);
    forceExitTimeout.unref();

    try {
        await server.close();
        // Close future database and Redis connections before clearing the deadline.
        server.log.info("Server closed successfully.");
        clearTimeout(forceExitTimeout);
    } catch (err) {
        server.log.error({ err }, "Error during graceful shutdown");
        process.exitCode = 1;
    }
}

async function start() {
    try {
        await server.listen({ port: env.PORT });
    } catch (err) {
        server.log.error({ err }, "Error starting server");
        process.exitCode = 1;
        await gracefulShutdown("startup failure");
    }
}

process.on("SIGINT", () => void gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => void gracefulShutdown("SIGTERM"));

void start();
