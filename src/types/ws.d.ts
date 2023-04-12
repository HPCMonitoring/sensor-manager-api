type WSAuthPayload = {
    id: string;
};

type WsSysInfoPayload = {
    kernelName: string;
    kernelVersion: string;
    arch: string;
    hostname: string;
    rootUser: string;
};

type SensorConfig = {
    broker: string;
    topicName: string;
    interval: number;
    script: ConfigScriptAST;
};

type WsTopicPayload = {
    broker: string;
    topicName: string;
    interval: number;
    type: string;
    fields: Record<string, string>;
    prefixCommand: string;
};

type WsConfigPayload = {
    topics: WsTopicPayload[];
};
