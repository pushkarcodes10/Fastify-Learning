import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import fastifySensible from "@fastify/sensible";
import mongodbPlugin from "./plugins/mongodb.js";

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

await fastify.register(fastifySensible);

await fastify.register(mongodbPlugin);

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

fastify.get("/test-db", async(request, reply) => {
  try {
    const mongoose = fastify.mongoose
    const connectionState = mongoose.connection.readyState

    let status = ""
    switch (connectionState) {
      case 0:
        status = "disconnected"
        break;
      case 1:
        status = "connected"
        break;
      case 2:
        status = "connecting"
        break;
      case 3:
        status = "disconnecting"
        break;
      default:
        status = "unknown"
        break;
    }

    reply.send({ database: status });
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({error: "Failed to test database"})
    process.exit(1);
  }
})

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