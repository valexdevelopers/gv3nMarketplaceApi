/*
  Warnings:

  - A unique constraint covering the columns `[userType,userId,accessToken]` on the table `PersonalAccessCodes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PersonalAccessCodes_userType_userId_accessToken_key" ON "PersonalAccessCodes"("userType", "userId", "accessToken");
