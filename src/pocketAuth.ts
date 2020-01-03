import axios from "axios";
import * as url from "url";
import * as querystring from "querystring";

import * as open from "open";
import * as Koa from "koa";
import { Server } from "http";

export class PocketAuth {
    protected static readonly redirectUri = "http://localhost:3000/";

    protected webApp: Koa;
    protected webServer: Server;

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

        return response.data.code;
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

    public async waitAuthorizeRequestToken(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.webApp = new Koa();
            this.webApp.use((ctx) => {
                ctx.response.body = "<html lang='en'><body><script>window.close();</script></body></html>";
                this.webServer.close();
                resolve();
            });
            this.webServer = this.webApp.listen(3000);
        })
    }

    public async exchangeRequestTokenToAccessToken(requestToken: string): Promise<string> {
        const response = await axios.post("https://getpocket.com/v3/oauth/authorize",
            {
                code: requestToken,
                consumer_key: this.consumerKey
            },
            {
                headers: { "X-Accept": "application/json" }
            }
        );

        return response.data.access_token;
    }
}
