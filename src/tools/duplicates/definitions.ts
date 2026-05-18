import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const findDuplicatesTool: Tool = {
    name: "notion_find_duplicates",
    description:
        "Finds duplicate pages in a Notion database by comparing their title. Useful for cleaning up CRM databases, contact lists, or any database that may have repeated entries.",
    annotations: {
        title: "Find Duplicates",
        readOnlyHint: true,
        destructiveHint: false,
    },
    inputSchema: {
        type: "object",
        properties: {
            data_source_id: {
                type: "string",
                description: "The ID of the Notion database to scan for duplicates.",
            },
        },
        required: ["data_source_id"],
    },
};