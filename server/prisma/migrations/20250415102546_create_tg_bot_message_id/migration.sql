-- CreateTable
CREATE TABLE "TGBotMessageID" (
    "id" SERIAL NOT NULL,
    "IDMsgConfirmDeleteSender" TEXT NOT NULL,
    "IDMsgConfirmClearListSenders" BOOLEAN NOT NULL,

    CONSTRAINT "TGBotMessageID_pkey" PRIMARY KEY ("id")
);
