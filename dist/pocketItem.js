"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PocketItem {
    constructor(data) {
        this.itemId = data.itemId;
        this.resolvedId = data.resolvedId;
        this.givenTitle = data.givenTitle;
        this.givenUrl = data.givenUrl;
        this.favorite = data.favorite;
        this.status = data.status;
        this.timeAdded = data.timeAdded;
        this.timeUpdated = data.timeUpdated;
        this.timeRead = data.timeRead;
        this.timeFavorited = data.timeFavorited;
        this.sortId = data.sortId;
        this.resolvedTitle = data.resolvedTitle;
        this.resolvedUrl = data.resolvedUrl;
        this.excerpt = data.excerpt;
        this.isArticle = data.isArticle;
        this.isIndex = data.isIndex;
        this.hasVideo = data.hasVideo;
        this.hasImage = data.hasImage;
        this.wordCount = data.wordCount;
        this.rawData = data.rawData;
    }
}
exports.PocketItem = PocketItem;
