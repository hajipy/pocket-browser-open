import axios from "axios";
import * as url from "url";
import * as querystring from "querystring";

import open from "open";
import { default as KoaApplication } from "koa";
import { Server } from "http";

export class PocketAuth {
    protected static readonly redirectUri = "http://localhost:3000/";

    protected webApp: KoaApplication | undefined;
    protected webServer: Server | undefined;

    public constructor(protected consumerKey: string) {
    }

    public async getRequestToken(): Promise<string> {
        try {
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
        catch (error) {
            if (error.response.status === 400 && error.response.headers["x-error-code"] === "138") {
                throw new Error("Missing consumer key.");
            }
            else if (error.response.status === 400 && error.response.headers["x-error-code"] === "140") {
                throw new Error("Missing redirect url.");
            }
            else if (error.response.status === 403 && error.response.headers["x-error-code"] === "152") {
                throw new Error("Invalid consumer key.");
            }
            else if (
                error.response.status >= 500 && error.response.status < 600 &&
                error.response.headers["x-error-code"] === "199"
            ) {
                throw new Error("Pocket server issue.");
            }
            else {
                throw error;
            }
        }
    }

    public async authorizeRequestToken(requestToken: string): Promise<void> {
        return new Promise<void>(async (resolve) => {
            this.webApp = new KoaApplication();
            this.webApp.use((ctx) => {
                ctx.response.body = "<html lang='en'><body><script>window.close();</script></body></html>";
                this.webServer!.close();
                resolve();
            });
            this.webServer = this.webApp.listen(3000);

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
        });
    }

    public async exchangeRequestTokenToAccessToken(requestToken: string): Promise<string> {
        try {
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
        catch (error) {
            if (error.response.status === 400 && error.response.headers["x-error-code"] === "138") {
                throw new Error("Missing consumer key.");
            }
            else if (error.response.status === 403 && error.response.headers["x-error-code"] === "152") {
                throw new Error("Invalid consumer key.");
            }
            else if (error.response.status === 400 && error.response.headers["x-error-code"] === "181") {
                throw new Error("Invalid redirect uri.");
            }
            else if (error.response.status === 400 && error.response.headers["x-error-code"] === "182") {
                throw new Error("Missing code.");
            }
            else if (error.response.status === 400 && error.response.headers["x-error-code"] === "185") {
                throw new Error("Code not found.");
            }
            else if (error.response.status === 403 && error.response.headers["x-error-code"] === "158") {
                throw new Error("User rejected code.");
            }
            else if (error.response.status === 403 && error.response.headers["x-error-code"] === "159") {
                throw new Error("");
            }
            else if (
                error.response.status >= 500 && error.response.status < 600 &&
                error.response.headers["x-error-code"] === "199"
            ) {
                throw new Error("Pocket server issue.");
            }
            else {
                throw error;
            }
        }
    }
}
