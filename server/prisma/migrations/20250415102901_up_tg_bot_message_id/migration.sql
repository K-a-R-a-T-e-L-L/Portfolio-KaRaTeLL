/*
  Warnings:

  - Changed the type of `IDMsgConfirmDeleteSender` on the `TGBotMessageID` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `IDMsgConfirmClearListSenders` on the `TGBotMessageID` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TGBotMessageID" DROP COLUMN "IDMsgConfirmDeleteSender",
ADD COLUMN     "IDMsgConfirmDeleteSender" INTEGER NOT NULL,
DROP COLUMN "IDMsgConfirmClearListSenders",
ADD COLUMN     "IDMsgConfirmClearListSenders" INTEGER NOT NULL;
