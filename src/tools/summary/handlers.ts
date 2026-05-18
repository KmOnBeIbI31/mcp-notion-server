import type { ToolHandlerMap } from "../types.js";

export const summaryToolHandlers: ToolHandlerMap = {
    async notion_weekly_summary(toolArguments, { notionClient }) {
        const days = (toolArguments as { days?: number }).days ?? 7;
        const since = new Date();
        since.setDate(since.getDate() - days);
        const isoDate = since.toISOString();

        const result = await notionClient.search(
            undefined,
            {
                property: "object",
                value: "page",
            },
            {
                direction: "descending",
                timestamp: "last_edited_time",
            }
        );

        const pages = result.results.filter(
            (page: any) => page.last_edited_time >= isoDate
        );

        const summary = pages.map((page: any) => ({
            title:
                page.properties?.title?.title?.[0]?.plain_text ||
                page.properties?.Name?.title?.[0]?.plain_text ||
                "Sin título",
            last_edited: page.last_edited_time,
            url: page.url,
        }));

        return {
            period_days: days,
            pages_modified: summary.length,
            pages: summary,
        };
    },
};