import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const createFromTemplateTool: Tool = {
    name: "notion_create_from_template",
    description:
        "Creates a new Notion page by copying the content and structure of an existing template page. Useful for meeting notes, project kickoffs, onboarding docs, or any repeatable workflow.",
    annotations: {
        title: "Create Page from Template",
        readOnlyHint: false,
        destructiveHint: false,
    },
    inputSchema: {
        type: "object",
        properties: {
            template_page_id: {
                type: "string",
                description: "The ID of the Notion page to use as template.",
            },
            new_page_title: {
                type: "string",
                description: "The title for the new page.",
            },
            parent_page_id: {
                type: "string",
                description: "The ID of the parent page where the new page will be created.",
            },
        },
        required: ["template_page_id", "new_page_title", "parent_page_id"],
    },
};