import { WSCloseCode, WSSensorCode } from "@constants";
import { W_UNAUTHORIZED, W_CLUSTER_NOT_EXIST, W_ID_NOT_EXIST, W_INTERVAL_SERVER, W_AUTHORIZED } from "@constants/wErrorMessages";
import { SocketStream } from "@fastify/websocket";
import { Sensor } from "@prisma/client";
import { prisma } from "@repositories";
import { WQueryString } from "@schemas/in";
import { WSAuthMessage } from "@schemas/out";
import { sensorManager } from "@services";
import { FastifyRequest } from "fastify";

const TEMP_PASSWORD = "hpc-monitoring-sensor";

const handleNewSensor = async (connection: SocketStream, req: FastifyRequest<{ Querystring: WQueryString }>, clusterId: string) => {
    const sensor: Sensor = await prisma.sensor.create({
        data: {
            name: req.query.name,
            remarks: "Default remark",
            ipAddr: req.ip,
            clusterId: clusterId,
            kernelName: "Linux",
            kernelVersion: "5.19.0-32-generic",
            arch: "x86_64",
            hostname: "PhucVinh",
            rootUser: "root"
        }
    });

    handleAuthSuccess(connection, sensor.id);
    return sensor;
};

const handleAuthSuccess = (connection: SocketStream, id: string) => {
    const authMessage: WSAuthMessage = {
        id: id,
        message: W_AUTHORIZED,
        error: WSSensorCode.SUCCESS
    };
    connection.socket.send(JSON.stringify(authMessage));
};

const handleAuth = async (connection: SocketStream, req: FastifyRequest<{ Querystring: WQueryString }>) => {
    // If id is specified, then check if that id exists in db
    // else create new sensor

    if (req.query.id) {
        const isExist =
            (await prisma.sensor.count({
                where: {
                    id: req.query.id
                }
            })) > 0;

        if (!isExist) {
            connection.socket.close(WSCloseCode.UNAUTHORIZED, W_ID_NOT_EXIST);
            return;
        }
        handleAuthSuccess(connection, req.query.id);
        sensorManager.onSensorConnect(req.query.id, connection);
    } else {
        const cluster = await prisma.cluster.findFirst({
            select: {
                id: true
            },
            where: {
                name: req.query.cluster
            }
        });

        if (!cluster) {
            connection.socket.close(WSCloseCode.UNAUTHORIZED, W_CLUSTER_NOT_EXIST);
            return;
        }
        const sensor: Sensor = await handleNewSensor(connection, req, cluster.id);
        sensorManager.onSensorConnect(sensor.id, connection);
    }
};

export const wAuthHandler = async (connection: SocketStream, req: FastifyRequest<{ Querystring: WQueryString }>) => {
    req.log.info(`Sensor connected: ip = ${req.ip}, query = ${JSON.stringify(req.query)}`);
    if (!req.headers.authorization || req.headers.authorization !== TEMP_PASSWORD) {
        connection.socket.close(WSCloseCode.UNAUTHORIZED, W_UNAUTHORIZED);
        return;
    }

    try {
        handleAuth(connection, req);
    } catch (err) {
        connection.socket.close(WSCloseCode.INTERNAL_SERVER, W_INTERVAL_SERVER);
    }
};
