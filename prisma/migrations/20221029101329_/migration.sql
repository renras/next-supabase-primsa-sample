/*
  Warnings:

  - The primary key for the `api_usage_records` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `peer_reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `peer_reviews` table. All the data in the column will be lost.
  - Added the required column `reviewee_id` to the `peer_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewer_id` to the `peer_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "peer_reviews" DROP CONSTRAINT "peer_reviews_user_id_fkey";

-- AlterTable
ALTER TABLE "api_usage_records" DROP CONSTRAINT "api_usage_records_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "api_usage_records_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "api_usage_records_id_seq";

-- AlterTable
ALTER TABLE "peer_reviews" DROP CONSTRAINT "peer_reviews_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "reviewee_id" TEXT NOT NULL,
ADD COLUMN     "reviewer_id" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "peer_reviews_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "peer_reviews_id_seq";

-- CreateTable
CREATE TABLE "PeerReviewFields" (
    "id" TEXT NOT NULL,
    "peer_review_id" TEXT NOT NULL,
    "presentation_score" INTEGER NOT NULL,
    "technical_score" INTEGER NOT NULL,
    "assist_peers_score" INTEGER NOT NULL,
    "documentation_score" INTEGER NOT NULL,
    "Comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeerReviewFields_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "peer_reviews" ADD CONSTRAINT "peer_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_reviews" ADD CONSTRAINT "peer_reviews_reviewee_id_fkey" FOREIGN KEY ("reviewee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerReviewFields" ADD CONSTRAINT "PeerReviewFields_peer_review_id_fkey" FOREIGN KEY ("peer_review_id") REFERENCES "peer_reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
