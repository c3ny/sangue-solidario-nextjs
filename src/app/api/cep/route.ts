import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cep = searchParams.get("cep")?.replace(/\D/g, "");

  if (!cep || cep.length !== 8) {
    return Response.json({ error: "CEP inválido" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return Response.json({ error: "CEP não encontrado" }, { status: 404 });
    }

    const data = await res.json();

    if (data.erro) {
      return Response.json({ error: "CEP não encontrado" }, { status: 404 });
    }

    return Response.json({
      city: data.localidade,
      uf: data.uf,
      address: data.logradouro || "",
      neighborhood: data.bairro || "",
      zipcode: data.cep || "",
    });
  } catch {
    return Response.json({ error: "Erro ao consultar CEP" }, { status: 500 });
  }
}
