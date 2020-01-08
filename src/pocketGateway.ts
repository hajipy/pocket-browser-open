import axios from "axios";
import { RawPocketItem } from "./rawPocketItem";
import { sanitize } from "./pocketItemSanitizer";
import { PocketItem } from "./pocketItem";

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

export interface ArchiveOptions {
    accessToken: string;
    itemIds: number[];
    time: Date;
}

function convertDateToUnixTime(aDate: Date): string {
    return Math.floor(aDate.getTime() / 1000).toString();
}

export class PocketGateway {
    public constructor(protected consumerKey: string) {}

    public async retrieve(options: RetrieveOptions): Promise<PocketItem[]> {
        const since: string | undefined =
            (options.since !== undefined)
            ? convertDateToUnixTime(options.since)
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

        const rawItems: RawPocketItem[] = Object.values(response.data.list);
        return rawItems.map(sanitize);
    }

    public async archive(options: ArchiveOptions): Promise<boolean[]> {
        const time = convertDateToUnixTime(options.time);
        const actions = options.itemIds.map((itemId) => {
            return {
                action: "archive",
                item_id: itemId,
                time,
            };
        });
        const data = {
            consumer_key: this.consumerKey,
            access_token: options.accessToken,
            actions,
        };
        const response = await axios.post(
            "https://getpocket.com/v3/send",
            data,
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data.action_results;
    }
}
