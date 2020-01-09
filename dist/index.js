#!/usr/bin/env node
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander = __importStar(require("commander"));
const open_1 = __importDefault(require("open"));
const pocketAuth_1 = require("./pocketAuth");
const pocketGateway_1 = require("./pocketGateway");
(async () => {
    const program = new commander.Command();
    program
        .option("-h, --host <host>", "Only open items from particular host.")
        .option("-n, --count <count>", "Open items count.", 10);
    program.parse(process.argv);
    if (process.env.POCKET_CONSUMER_KEY === undefined) {
        console.error("Environment variable POCKET_CONSUMER_KEY is not set.");
        process.exit(1);
        return;
    }
    try {
        const pocketAuth = new pocketAuth_1.PocketAuth(process.env.POCKET_CONSUMER_KEY);
        const requestToken = await pocketAuth.getRequestToken();
        await pocketAuth.authorizeRequestToken(requestToken);
        const accessToken = await pocketAuth.exchangeRequestTokenToAccessToken(requestToken);
        const pocketGateway = new pocketGateway_1.PocketGateway(process.env.POCKET_CONSUMER_KEY);
        const items = await pocketGateway.retrieve({
            accessToken,
            state: "unread",
            domain: program.host,
            count: program.count,
        });
        for (const item of items) {
            await open_1.default(item.resolvedUrl);
        }
        const results = await pocketGateway.archive({
            accessToken,
            itemIds: items.map((item) => item.itemId),
            time: new Date(),
        });
        const errorItems = results.reduce((accumulator, currentValue, currentIndex) => {
            return currentValue ? accumulator : [...accumulator, items[currentIndex]];
        }, []);
        if (errorItems.length > 0) {
            console.error("Archiving item is failed.");
            for (const item of errorItems) {
                console.error(`    itemId:${item.itemId}`);
            }
            process.exit(1);
            return;
        }
    }
    catch (error) {
        console.error(error);
        process.exit(1);
        return;
    }
})();
