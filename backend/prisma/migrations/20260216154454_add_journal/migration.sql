-- CreateEnum
CREATE TYPE "JournalEntryType" AS ENUM ('NOTE', 'TASK', 'TOPIC', 'IDEA');

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "type" "JournalEntryType" NOT NULL DEFAULT 'NOTE',
    "folder_id" TEXT,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalFolder" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "icon" TEXT,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalTag" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntryTag" (
    "id" TEXT NOT NULL,
    "journal_entry_id" TEXT NOT NULL,
    "journal_tag_id" TEXT NOT NULL,

    CONSTRAINT "JournalEntryTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JournalEntry_user_id_idx" ON "JournalEntry"("user_id");

-- CreateIndex
CREATE INDEX "JournalEntry_folder_id_idx" ON "JournalEntry"("folder_id");

-- CreateIndex
CREATE INDEX "JournalEntry_type_idx" ON "JournalEntry"("type");

-- CreateIndex
CREATE INDEX "JournalEntry_is_pinned_idx" ON "JournalEntry"("is_pinned");

-- CreateIndex
CREATE INDEX "JournalEntry_is_archived_idx" ON "JournalEntry"("is_archived");

-- CreateIndex
CREATE INDEX "JournalEntry_created_at_idx" ON "JournalEntry"("created_at");

-- CreateIndex
CREATE INDEX "JournalFolder_user_id_idx" ON "JournalFolder"("user_id");

-- CreateIndex
CREATE INDEX "JournalFolder_parent_id_idx" ON "JournalFolder"("parent_id");

-- CreateIndex
CREATE INDEX "JournalTag_user_id_idx" ON "JournalTag"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "JournalTag_user_id_name_key" ON "JournalTag"("user_id", "name");

-- CreateIndex
CREATE INDEX "JournalEntryTag_journal_entry_id_idx" ON "JournalEntryTag"("journal_entry_id");

-- CreateIndex
CREATE INDEX "JournalEntryTag_journal_tag_id_idx" ON "JournalEntryTag"("journal_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "JournalEntryTag_journal_entry_id_journal_tag_id_key" ON "JournalEntryTag"("journal_entry_id", "journal_tag_id");

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "JournalFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalFolder" ADD CONSTRAINT "JournalFolder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalFolder" ADD CONSTRAINT "JournalFolder_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "JournalFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalTag" ADD CONSTRAINT "JournalTag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntryTag" ADD CONSTRAINT "JournalEntryTag_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntryTag" ADD CONSTRAINT "JournalEntryTag_journal_tag_id_fkey" FOREIGN KEY ("journal_tag_id") REFERENCES "JournalTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
