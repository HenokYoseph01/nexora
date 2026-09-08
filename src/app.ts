import Fastify, {FastifyInstance} from "fastify";

export function buildApp(): FastifyInstance {
//Initalize Fastify with logging enabled
const app = Fastify({
    logger: true
})

//Declare a route
app.get("/health", async(request, reply) => {
    return { status: "ok" }
})

return app;
}


