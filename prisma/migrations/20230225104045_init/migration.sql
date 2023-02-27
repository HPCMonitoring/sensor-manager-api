/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "Cluster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "remarks" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Cluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "remarks" TEXT,
    "clusterId" TEXT NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KafkaBroker" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

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
    "filterTemplateId" TEXT,

    CONSTRAINT "SensorConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilterTemplate" (
    "id" TEXT NOT NULL,
    "sql" TEXT NOT NULL,
    "interval" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FilterTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cluster_userId_name_key" ON "Cluster"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_clusterId_name_key" ON "Sensor"("clusterId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "KafkaBroker_url_key" ON "KafkaBroker"("url");

-- CreateIndex
CREATE UNIQUE INDEX "KafkaBroker_userId_name_key" ON "KafkaBroker"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "KafkaTopic_brokerId_name_key" ON "KafkaTopic"("brokerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SensorConfig_sensorId_kafkaTopicId_key" ON "SensorConfig"("sensorId", "kafkaTopicId");

-- AddForeignKey
ALTER TABLE "Cluster" ADD CONSTRAINT "Cluster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KafkaBroker" ADD CONSTRAINT "KafkaBroker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KafkaTopic" ADD CONSTRAINT "KafkaTopic_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "KafkaBroker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorConfig" ADD CONSTRAINT "SensorConfig_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorConfig" ADD CONSTRAINT "SensorConfig_kafkaTopicId_fkey" FOREIGN KEY ("kafkaTopicId") REFERENCES "KafkaTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorConfig" ADD CONSTRAINT "SensorConfig_filterTemplateId_fkey" FOREIGN KEY ("filterTemplateId") REFERENCES "FilterTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilterTemplate" ADD CONSTRAINT "FilterTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
