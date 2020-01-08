"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const pocketItemSanitizer_1 = require("./pocketItemSanitizer");
function convertDateToUnixTime(aDate) {
    return Math.floor(aDate.getTime() / 1000).toString();
}
class PocketGateway {
    constructor(consumerKey) {
        this.consumerKey = consumerKey;
    }
    async retrieve(options) {
        const since = (options.since !== undefined)
            ? convertDateToUnixTime(options.since)
            : undefined;
        const data = Object.assign(Object.assign({ consumer_key: this.consumerKey, access_token: options.accessToken }, options), { since });
        const response = await axios_1.default.post("https://getpocket.com/v3/get", data, {
            headers: { "Content-Type": "application/json" },
        });
        const rawItems = Object.values(response.data.list);
        return rawItems.map(pocketItemSanitizer_1.sanitize);
    }
    async archive(options) {
        const time = convertDateToUnixTime(options.time);
        const actions = options.itemIds.map((itemId) => {
            return {
                action: "archive",
                item_id: itemId,
                time,
            };
        });
        const data = {
            consumer_key: this.consumerKey,
            access_token: options.accessToken,
            actions,
        };
        const response = await axios_1.default.post("https://getpocket.com/v3/send", data, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data.action_results;
    }
}
exports.PocketGateway = PocketGateway;
