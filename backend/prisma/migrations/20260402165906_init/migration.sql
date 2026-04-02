-- CreateTable
CREATE TABLE "ButtonClick" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "buttonLabel" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ButtonClick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoWatchTime" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "videoId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "watchedSeconds" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoWatchTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrollDepth" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "contentId" TEXT NOT NULL,
    "maxScrollPercentage" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrollDepth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ButtonClick_contentId_buttonLabel_idx" ON "ButtonClick"("contentId", "buttonLabel");

-- CreateIndex
CREATE INDEX "VideoWatchTime_videoId_idx" ON "VideoWatchTime"("videoId");

-- CreateIndex
CREATE INDEX "ScrollDepth_contentId_idx" ON "ScrollDepth"("contentId");
