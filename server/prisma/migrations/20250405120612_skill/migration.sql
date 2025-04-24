-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);
