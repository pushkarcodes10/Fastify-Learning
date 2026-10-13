import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import fastifySensible from "@fastify/sensible";

const fastify = Fastify({
  logger: true
});

await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
});

await fastify.register(fastifyEnv, {
  dotenv: true,
  schema: {
    type: "object",
    required: ["PORT", "MONGODB_URI", "JWT_TOKEN"],
    properties: {
      PORT: { type: "number", default: 3000 },
      MONGODB_URI: { type: "string" },
      JWT_TOKEN: { type: "string" }
    }
  }
});

fastify.register(fastifySensible);

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

const PORT = fastify.config.PORT;

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