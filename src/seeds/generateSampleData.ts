import { prisma } from "../prisma";
import { hashSync } from "bcrypt";
import { SALT_ROUNDS } from "../constants/crypt";
import { SensorStatus } from "@prisma/client";

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
    await prisma.cluster.create({
        data: {
            name: "BK HPC Laboratory",
            remarks: "Some notes ...",
            sensors: {
                createMany: {
                    data: [
                        {
                            name: "Sensor 1",
                            status: SensorStatus.REQUESTED
                        },
                        {
                            name: "Sensor 2",
                            status: SensorStatus.RUNNING
                        }
                    ]
                }
            }
        }
    });
    const broker = await prisma.kafkaBroker.create({
        data: {
            url: "http://localhost:9092",
            name: "Localhost"
        }
    });
    await prisma.kafkaTopic.create({
        data: {
            name: "hello-world-topic",
            brokerId: broker.id
        }
    });
    await prisma.filterTemplate.create({
        data: {
            script: yamlScript,
            interval: 10
        }
    });
    process.exit(0);
}

generateSampleData();
