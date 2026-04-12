import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { HOOKApiClient } from "./client.js";
import { readConfigFromEnv, type HOOKMcpConfig } from "./config.js";
import { createToolDefinitions } from "./tools.js";

export function createHOOKMcpServer(config: HOOKMcpConfig = readConfigFromEnv()) {
  const server = new McpServer({
    name: "paperclip",
    version: "0.1.0",
  });

  const client = new HOOKApiClient(config);
  const tools = createToolDefinitions(client);
  for (const tool of tools) {
    server.tool(tool.name, tool.description, tool.schema.shape, tool.execute);
  }

  return {
    server,
    tools,
    client,
  };
}

export async function runServer(config: HOOKMcpConfig = readConfigFromEnv()) {
  const { server } = createHOOKMcpServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
