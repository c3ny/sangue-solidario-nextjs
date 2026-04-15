import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/utils/logger";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

interface GeminiRequestBody {
  nome: string;
  tipoSanguineo: string;
  quantidade: number;
  endereco: string;
  datainicio?: string;
  datatermino?: string;
}

function validateBody(input: unknown): { ok: true; data: GeminiRequestBody } | { ok: false; details: string[] } {
  const details: string[] = [];
  if (!input || typeof input !== "object") {
    return { ok: false, details: ["body must be an object"] };
  }
  const b = input as Record<string, unknown>;
  if (typeof b.nome !== "string" || b.nome.trim().length === 0)
    details.push("nome is required (string)");
  if (typeof b.tipoSanguineo !== "string" || b.tipoSanguineo.trim().length === 0)
    details.push("tipoSanguineo is required (string)");
  if (typeof b.quantidade !== "number" || !Number.isFinite(b.quantidade) || b.quantidade < 1)
    details.push("quantidade is required (positive number)");
  if (typeof b.endereco !== "string" || b.endereco.trim().length === 0)
    details.push("endereco is required (string)");
  if (b.datainicio !== undefined && typeof b.datainicio !== "string")
    details.push("datainicio must be a string if provided");
  if (b.datatermino !== undefined && typeof b.datatermino !== "string")
    details.push("datatermino must be a string if provided");

  if (details.length > 0) return { ok: false, details };
  return {
    ok: true,
    data: {
      nome: b.nome as string,
      tipoSanguineo: b.tipoSanguineo as string,
      quantidade: b.quantidade as number,
      endereco: b.endereco as string,
      datainicio: b.datainicio as string | undefined,
      datatermino: b.datatermino as string | undefined,
    },
  };
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "gemini_not_configured" },
      { status: 500 }
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json" },
      { status: 400 }
    );
  }

  const result = validateBody(raw);
  if (!result.ok) {
    return NextResponse.json(
      { error: "validation_failed", details: result.details },
      { status: 400 }
    );
  }

  const { nome } = result.data;

  const prompt = `Você escreve mensagens de apelo para doação de sangue no Brasil, em nome da família do paciente.

Paciente: ${nome}

Escreva um texto curto (2 a 3 frases) em português brasileiro, na voz de quem está pedindo ajuda por alguém querido. O texto deve soar humano, genuíno e tocante — como se fosse escrito por um familiar, não por um sistema.

Não mencione tipo sanguíneo, quantidade de bolsas, endereço nem datas — essas informações já aparecem em outro lugar. Foque no lado humano: quem é a pessoa, o momento difícil que ela está passando e o que a doação significa para ela e para a família.

Não use markdown, não use listas, apenas texto corrido.`;

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      logger.error("Gemini API error:", errorText);
      return NextResponse.json(
        { error: "Gemini API request failed" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const text: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return NextResponse.json({ text });
  } catch (error) {
    logger.error("Gemini proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
