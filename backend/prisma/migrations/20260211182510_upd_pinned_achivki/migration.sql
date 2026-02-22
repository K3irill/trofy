-- AlterTable
ALTER TABLE "User" ADD COLUMN     "last_activity_date" TIMESTAMP(3),
ADD COLUMN     "pinned_achievements" JSONB NOT NULL DEFAULT '[]';
