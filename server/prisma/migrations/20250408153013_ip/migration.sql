-- CreateTable
CREATE TABLE "Meassage" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "date" INTEGER NOT NULL,

    CONSTRAINT "Meassage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Meassage_ip_key" ON "Meassage"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "Meassage_date_key" ON "Meassage"("date");
