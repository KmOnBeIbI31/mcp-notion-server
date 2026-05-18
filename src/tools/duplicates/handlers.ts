import type { ToolHandlerMap } from "../types.js";

function formatNotionId(id: string): string {
    const clean = id.replace(/-/g, "");
    if (clean.length !== 32) return id;
    return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
}

export const duplicatesToolHandlers: ToolHandlerMap = {
    async notion_find_duplicates(toolArguments, { notionClient }) {
        const { data_source_id } = toolArguments as { data_source_id: string };

        if (!data_source_id) {
            throw new Error("Missing required argument: data_source_id");
        }

        const formattedId = formatNotionId(data_source_id);
        const result = await notionClient.queryDataSource(formattedId);

        const titleMap: Record<string, any[]> = {};

        for (const page of result.results as any[]) {
            const titleProp =
                page.properties?.title?.title?.[0]?.plain_text ||
                page.properties?.Name?.title?.[0]?.plain_text ||
                "Sin título";

            if (!titleMap[titleProp]) {
                titleMap[titleProp] = [];
            }
            titleMap[titleProp].push({
                id: page.id,
                title: titleProp,
                url: page.url,
                last_edited: page.last_edited_time,
            });
        }

        const duplicates = Object.values(titleMap).filter(
            (pages) => pages.length > 1
        );

        return {
            total_duplicates_found: duplicates.length,
            duplicates,
        };
    },
};