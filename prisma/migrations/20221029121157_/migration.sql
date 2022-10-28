/*
  Warnings:

  - You are about to drop the column `Comment` on the `peer_review_fields` table. All the data in the column will be lost.
  - Added the required column `comment` to the `peer_review_fields` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "peer_review_fields" DROP COLUMN "Comment",
ADD COLUMN     "comment" TEXT NOT NULL;
