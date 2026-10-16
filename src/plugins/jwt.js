import fastifyPlugin from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

const jwtPlugin = async (fastify, opts) => {
  const secret =
    fastify.config?.JWT_SECRET ||
    fastify.config?.JWT_TOKEN ||
    process.env.JWT_SECRET ||
    process.env.JWT_TOKEN ||
    "supersecret";

  await fastify.register(fastifyJwt, {
    secret
  });

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
};

export default fastifyPlugin(jwtPlugin);