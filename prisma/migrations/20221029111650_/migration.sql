/*
  Warnings:

  - The primary key for the `api_usage_records` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `api_usage_records` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `peer_review_fields` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `peer_review_fields` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `peer_reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `peer_reviews` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `peer_review_id` on the `peer_review_fields` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "peer_review_fields" DROP CONSTRAINT "peer_review_fields_peer_review_id_fkey";

-- AlterTable
ALTER TABLE "api_usage_records" DROP CONSTRAINT "api_usage_records_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "api_usage_records_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "peer_review_fields" DROP CONSTRAINT "peer_review_fields_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "peer_review_id",
ADD COLUMN     "peer_review_id" INTEGER NOT NULL,
ADD CONSTRAINT "peer_review_fields_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "peer_reviews" DROP CONSTRAINT "peer_reviews_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "peer_reviews_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "peer_review_fields" ADD CONSTRAINT "peer_review_fields_peer_review_id_fkey" FOREIGN KEY ("peer_review_id") REFERENCES "peer_reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
