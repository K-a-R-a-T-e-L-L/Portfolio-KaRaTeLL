/*
  Warnings:

  - You are about to drop the column `messageId` on the `Messages` table. All the data in the column will be lost.
  - Added the required column `messagesIPID` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `date` on the `MessagesIP` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_messageId_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "messageId",
ADD COLUMN     "messagesIPID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MessagesIP" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MessagesIP_date_key" ON "MessagesIP"("date");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_messagesIPID_fkey" FOREIGN KEY ("messagesIPID") REFERENCES "MessagesIP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
