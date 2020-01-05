import { PocketAuth } from "./pocketAuth";
import { PocketGateway } from "./pocketGateway";

(async () => {
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
        console.log(`requestToken=${requestToken}`);
        console.log(`accessToken=${accessToken}`);

        const pocketGateway = new PocketGateway(process.env.POCKET_CONSUMER_KEY);
        await pocketGateway.retrieve({
            accessToken,
            state: "unread",
            since: new Date(2020, 0, 1),
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
        return;
    }
})();
