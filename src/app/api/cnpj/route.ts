import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cnpj = new URL(request.url).searchParams
    .get("cnpj")
    ?.replace(/\D/g, "");

  if (!cnpj || cnpj.length !== 14) {
    return Response.json({ error: "CNPJ inválido" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SangueSolidario/1.0)",
        Accept: "application/json",
      },
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`[CNPJ] BrasilAPI returned ${res.status} for ${cnpj}:`, errorBody);
      return Response.json(
        { error: "CNPJ não encontrado na Receita Federal" },
        { status: 404 }
      );
    }

    const data = await res.json();
    console.log(`[CNPJ] situacao_cadastral=${data.situacao_cadastral} (${typeof data.situacao_cadastral}) for ${cnpj}`);

    // situacao_cadastral 2 = Ativa (comparação via Number() para garantir tipo)
    if (Number(data.situacao_cadastral) !== 2) {
      return Response.json(
        {
          error: `CNPJ com situação irregular: ${data.descricao_situacao_cadastral ?? "desconhecida"}`,
        },
        { status: 422 }
      );
    }

    return Response.json({
      razaoSocial: data.razao_social,
      nomeFantasia: data.nome_fantasia,
    });
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    console.error("[CNPJ] Error:", err);
    return Response.json(
      { error: isAbort ? "Tempo limite excedido ao consultar CNPJ" : "Erro ao consultar CNPJ" },
      { status: 500 }
    );
  }
}
