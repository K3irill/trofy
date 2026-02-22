-- AlterTable
ALTER TABLE "UserAchievement" ADD COLUMN     "can_comment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "can_like" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "completion_date" TIMESTAMP(3),
ADD COLUMN     "difficulty" INTEGER,
ADD COLUMN     "impressions" TEXT,
ADD COLUMN     "is_hidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_main" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AchievementComment" (
    "id" TEXT NOT NULL,
    "user_achievement_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "parent_comment_id" TEXT,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "AchievementComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementLike" (
    "id" TEXT NOT NULL,
    "user_achievement_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AchievementLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementFavorite" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_achievement_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AchievementFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementPhoto" (
    "id" TEXT NOT NULL,
    "user_achievement_id" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AchievementPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AchievementComment_user_achievement_id_idx" ON "AchievementComment"("user_achievement_id");

-- CreateIndex
CREATE INDEX "AchievementComment_user_id_idx" ON "AchievementComment"("user_id");

-- CreateIndex
CREATE INDEX "AchievementComment_parent_comment_id_idx" ON "AchievementComment"("parent_comment_id");

-- CreateIndex
CREATE INDEX "AchievementComment_created_at_idx" ON "AchievementComment"("created_at");

-- CreateIndex
CREATE INDEX "AchievementLike_user_achievement_id_idx" ON "AchievementLike"("user_achievement_id");

-- CreateIndex
CREATE INDEX "AchievementLike_user_id_idx" ON "AchievementLike"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AchievementLike_user_achievement_id_user_id_key" ON "AchievementLike"("user_achievement_id", "user_id");

-- CreateIndex
CREATE INDEX "AchievementFavorite_user_id_idx" ON "AchievementFavorite"("user_id");

-- CreateIndex
CREATE INDEX "AchievementFavorite_user_achievement_id_idx" ON "AchievementFavorite"("user_achievement_id");

-- CreateIndex
CREATE UNIQUE INDEX "AchievementFavorite_user_id_user_achievement_id_key" ON "AchievementFavorite"("user_id", "user_achievement_id");

-- CreateIndex
CREATE INDEX "AchievementPhoto_user_achievement_id_idx" ON "AchievementPhoto"("user_achievement_id");

-- CreateIndex
CREATE INDEX "AchievementPhoto_order_idx" ON "AchievementPhoto"("order");

-- AddForeignKey
ALTER TABLE "AchievementComment" ADD CONSTRAINT "AchievementComment_user_achievement_id_fkey" FOREIGN KEY ("user_achievement_id") REFERENCES "UserAchievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementComment" ADD CONSTRAINT "AchievementComment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementComment" ADD CONSTRAINT "AchievementComment_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "AchievementComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementLike" ADD CONSTRAINT "AchievementLike_user_achievement_id_fkey" FOREIGN KEY ("user_achievement_id") REFERENCES "UserAchievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementLike" ADD CONSTRAINT "AchievementLike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementFavorite" ADD CONSTRAINT "AchievementFavorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementFavorite" ADD CONSTRAINT "AchievementFavorite_user_achievement_id_fkey" FOREIGN KEY ("user_achievement_id") REFERENCES "UserAchievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementPhoto" ADD CONSTRAINT "AchievementPhoto_user_achievement_id_fkey" FOREIGN KEY ("user_achievement_id") REFERENCES "UserAchievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
