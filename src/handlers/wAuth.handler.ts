import { WSCloseCode, WsCmd, WSSensorCode } from "@constants";
import { W_UNAUTHORIZED, W_CLUSTER_NOT_EXIST, W_ID_NOT_EXIST, W_INTERVAL_SERVER, W_AUTHORIZED } from "@constants/wErrorMessages";
import { SocketStream } from "@fastify/websocket";
import { Sensor } from "@prisma/client";
import { prisma } from "@repositories";
import { WQueryString } from "@schemas/in";
import { WSAuthPayload, WSSensorMessage } from "@schemas/out";
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

    doAuthSuccess(connection, sensor.id);
    return sensor;
};

const doAuthSuccess = (connection: SocketStream, id: string) => {
    const authMessage: WSSensorMessage<WSAuthPayload> = {
        cmd: WsCmd.AUTH,
        message: W_AUTHORIZED,
        error: WSSensorCode.SUCCESS,
        payload: {
            id: id
        }
    };
    connection.socket.send(JSON.stringify(authMessage));
};

const doAuthFail = (connection: SocketStream, message: string) => {
    const failMessage: WSSensorMessage<WSAuthPayload> = {
        cmd: WsCmd.AUTH,
        message: message,
        error: WSSensorCode.UNAUTHORIZED,
        payload: {
            id: ""
        }
    };
    connection.socket.send(JSON.stringify(failMessage));
    connection.socket.close(WSCloseCode.UNAUTHORIZED, W_UNAUTHORIZED);
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
            doAuthFail(connection, W_ID_NOT_EXIST);
            return;
        }
        doAuthSuccess(connection, req.query.id);
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
            doAuthFail(connection, W_CLUSTER_NOT_EXIST);
            return;
        }
        const sensor: Sensor = await handleNewSensor(connection, req, cluster.id);
        sensorManager.onSensorConnect(sensor.id, connection);
    }
};

export const wAuthHandler = async (connection: SocketStream, req: FastifyRequest<{ Querystring: WQueryString }>) => {
    req.log.info(`Sensor connected: ip = ${req.ip}, query = ${JSON.stringify(req.query)}`);
    if (!req.headers.authorization || req.headers.authorization !== TEMP_PASSWORD) {
        doAuthFail(connection, W_UNAUTHORIZED);
        return;
    }

    try {
        handleAuth(connection, req);
    } catch (err) {
        connection.socket.close(WSCloseCode.INTERNAL_SERVER, W_INTERVAL_SERVER);
    }
};
