-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "positioningIcon" JSONB NOT NULL,
    "number" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "skills" TEXT[],
    "images" JSONB NOT NULL,
    "view" BOOLEAN[],
    "display" BOOLEAN NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
