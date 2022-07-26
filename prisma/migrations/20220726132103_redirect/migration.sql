/*
  Warnings:

  - You are about to drop the column `redirec` on the `LoginToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LoginToken" DROP COLUMN "redirec",
ADD COLUMN     "redirect" TEXT NOT NULL DEFAULT E'/';
