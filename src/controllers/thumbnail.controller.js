import Thumbnail from "../models/thumbnail.models.js"
import path from "path"
import fs from "fs"
import { pipeline } from "stream"
import util from "util"
import fastify from "fastify"

const pipelineAsync = util.promiseify(pipeline)

exports.createThumbnail = async (request, reply) => {
    try {
        const parts = request.part()
        let fields = {}
        let fileName;

        for await(const part of parts) {
            if(part.file) {
               const fileName = `${Date.now()}-${part.fileName}`
               const saveTo = path.join(
                __dirname,
                "..",
                "uploads",
                "thumbnails",
                fileName
               );
               await pipelineAsync(part.file, fs.createWriteStream(saveTo))
            } else {
                fields[file.fileName] = part.value
            }
        }

        const thumbanil = new Thumbnail({
            user: request.user.id,
            videoName: fields.videoName,
            version: fields.version,
            image: `/uploads/thumbnails/${fileName}`,
            paid: fields.paid === "true"
        })

        await Thumbnail.save()
        reply.code(200).send({message: "Thumbnail Saved Successfully"})
    } catch (err) {
        reply.send(err)
    }
}

exports.getThumbnails = async (request, reply) => {
    try {
        const thumbnails = await Thumbnail.find({ user: request.user.id });
        reply.send(thumbnails)
    } catch (err) {
        reply.send(err)
    }
}

exports.getThumbnail = async (request, reply) => {
    try {
        const thumbnail = await Thumbnail.findOne({
            _id: request.params.id,
            user: request.user.id
        })
        if(!thumbnail) {
            return reply.notFound("Thumbnail not found")
        }
        reply.send(thumbnail)
    } catch (err) {
        reply.send(err);
    }
}

exports.updateThumbnail = async (request, reply) => {
    try {
        const updateData = request.body
        const thumbnail = await Thumbnail.findByIdAndUpdate({
          _id: request.params.id,
          user: request.user.id,
        }, updateData, {new: true});
        if(!thumbnail) {
            return reply.notFound("Thumbnail not found");
        }
        reply.send(thumbnail)
    } catch (err) {
        reply.send(err);
    }
}

exports.deleteThumbnail = async (request, reply) => {
    try {
        const deleteThumbnail = await Thumbnail.findByIdAndDelete({
          _id: request.params.id,
          user: request.user.id,
        });
        if (!deleteThumbnail) {
          return reply.notFound("Thumbnail not found");
        }

        const filePath = path.join(
          __dirname,
          "..",
          "uploads",
          "thumbnails",
          path.basename(deleteThumbnail.image),
        );
        fs.unlink(filePath, (err) => {
            if(err) fastify.log.error()
        })
        reply.send({message: "Thumnail deleted"})
    } catch (err) {
        reply.send(err);
    }
}

exports.deleteAllThumbnails = async(request, reply) => {
    try {
        const thumbnails = await Thumbnail.find({ user: request.user.id });
        await Thumbnail.deleteMany({ user: request.user.id });

        for (const thumbnail of thumbnails) {
            const filePath = path.join(
              __dirname,
              "..",
              "uploads",
              "thumbnails",
              path.basename(deleteThumbnail.image),
            );
            fs.unlink(filepath, (err) => {
              if (err) fastify.log.error(err);
            });
            reply.send({ message: "All thumbnails deleted" });
        }
    } catch (err) {
        reply.se4(err)
    }
}
    