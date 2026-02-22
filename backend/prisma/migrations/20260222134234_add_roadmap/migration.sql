-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "user_achievement_id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Roadmap_user_achievement_id_key" ON "Roadmap"("user_achievement_id");

-- CreateIndex
CREATE INDEX "Roadmap_user_achievement_id_idx" ON "Roadmap"("user_achievement_id");

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_user_achievement_id_fkey" FOREIGN KEY ("user_achievement_id") REFERENCES "UserAchievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
