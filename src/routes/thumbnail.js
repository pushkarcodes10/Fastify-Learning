import thumbnail from "../controllers/thumbnail.controller.js"

export default async function thumbnailRoutes (fastify, opts) {
    fastify.register(async function(fastify){
        fastify.addHook("preHandler", fastify.authenticate)
        
        fastify.post("/", thumbnailController.createThumbnail);
        fastify.get("/", thumbnailController.getThumbnails);
        fastify.get("/:id", thumbnailController.getThumbnail);
        fastify.put("/:id", thumbnailController.updateThumbnail);
        fastify.delete("/:id", thumbnailController.deleteThumbnail);
        fastify.delete("/", thumbnailController.deleteAllThumbnails);
    })
}