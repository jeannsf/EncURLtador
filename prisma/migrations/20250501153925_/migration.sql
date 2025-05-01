-- CreateTable
CREATE TABLE "ShortLink" (
    "id" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "visitCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ShortLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortLink_alias_key" ON "ShortLink"("alias");
