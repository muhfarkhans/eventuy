-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "refreshToken" TEXT;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "refreshToken" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;
