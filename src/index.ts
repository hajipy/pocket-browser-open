import { PocketAuth } from "./pocketAuth";

(async () => {
    if (process.env.POCKET_CONSUMER_KEY === undefined) {
        console.error("Environment variable POCKET_CONSUMER_KEY is not set.");
        process.exit(1);
        return;
    }

    const pocketAuth = new PocketAuth(process.env.POCKET_CONSUMER_KEY);
    const requestToken = await pocketAuth.getRequestToken();
    await pocketAuth.authorizeRequestToken(requestToken);
    const accessToken = await pocketAuth.exchangeRequestTokenToAccessToken(requestToken);
    console.log(`requestToken=${requestToken}`);
    console.log(`accessToken=${accessToken}`);
})();
