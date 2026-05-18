import type { ToolHandlerMap } from "../types.js";

function formatNotionId(id: string): string {
    const clean = id.replace(/-/g, "");
    if (clean.length !== 32) return id;
    return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
}

function cleanBlock(block: any): any {
    const allowedTypes = [
        "paragraph", "heading_1", "heading_2", "heading_3",
        "bulleted_list_item", "numbered_list_item", "to_do",
        "toggle", "code", "quote", "callout", "divider",
    ];
    if (!allowedTypes.includes(block.type)) return null;
    return {
        object: "block",
        type: block.type,
        [block.type]: block[block.type],
    };
}

export const templateToolHandlers: ToolHandlerMap = {
    async notion_create_from_template(toolArguments, { notionClient }) {
        const { template_page_id, new_page_title, parent_page_id } =
            toolArguments as {
                template_page_id: string;
                new_page_title: string;
                parent_page_id: string;
            };

        if (!template_page_id || !new_page_title || !parent_page_id) {
            throw new Error("Missing required arguments");
        }

        // 1. Leer bloques de la plantilla
        const templateBlocks = await notionClient.retrieveBlockChildren(
            formatNotionId(template_page_id)
        );

        const cleanBlocks = (templateBlocks.results as any[])
            .map(cleanBlock)
            .filter(Boolean);

        // 2. Crear página nueva via endpoint /pages directamente
        const newPage = await (notionClient as any).request("/pages", {
            method: "POST",
            body: JSON.stringify({
                parent: { page_id: formatNotionId(parent_page_id) },
                properties: {
                    title: {
                        title: [{ type: "text", text: { content: new_page_title } }],
                    },
                },
                children: cleanBlocks,
            }),
        });

        return {
            success: true,
            new_page_id: newPage.id,
            new_page_url: newPage.url,
            new_page_title,
            blocks_copied: cleanBlocks.length,
        };
    },
};