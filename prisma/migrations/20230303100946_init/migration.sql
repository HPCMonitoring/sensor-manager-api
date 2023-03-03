-- CreateEnum
CREATE TYPE "SensorStatus" AS ENUM ('RUNNING', 'STOPPED', 'REQUESTED', 'DISCONNECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cluster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "Cluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" TEXT NOT NULL,
    "ipAddr" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "kernelName" VARCHAR(100) NOT NULL,
    "kernelVersion" VARCHAR(50) NOT NULL,
    "arch" VARCHAR(25) NOT NULL,
    "hostname" VARCHAR(100) NOT NULL,
    "rootUser" VARCHAR(50) NOT NULL,
    "remarks" TEXT,
    "status" "SensorStatus" NOT NULL DEFAULT 'REQUESTED',
    "clusterId" TEXT NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KafkaBroker" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "KafkaBroker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KafkaTopic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brokerId" TEXT NOT NULL,

    CONSTRAINT "KafkaTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorConfig" (
    "id" TEXT NOT NULL,
    "interval" INTEGER NOT NULL,
    "sql" TEXT NOT NULL,
    "sensorId" TEXT NOT NULL,
    "kafkaTopicId" TEXT NOT NULL,

    CONSTRAINT "SensorConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilterTemplate" (
    "id" TEXT NOT NULL,
    "script" TEXT NOT NULL,
    "interval" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FilterTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cluster_name_key" ON "Cluster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_clusterId_name_key" ON "Sensor"("clusterId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "KafkaBroker_url_key" ON "KafkaBroker"("url");

-- CreateIndex
CREATE UNIQUE INDEX "KafkaBroker_name_key" ON "KafkaBroker"("name");

-- CreateIndex
CREATE UNIQUE INDEX "KafkaTopic_brokerId_name_key" ON "KafkaTopic"("brokerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SensorConfig_sensorId_kafkaTopicId_key" ON "SensorConfig"("sensorId", "kafkaTopicId");

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KafkaTopic" ADD CONSTRAINT "KafkaTopic_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "KafkaBroker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorConfig" ADD CONSTRAINT "SensorConfig_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorConfig" ADD CONSTRAINT "SensorConfig_kafkaTopicId_fkey" FOREIGN KEY ("kafkaTopicId") REFERENCES "KafkaTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
