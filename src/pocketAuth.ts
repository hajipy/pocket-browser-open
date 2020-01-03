import axios from "axios";
import * as url from "url";
import * as querystring from "querystring";

import * as open from "open";

export class PocketAuth {
    protected static readonly redirectUri = "http://localhost:3000/";

    public constructor(protected consumerKey: string) {
    }

    public async getRequestToken(): Promise<string> {
        const response = await axios.post(
            "https://getpocket.com/v3/oauth/request",
            {
                consumer_key: this.consumerKey,
                redirect_uri: PocketAuth.redirectUri
            },
            {
                headers: { "X-Accept": "application/json" }
            }
        );

        return response.data.code as string;
    }

    public async openAuthPageInBrowser(requestToken: string): Promise<void> {
        const authUrl = url.format({
            hostname: "getpocket.com",
            pathname: "/auth/authorize",
            protocol: "https",
            search: querystring.stringify({
                redirect_uri: PocketAuth.redirectUri,
                request_token: requestToken
            }),
            slashes: true,
        });

        await open(authUrl);
    }
}
