/*
  Warnings:

  - Changed the type of `date` on the `MessagesIP` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MessagesIP" DROP COLUMN "date",
ADD COLUMN     "date" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MessagesIP_date_key" ON "MessagesIP"("date");
