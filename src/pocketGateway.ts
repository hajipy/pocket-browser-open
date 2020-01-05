import axios from "axios";
import { RawPocketItem } from "./rawPocketItem";

export interface RetrieveOptions {
    accessToken: string;
    state?: "unread" | "archive" | "all" ;
    favorite?: "0" | "1";
    tag?: string;
    contentType?: "article" | "video" | "image";
    sort?: "newest" | "oldest" | "title" | "site";
    detailType?: "simple" | "complete";
    search?: string;
    domain?: string;
    since?: Date;
    count?: number;
    offset?: number;
}

export class PocketGateway {
    public constructor(protected consumerKey: string) {}

    public async retrieve(options: RetrieveOptions): Promise<void> {
        const since: string | undefined =
            (options.since !== undefined)
            ? Math.floor(options.since.getTime() / 1000).toString()
            : undefined;
        const data = {
            consumer_key: this.consumerKey,
            access_token: options.accessToken,
            ...options,
            since,
        };
        const response = await axios.post(
            "https://getpocket.com/v3/get",
            data,
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        const rawArticles: RawPocketItem[] = Object.values(response.data.list);
        console.log(JSON.stringify(rawArticles, null, 4));
        if (rawArticles.length > 0) {
            console.log(JSON.stringify(rawArticles[0], null, 4));
        }
        else {
            console.log("no item.");
        }
    }
}
