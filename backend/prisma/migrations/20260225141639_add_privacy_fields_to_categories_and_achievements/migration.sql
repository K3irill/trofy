-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "allowed_user_ids" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "creator_id" TEXT,
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "allowed_user_ids" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Achievement_creator_id_idx" ON "Achievement"("creator_id");

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
