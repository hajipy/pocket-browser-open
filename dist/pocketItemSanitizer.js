"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pocketItem_1 = require("./pocketItem");
function parseStatus(status) {
    switch (status) {
        case "0":
            return "normal";
        case "1":
            return "archived";
        case "2":
            return "deleted";
        default:
            throw new Error(`invalid status: ${status}`);
    }
}
function parseDate(unixTimeStampString) {
    return new Date(parseInt(unixTimeStampString, 10) * 1000);
}
function parseNullableDate(unixTimeStampString) {
    return (unixTimeStampString === "0") ? null : parseDate(unixTimeStampString);
}
function parseHasVideo(hasVideo) {
    if (hasVideo === undefined) {
        return "none";
    }
    switch (hasVideo) {
        case "0":
            return "none";
        case "1":
            return "has in";
        case "2":
            return "is";
        default:
            throw new Error(`invalid has_video: ${hasVideo}`);
    }
}
function parseHasImage(hasImage) {
    if (hasImage === undefined) {
        return "none";
    }
    switch (hasImage) {
        case "0":
            return "none";
        case "1":
            return "has in";
        case "2":
            return "is";
        default:
            throw new Error(`invalid has_image: ${hasImage}`);
    }
}
function sanitize(raw) {
    if (raw.item_id === undefined) {
        throw new Error("item_id is undefined");
    }
    if (raw.resolved_id === undefined) {
        throw new Error("resolved_id is undefined");
    }
    if (raw.given_url === undefined) {
        throw new Error("given_url is undefined");
    }
    if (raw.given_title === undefined) {
        throw new Error("given_title is undefined");
    }
    if (raw.favorite === undefined) {
        throw new Error("favorite is undefined");
    }
    if (raw.status === undefined) {
        throw new Error("status is undefined");
    }
    if (raw.time_added === undefined) {
        throw new Error("time_added is undefined");
    }
    if (raw.time_updated === undefined) {
        throw new Error("time_updated is undefined");
    }
    if (raw.time_read === undefined) {
        throw new Error("time_read is undefined");
    }
    if (raw.time_favorited === undefined) {
        throw new Error("time_favorited is undefined");
    }
    if (raw.sort_id === undefined) {
        throw new Error("sort_id is undefined");
    }
    if (raw.resolved_title === undefined) {
        throw new Error("resolved_title is undefined");
    }
    if (raw.resolved_url === undefined) {
        throw new Error("resolved_url is undefined");
    }
    if (raw.excerpt === undefined) {
        throw new Error("excerpt is undefined");
    }
    if (raw.is_article === undefined) {
        throw new Error("is_article is undefined");
    }
    if (raw.is_index === undefined) {
        throw new Error("is_index is undefined");
    }
    if (raw.has_video === undefined) {
        throw new Error("has_video is undefined");
    }
    if (raw.has_image === undefined) {
        throw new Error("has_image is undefined");
    }
    if (raw.word_count === undefined) {
        throw new Error("word_count is undefined");
    }
    const itemId = parseInt(raw.item_id, 10);
    const resolvedId = parseInt(raw.resolved_id, 10);
    const givenUrl = raw.given_url;
    const givenTitle = raw.given_title;
    const favorite = (raw.favorite === "1");
    const status = parseStatus(raw.status);
    const timeAdded = parseDate(raw.time_added);
    const timeUpdated = parseDate(raw.time_updated);
    const timeRead = parseNullableDate(raw.time_read);
    const timeFavorited = parseNullableDate(raw.time_favorited);
    const sortId = raw.sort_id;
    const resolvedTitle = raw.resolved_title;
    const resolvedUrl = raw.resolved_url;
    const excerpt = raw.excerpt;
    const isArticle = (raw.is_article === "1");
    const isIndex = raw.is_index;
    const hasVideo = parseHasVideo(raw.has_video);
    const hasImage = parseHasImage(raw.has_image);
    const wordCount = parseInt(raw.word_count, 10);
    const rawData = raw;
    return new pocketItem_1.PocketItem({
        itemId,
        resolvedId,
        givenUrl,
        givenTitle,
        favorite,
        status,
        timeAdded,
        timeUpdated,
        timeRead,
        timeFavorited,
        sortId,
        resolvedTitle,
        resolvedUrl,
        excerpt,
        isArticle,
        isIndex,
        hasVideo,
        hasImage,
        wordCount,
        rawData,
    });
}
exports.sanitize = sanitize;
