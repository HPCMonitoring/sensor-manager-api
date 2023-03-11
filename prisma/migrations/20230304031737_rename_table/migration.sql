/*
  Warnings:

  - You are about to drop the `SensorConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SensorConfig" DROP CONSTRAINT "SensorConfig_filterTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "SensorConfig" DROP CONSTRAINT "SensorConfig_kafkaTopicId_fkey";

-- DropForeignKey
ALTER TABLE "SensorConfig" DROP CONSTRAINT "SensorConfig_sensorId_fkey";

-- DropTable
DROP TABLE "SensorConfig";

-- CreateTable
CREATE TABLE "SensorTopicConfig" (
    "id" TEXT NOT NULL,
    "interval" DOUBLE PRECISION NOT NULL,
    "script" TEXT NOT NULL,
    "sensorId" TEXT NOT NULL,
    "kafkaTopicId" TEXT NOT NULL,
    "filterTemplateId" TEXT,

    CONSTRAINT "SensorTopicConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SensorTopicConfig_sensorId_kafkaTopicId_key" ON "SensorTopicConfig"("sensorId", "kafkaTopicId");

-- AddForeignKey
ALTER TABLE "SensorTopicConfig" ADD CONSTRAINT "SensorTopicConfig_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorTopicConfig" ADD CONSTRAINT "SensorTopicConfig_kafkaTopicId_fkey" FOREIGN KEY ("kafkaTopicId") REFERENCES "KafkaTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorTopicConfig" ADD CONSTRAINT "SensorTopicConfig_filterTemplateId_fkey" FOREIGN KEY ("filterTemplateId") REFERENCES "FilterTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
