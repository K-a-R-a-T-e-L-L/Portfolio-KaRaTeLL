-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_messagesIPID_fkey";

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_messagesIPID_fkey" FOREIGN KEY ("messagesIPID") REFERENCES "MessagesIP"("id") ON DELETE CASCADE ON UPDATE CASCADE;
