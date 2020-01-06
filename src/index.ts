import * as commander from "commander";

import { PocketAuth } from "./pocketAuth";
import { PocketGateway } from "./pocketGateway";

(async () => {
    const program = new commander.Command();
    program
        .option("-d, --host <host>", "Only open items from particular host.")
        .option("-n, --count <count>", "Open items count.");

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
    }
    catch (error) {
        console.error(error);
        process.exit(1);
        return;
    }
})();
