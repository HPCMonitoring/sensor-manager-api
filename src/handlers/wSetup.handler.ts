import { WSCloseCode, WsCmd, WSSensorCode } from "@constants";
import { W_UNAUTHORIZED, W_CLUSTER_NOT_EXIST, W_ID_NOT_EXIST, W_INTERVAL_SERVER, W_AUTHORIZED } from "@constants/wErrorMessages";
import { SocketStream } from "@fastify/websocket";
import { LiveSensor } from "@services";
import { Sensor } from "@prisma/client";
import { prisma } from "@repositories";
import { WQueryString } from "@schemas/in";
import { sensorManager } from "@services";
import { FastifyRequest } from "fastify";
import { WsMessage, WSAuthPayload, WsMessageWrap, WsSysInfoPayload } from "@interfaces";

const TEMP_PASSWORD = "hpc-monitoring-sensor";

const handleNewSensor = async (req: FastifyRequest<{ Querystring: WQueryString }>, clusterId: string) => {
    const sensorEntity: Sensor = await prisma.sensor.create({
        data: {
            name: req.query.name,
            remarks: "",
            ipAddr: req.ip,
            clusterId: clusterId,
            kernelName: "",
            kernelVersion: "",
            arch: "",
            hostname: "",
            rootUser: ""
        }
    });

    return sensorEntity;
};

const doAuthSuccess = (liveSensor: LiveSensor) => {
    const authMessage: WsMessage<WSAuthPayload> = {
        cmd: WsCmd.AUTH,
        message: W_AUTHORIZED,
        error: WSSensorCode.SUCCESS,
        payload: {
            id: liveSensor.id
        }
    };
    liveSensor.send(authMessage);
};

const doAuthFail = (connection: SocketStream, message: string) => {
    const failMessage: WsMessageWrap<WSAuthPayload> = {
        cmd: WsCmd.AUTH,
        message: message,
        error: WSSensorCode.UNAUTHORIZED,
        payload: {
            id: ""
        },
        coordId: "0"
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
            return undefined;
        }
        const liveSensor: LiveSensor = new LiveSensor(req.query.id, connection);
        return liveSensor;
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
            return undefined;
        }

        const sensorEntity: Sensor = await handleNewSensor(req, cluster.id);
        const liveSensor: LiveSensor = new LiveSensor(sensorEntity.id, connection);
        return liveSensor;
    }
};

export const wSetupHandler = async (connection: SocketStream, req: FastifyRequest<{ Querystring: WQueryString }>) => {
    global.logger.info(`Sensor connected: ip = ${req.ip}, query = ${JSON.stringify(req.query)}`);
    if (!req.headers.authorization || req.headers.authorization !== TEMP_PASSWORD) {
        doAuthFail(connection, W_UNAUTHORIZED);
        return;
    }

    try {
        const liveSensor = await handleAuth(connection, req);
        if (liveSensor) {
            doAuthSuccess(liveSensor);
            sensorManager.onSensorConnect(liveSensor);
            const sysInfoRequest: WsMessage<WsSysInfoPayload> = {
                cmd: WsCmd.SYS_INFO,
                message: "",
                error: WSSensorCode.SUCCESS,
                payload: "{}"
            };
            try {
                const sysInfo = await liveSensor.sendReqRes(sysInfoRequest, 1000);
                global.logger.debug(`Receive sys info: id = ${liveSensor.id}, message = ${JSON.stringify(sysInfo)}`);
                await prisma.sensor.update({
                    data: {
                        kernelName: sysInfo.kernelName,
                        kernelVersion: sysInfo.kernelVersion,
                        arch: sysInfo.arch,
                        hostname: sysInfo.hostname,
                        rootUser: sysInfo.rootUser
                    },
                    where: {
                        id: liveSensor.id
                    }
                });
            } catch (err) {
                global.logger.error(`Error in sys info request with error = ${err}`);
            }
        }
    } catch (err) {
        global.logger.error(`Setup fail with ip = ${req.ip}, query = ${JSON.stringify(req.query)}, error = ${err}`);
        connection.socket.close(WSCloseCode.INTERNAL_SERVER, W_INTERVAL_SERVER);
    }
};
