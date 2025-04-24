/*
  Warnings:

  - Added the required column `contacts` to the `MessagesIP` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `MessagesIP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessagesIP" ADD COLUMN     "contacts" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
