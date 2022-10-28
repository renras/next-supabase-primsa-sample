/*
  Warnings:

  - You are about to drop the `peer_review_fields` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "peer_review_fields" DROP CONSTRAINT "peer_review_fields_peer_review_id_fkey";

-- DropTable
DROP TABLE "peer_review_fields";

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
ALTER TABLE "PeerReviewFields" ADD CONSTRAINT "PeerReviewFields_peer_review_id_fkey" FOREIGN KEY ("peer_review_id") REFERENCES "peer_reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
