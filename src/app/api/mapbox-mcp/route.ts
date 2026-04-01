import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { logger } from "@/utils/logger";

const ALLOWED_TOOLS = new Set([
  "category_search_tool",
  "search_and_geocode_tool",
  "directions_tool",
  "matrix_tool",
  "isochrone_tool",
  "reverse_geocode_tool",
  "distance_tool",
  "bbox_tool",
  "place_details_tool",
]);

const MCP_ENDPOINT = "https://mcp.mapbox.com/mcp";

export async function GET() {
  const token =
    process.env.MAPBOX_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const payload = { jsonrpc: "2.0", method: "tools/list", id: randomUUID(), params: {} };

  const res = await fetch(MCP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, text/event-stream",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  const dataLine = text.split("\n").find((l) => l.startsWith("data:"));
  const data = dataLine ? JSON.parse(dataLine.slice(5).trim()) : { raw: text };
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const token =
    process.env.MAPBOX_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Mapbox token not configured" },
      { status: 500 }
    );
  }

  let body: { tool: string; input: Record<string, unknown> };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { tool, input } = body;

  if (!tool || !ALLOWED_TOOLS.has(tool)) {
    return NextResponse.json(
      { error: `Tool "${tool}" is not allowed` },
      { status: 400 }
    );
  }

  const mcpPayload = {
    jsonrpc: "2.0",
    method: "tools/call",
    id: randomUUID(),
    params: {
      name: tool,
      arguments: input,
    },
  };

  try {
    const response = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(mcpPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("Mapbox MCP error:", errorText);
      return NextResponse.json(
        { error: "Mapbox MCP request failed" },
        { status: response.status }
      );
    }

    const responseText = await response.text();

    // MCP Server responds with SSE (text/event-stream): extract the data lines
    const dataLine = responseText
      .split("\n")
      .find((line) => line.startsWith("data:"));

    if (!dataLine) {
      return NextResponse.json({ features: [] });
    }

    const data = JSON.parse(dataLine.slice("data:".length).trim());
    const rawText = data?.result?.content?.[0]?.text;

    if (!rawText) {
      return NextResponse.json({ features: [] });
    }

    // Algumas tools retornam texto formatado em vez de JSON
    try {
      const parsed = JSON.parse(rawText);
      return NextResponse.json(parsed);
    } catch {
      // Resposta não é JSON (texto formatado ou erro descritivo) — retorna vazio
      return NextResponse.json({ features: [] });
    }
  } catch (error) {
    logger.error("Mapbox MCP proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
