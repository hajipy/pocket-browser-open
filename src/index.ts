import * as commander from "commander";
import * as open from "open";

import { PocketAuth } from "./pocketAuth";
import { PocketGateway } from "./pocketGateway";
import { PocketItem } from "./pocketItem";

(async () => {
    const program = new commander.Command();
    program
        .option("-d, --host <host>", "Only open items from particular host.")
        .option("-n, --count <count>", "Open items count.", 10);

    program.parse(process.argv);

    if (process.env.POCKET_CONSUMER_KEY === undefined) {
        console.error("Environment variable POCKET_CONSUMER_KEY is not set.");
        process.exit(1);
        return;
    }

    try {
        const pocketAuth = new PocketAuth(process.env.POCKET_CONSUMER_KEY);
        const requestToken = await pocketAuth.getRequestToken();
        await pocketAuth.authorizeRequestToken(requestToken);
        const accessToken = await pocketAuth.exchangeRequestTokenToAccessToken(requestToken);

        const pocketGateway = new PocketGateway(process.env.POCKET_CONSUMER_KEY);
        const items = await pocketGateway.retrieve({
            accessToken,
            state: "unread",
            domain: program.host,
            count: program.count,
        });
        console.log(JSON.stringify(items.map((item) => item.resolvedUrl), null, 4));

        for (const item of items) {
            await open(item.resolvedUrl);
        }

        const results = await pocketGateway.archive({
            accessToken,
            itemIds: items.map((item) => item.itemId),
            time: new Date(),
        });
        const errorItems = results.reduce(
            (accumulator, currentValue, currentIndex) => {
                return currentValue ? accumulator : [...accumulator, items[currentIndex]];
            },
            [] as PocketItem[],
        );
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
