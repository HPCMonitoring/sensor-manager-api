/*
  Warnings:

  - Added the required column `name` to the `FilterTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FilterTemplate" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "remarks" TEXT;
