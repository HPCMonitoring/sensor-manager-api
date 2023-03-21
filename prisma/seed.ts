import { hashSync } from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const user = {
    email: "npvinh0507@gmail.com",
    password: "123456789"
};

const yamlScript = `name: CD

on:
  push:
    branches: ["master"]
  pull_request:
    branches: ["master"]
`;

async function generateSampleData() {
    const hashPassword = hashSync(user.password, SALT_ROUNDS);
    const sampleUser = await prisma.user.create({
        data: {
            email: user.email,
            password: hashPassword
        }
    });

    console.log(sampleUser);

    const cluster = await prisma.cluster.create({
        data: {
            name: "BK HPC Laboratory",
            remarks: "Some notes ..."
        }
    });

    await prisma.sensor.createMany({
        data: [
            {
                name: "Sensor 1",
                remarks: "Some notes ...",
                ipAddr: "14.255.37.12",
                clusterId: cluster.id,
                kernelName: "Linux",
                kernelVersion: "5.19.0-32-generic",
                arch: "x86_64",
                hostname: "PhucVinh",
                rootUser: "root"
            },
            {
                name: "Sensor 2",
                remarks: "Hello, this is sensor 2",
                ipAddr: "14.255.37.145",
                clusterId: cluster.id,
                kernelName: "Linux",
                kernelVersion: "5.19.0-32-generic",
                arch: "x86_64",
                hostname: "PhucVinh",
                rootUser: "root"
            },
            {
                name: "Sensor 3",
                remarks: null,
                ipAddr: "14.255.94.235",
                clusterId: cluster.id,
                kernelName: "Linux",
                kernelVersion: "5.19.0-32-generic",
                arch: "x86_64",
                hostname: "PhucVinh",
                rootUser: "root"
            }
        ]
    });

    const broker = await prisma.kafkaBroker.create({
        data: {
            url: "http://localhost:9092",
            name: "Localhost"
        }
    });

    await prisma.kafkaBroker.create({
        data: {
            url: "https://hpcc.hcmut.edu.vn",
            name: "HPCC",
            topics: {
                createMany: {
                    data: [
                        {
                            name: "ram-usage"
                        },
                        {
                            name: "cpu-usage"
                        }
                    ]
                }
            }
        }
    });

    const kafkaTopic = await prisma.kafkaTopic.create({
        data: {
            name: "hello-world-topic",
            brokerId: broker.id
        }
    });
    const filterTemplate = await prisma.filterTemplate.create({
        data: {
            name: "Sample template",
            remarks: null,
            script: yamlScript,
            interval: 10
        }
    });

    const sensors = await prisma.sensor.findMany();
    await prisma.sensorTopicConfig.createMany({
        data: sensors.map((sensor) => ({
            script: yamlScript,
            kafkaTopicId: kafkaTopic.id,
            interval: 10,
            filterTemplateId: filterTemplate.id,
            sensorId: sensor.id
        }))
    });
    process.exit(0);
}

generateSampleData();