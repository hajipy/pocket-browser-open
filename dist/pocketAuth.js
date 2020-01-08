"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const url = __importStar(require("url"));
const querystring = __importStar(require("querystring"));
const open_1 = __importDefault(require("open"));
const koa_1 = __importDefault(require("koa"));
class PocketAuth {
    constructor(consumerKey) {
        this.consumerKey = consumerKey;
    }
    async getRequestToken() {
        try {
            const response = await axios_1.default.post("https://getpocket.com/v3/oauth/request", {
                consumer_key: this.consumerKey,
                redirect_uri: PocketAuth.redirectUri
            }, {
                headers: { "X-Accept": "application/json" }
            });
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
            else if (error.response.status >= 500 && error.response.status < 600 &&
                error.response.headers["x-error-code"] === "199") {
                throw new Error("Pocket server issue.");
            }
            else {
                throw error;
            }
        }
    }
    async authorizeRequestToken(requestToken) {
        return new Promise(async (resolve) => {
            this.webApp = new koa_1.default();
            this.webApp.use((ctx) => {
                ctx.response.body = "<html lang='en'><body><script>window.close();</script></body></html>";
                this.webServer.close();
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
            await open_1.default(authUrl);
        });
    }
    async exchangeRequestTokenToAccessToken(requestToken) {
        try {
            const response = await axios_1.default.post("https://getpocket.com/v3/oauth/authorize", {
                code: requestToken,
                consumer_key: this.consumerKey
            }, {
                headers: { "X-Accept": "application/json" }
            });
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
            else if (error.response.status >= 500 && error.response.status < 600 &&
                error.response.headers["x-error-code"] === "199") {
                throw new Error("Pocket server issue.");
            }
            else {
                throw error;
            }
        }
    }
}
exports.PocketAuth = PocketAuth;
PocketAuth.redirectUri = "http://localhost:3000/";
