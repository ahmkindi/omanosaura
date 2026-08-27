-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('none', 'admin', 'writer');

-- CreateEnum
CREATE TYPE "product_kind" AS ENUM ('school', 'team', 'exp');

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "subtitle_ar" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "description_ar" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "base_price_baisa" BIGINT NOT NULL,
    "extra_price_baisa" BIGINT NOT NULL DEFAULT 0,
    "planned_dates" DATE[] DEFAULT ARRAY[]::DATE[],
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "last_updated" DATE NOT NULL,
    "is_deleted" BOOLEAN NOT NULL,
    "kind" "product_kind" NOT NULL DEFAULT 'exp',
    "price_per" INTEGER NOT NULL DEFAULT 4,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'none',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" UUID NOT NULL,
    "product_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "num_of_participants" INTEGER NOT NULL,
    "paid" BOOLEAN NOT NULL,
    "cost_baisa" BIGINT NOT NULL,
    "chosen_date" DATE NOT NULL,
    "complete" BOOLEAN NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_DATE,
    "extra_price_chosen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "product_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "last_updated" DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("product_id","user_id")
);

-- CreateTable
CREATE TABLE "user_customer_id" (
    "user_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "user_customer_id_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "description_ar" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "page_ar" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_customer_id" ADD CONSTRAINT "user_customer_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Parity with legacy schema: CHECK constraints not modeled by Prisma
ALTER TABLE "products" ADD CONSTRAINT "longitude_validate" CHECK (longitude <= 180 AND longitude >= -180);
ALTER TABLE "products" ADD CONSTRAINT "latitude_validate" CHECK (latitude <= 90 AND latitude >= -90);
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rating_check" CHECK (rating > 0 AND rating <= 5);
