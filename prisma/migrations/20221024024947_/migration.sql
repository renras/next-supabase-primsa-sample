-- CreateTable
CREATE TABLE "api_usage_records" (
    "id" SERIAL NOT NULL,
    "api_name" TEXT NOT NULL,
    "called_at" TIMESTAMP(3) NOT NULL,
    "called_by" TEXT NOT NULL,

    CONSTRAINT "api_usage_records_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "api_usage_records" ADD CONSTRAINT "api_usage_records_called_by_fkey" FOREIGN KEY ("called_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
