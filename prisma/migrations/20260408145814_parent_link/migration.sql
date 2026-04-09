-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
