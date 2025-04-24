/*
  Warnings:

  - You are about to drop the `TGBotMessageID` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TGBotMessageID";

-- CreateTable
CREATE TABLE "TGBotMessageIDConfirmDeleteSender" (
    "id" SERIAL NOT NULL,
    "messageID" INTEGER NOT NULL,

    CONSTRAINT "TGBotMessageIDConfirmDeleteSender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TGBotMessageIDConfirmDeleteListSenders" (
    "id" SERIAL NOT NULL,
    "messageID" INTEGER NOT NULL,

    CONSTRAINT "TGBotMessageIDConfirmDeleteListSenders_pkey" PRIMARY KEY ("id")
);
