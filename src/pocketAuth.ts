import axios from "axios";

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
}
