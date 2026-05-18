import type { ToolHandlerMap } from "../types.js";

function formatNotionId(id: string): string {
    const clean = id.replace(/-/g, "");
    if (clean.length !== 32) return id;
    return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
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
            throw new Error(
                "Missing required arguments: template_page_id, new_page_title, parent_page_id"
            );
        }

        // 1. Leer los bloques de la plantilla
        const templateBlocks = await notionClient.retrieveBlockChildren(
            formatNotionId(template_page_id)
        );

        // 2. Crear la nueva página via updatePageProperties en el padre
        const newPage = await notionClient.appendBlockChildren(
            formatNotionId(parent_page_id),
            [
                {
                    type: "child_page",
                    child_page: { title: new_page_title },
                } as any,
            ]
        );

        const newPageId = (newPage as any).results?.[0]?.id;

        if (!newPageId) {
            throw new Error("Failed to create new page");
        }

        // 3. Copiar los bloques de la plantilla a la nueva página
        if (templateBlocks.results && templateBlocks.results.length > 0) {
            const blocksToAppend = (templateBlocks.results as any[]).map((block: any) => {
                const { id, created_time, last_edited_time, created_by, last_edited_by, parent, ...rest } = block;
                return rest;
            });

            await notionClient.appendBlockChildren(newPageId, blocksToAppend);
        }

        return {
            success: true,
            new_page_id: newPageId,
            new_page_title,
            blocks_copied: templateBlocks.results?.length ?? 0,
        };
    },
};