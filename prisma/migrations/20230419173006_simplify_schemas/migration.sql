/*
  Warnings:

  - You are about to drop the `KafkaBroker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KafkaTopic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SensorTopicConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "KafkaTopic" DROP CONSTRAINT "KafkaTopic_brokerId_fkey";

-- DropForeignKey
ALTER TABLE "SensorTopicConfig" DROP CONSTRAINT "SensorTopicConfig_filterTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "SensorTopicConfig" DROP CONSTRAINT "SensorTopicConfig_kafkaTopicId_fkey";

-- DropForeignKey
ALTER TABLE "SensorTopicConfig" DROP CONSTRAINT "SensorTopicConfig_sensorId_fkey";

-- DropTable
DROP TABLE "KafkaBroker";

-- DropTable
DROP TABLE "KafkaTopic";

-- DropTable
DROP TABLE "SensorTopicConfig";

-- CreateTable
CREATE TABLE "SensorKafkaJob" (
    "id" TEXT NOT NULL,
    "interval" DOUBLE PRECISION NOT NULL,
    "script" TEXT NOT NULL DEFAULT '# YAML script',
    "topicName" TEXT NOT NULL,
    "brokerUrl" TEXT NOT NULL,
    "filterTemplateId" TEXT,
    "sensorId" TEXT NOT NULL,

    CONSTRAINT "SensorKafkaJob_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SensorKafkaJob" ADD CONSTRAINT "SensorKafkaJob_filterTemplateId_fkey" FOREIGN KEY ("filterTemplateId") REFERENCES "FilterTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorKafkaJob" ADD CONSTRAINT "SensorKafkaJob_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
