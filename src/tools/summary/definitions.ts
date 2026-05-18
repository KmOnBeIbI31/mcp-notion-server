import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const weeklySummaryTool: Tool = {
    name: "notion_weekly_summary",
    description:
        "Returns a summary of all Notion pages modified in the last 7 days. Useful for weekly reviews, standups, or catching up on recent activity in a workspace.",
    annotations: {
        title: "Weekly Summary",
        readOnlyHint: true,
        destructiveHint: false,
    },
    inputSchema: {
        type: "object",
        properties: {
            days: {
                type: "number",
                description:
                    "Number of days to look back. Defaults to 7. Use 1 for a daily summary.",
            },
        },
        required: [],
    },
};