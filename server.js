import "dotenv/config";
import Fastify from "fastify";

const fastify = Fastify({
  logger: true
});

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
    try {
        await fastify.listen({ port: PORT });
        fastify.log.info(
            `Server is running on http://localhost:${PORT}`
        );
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();