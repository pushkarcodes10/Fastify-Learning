import fastifyPlugin from "fastify-plugin";
import mongoose from "mongoose";

const mongodbPlugin = async (fastify, opts) => {
  try {
    const mongoUri = fastify.config?.MONGODB_URI || process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    fastify.decorate("mongoose", mongoose);
    fastify.log.info("MONGODB connected !");

    fastify.addHook("onClose", async () => {
      await mongoose.connection.close();
    });
  } catch (err) {
    fastify.log.error(err);
    throw err;
  }
};

export default fastifyPlugin(mongodbPlugin);