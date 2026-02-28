-- CreateTable
CREATE TABLE "CategoryLike" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryFavorite" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CategoryLike_category_id_idx" ON "CategoryLike"("category_id");

-- CreateIndex
CREATE INDEX "CategoryLike_user_id_idx" ON "CategoryLike"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryLike_category_id_user_id_key" ON "CategoryLike"("category_id", "user_id");

-- CreateIndex
CREATE INDEX "CategoryFavorite_category_id_idx" ON "CategoryFavorite"("category_id");

-- CreateIndex
CREATE INDEX "CategoryFavorite_user_id_idx" ON "CategoryFavorite"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryFavorite_category_id_user_id_key" ON "CategoryFavorite"("category_id", "user_id");

-- AddForeignKey
ALTER TABLE "CategoryLike" ADD CONSTRAINT "CategoryLike_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryLike" ADD CONSTRAINT "CategoryLike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryFavorite" ADD CONSTRAINT "CategoryFavorite_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryFavorite" ADD CONSTRAINT "CategoryFavorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
