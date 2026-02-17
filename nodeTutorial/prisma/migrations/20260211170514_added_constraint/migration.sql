/*
  Warnings:

  - A unique constraint covering the columns `[userID,movieID]` on the table `WatchlistItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_userID_movieID_key" ON "WatchlistItem"("userID", "movieID");
