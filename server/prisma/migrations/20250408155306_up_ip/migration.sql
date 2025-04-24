/*
  Warnings:

  - You are about to drop the `Meassage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Meassage";

-- CreateTable
CREATE TABLE "MessagesIP" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "date" INTEGER NOT NULL,

    CONSTRAINT "MessagesIP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "messageId" INTEGER NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessagesIP_ip_key" ON "MessagesIP"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "MessagesIP_date_key" ON "MessagesIP"("date");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "MessagesIP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
