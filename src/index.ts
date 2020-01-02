import { PocketAuth } from "./pocketAuth";

(async () => {
    if (process.env.POCKET_CONSUMER_KEY === undefined) {
        console.error("Environment variable POCKET_CONSUMER_KEY is not set.");
        process.exit(1);
        return;
    }

    const pocketAuth = new PocketAuth(process.env.POCKET_CONSUMER_KEY);

    const requestToken = await pocketAuth.getRequestToken();
    console.log(requestToken);
})();
