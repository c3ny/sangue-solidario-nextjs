import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/utils/logger";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured" },
      { status: 500 }
    );
  }

  let body: {
    nome: string;
    tipoSanguineo: string;
    quantidade: number;
    endereco: string;
    datainicio?: string;
    datatermino?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { nome, tipoSanguineo, quantidade, endereco, datainicio, datatermino } =
    body;

  const dataInicioFormatted = datainicio
    ? new Date(datainicio).toLocaleDateString("pt-BR")
    : null;
  const dataTerminoFormatted = datatermino
    ? new Date(datatermino).toLocaleDateString("pt-BR")
    : null;

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
