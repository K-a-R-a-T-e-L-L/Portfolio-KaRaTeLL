/*
  Warnings:

  - You are about to drop the column `messagesIPID` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the `MessagesIP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_messagesIPID_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "messagesIPID",
ADD COLUMN     "messagesUserID" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "MessagesIP";

-- CreateTable
CREATE TABLE "UserMessages" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contacts" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMessages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_messagesUserID_fkey" FOREIGN KEY ("messagesUserID") REFERENCES "UserMessages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
