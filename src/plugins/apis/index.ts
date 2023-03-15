// import { verifyToken } from "@middlewares";
import { FastifyInstance } from 'fastify';
import { clusterPlugin } from './cluster.plugin';
import { sensorPlugin } from './sensor.plugin';
// import { userPlugin } from "./user.plugin";

export async function apiPlugin(app: FastifyInstance) {
    // app.addHook("preHandler", verifyToken);
    // app.register(userPlugin, { prefix: "/user" });
    app.register(clusterPlugin, { prefix: '/clusters' });
    app.register(sensorPlugin, { prefix: '/sensors' });
}
