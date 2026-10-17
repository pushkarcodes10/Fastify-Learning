import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import fastifySensible from "@fastify/sensible";
import mongodbPlugin from "./src/plugins/mongodb.js";
import jwtPlugin from "./src/plugins/jwt.js";
import authRoutes from "./src/routes/auth.js";
import thumbnailRoutes from "./src/routes/thumbnail.js";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      JWT_TOKEN: { type: "string" },
      JWT_SECRET: { type: "string" }
    }
  }
});

await fastify.register(fastifySensible);

await fastify.register(mongodbPlugin);

await fastify.register(jwtPlugin);

await fastify.register(fastifyMultipart);

await fastify.register(fastifyStatic, {
  root: path.join(__dirname, "uploads"),
  prefix: "/uploads/",
});

await fastify.register(authRoutes, { prefix: "/api/auth" });

await fastify.register(thumbnailRoutes, { prefix: "/api/thumbnail" });

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