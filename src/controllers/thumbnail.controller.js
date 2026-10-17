import Thumbnail from "../models/thumbnail.models.js";
import path from "path";
import fs from "fs";
import { pipeline } from "stream/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads/thumbnails");

export const createThumbnail = async (request, reply) => {
  try {
    const parts = request.parts();
    const fields = {};
    let fileName;

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for await (const part of parts) {
      if (part.file) {
        fileName = `${Date.now()}-${part.filename}`;
        const saveTo = path.join(uploadDir, fileName);
        await pipeline(part.file, fs.createWriteStream(saveTo));
      } else {
        fields[part.fieldname] = part.value;
      }
    }

    const userId = request.user?.id || request.user?._id;

    const thumbnail = new Thumbnail({
      user: userId,
      videoName: fields.videoName,
      version: fields.version,
      image: fileName ? `/uploads/thumbnails/${fileName}` : fields.image,
      paid: fields.paid === "true" || fields.paid === true
    });

    await thumbnail.save();
    return reply.code(200).send({ message: "Thumbnail Saved Successfully" });
  } catch (err) {
    return reply.send(err);
  }
};

export const getThumbnails = async (request, reply) => {
  try {
    const userId = request.user?.id || request.user?._id;
    const thumbnails = await Thumbnail.find({ user: userId });
    return reply.send(thumbnails);
  } catch (err) {
    return reply.send(err);
  }
};

export const getThumbnail = async (request, reply) => {
  try {
    const userId = request.user?.id || request.user?._id;
    const thumbnail = await Thumbnail.findOne({
      _id: request.params.id,
      user: userId
    });
    if (!thumbnail) {
      return reply.notFound("Thumbnail not found");
    }
    return reply.send(thumbnail);
  } catch (err) {
    return reply.send(err);
  }
};

export const updateThumbnail = async (request, reply) => {
  try {
    const userId = request.user?.id || request.user?._id;
    const updateData = request.body;
    const thumbnail = await Thumbnail.findOneAndUpdate(
      {
        _id: request.params.id,
        user: userId
      },
      updateData,
      { new: true }
    );
    if (!thumbnail) {
      return reply.notFound("Thumbnail not found");
    }
    return reply.send(thumbnail);
  } catch (err) {
    return reply.send(err);
  }
};

export const deleteThumbnail = async (request, reply) => {
  try {
    const userId = request.user?.id || request.user?._id;
    const deletedThumbnail = await Thumbnail.findOneAndDelete({
      _id: request.params.id,
      user: userId
    });
    if (!deletedThumbnail) {
      return reply.notFound("Thumbnail not found");
    }

    if (deletedThumbnail.image) {
      const filePath = path.join(uploadDir, path.basename(deletedThumbnail.image));
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          request.log.error(err);
        }
      });
    }

    return reply.send({ message: "Thumbnail deleted" });
  } catch (err) {
    return reply.send(err);
  }
};

export const deleteAllThumbnails = async (request, reply) => {
  try {
    const userId = request.user?.id || request.user?._id;
    const thumbnails = await Thumbnail.find({ user: userId });
    await Thumbnail.deleteMany({ user: userId });

    for (const thumbnail of thumbnails) {
      if (thumbnail.image) {
        const filePath = path.join(uploadDir, path.basename(thumbnail.image));
        fs.unlink(filePath, (err) => {
          if (err && err.code !== "ENOENT") {
            request.log.error(err);
          }
        });
      }
    }

    return reply.send({ message: "All thumbnails deleted" });
  } catch (err) {
    return reply.send(err);
  }
};

export default {
  createThumbnail,
  getThumbnails,
  getThumbnail,
  updateThumbnail,
  deleteThumbnail,
  deleteAllThumbnails
};