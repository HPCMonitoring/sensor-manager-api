/*
  Warnings:

  - You are about to drop the column `status` on the `Sensor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "status";

-- DropEnum
DROP TYPE "SensorStatus";
