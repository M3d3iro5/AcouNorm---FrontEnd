import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { full_name, email, password } = await request.json();

    // 🔍 DEBUG: Mostrar exatamente o que foi recebido
    console.log(`\n📝 ========== REGISTER ROUTE DEBUG ==========`);
    console.log(`Full Name: '${full_name}'`);
    console.log(`Email: '${email}'`);
    console.log(`Password length: ${password.length}`);
    console.log(
      `Email chars: ${Array.from(email)
        .map((c, i) => `${i}:'${c}'`)
        .join(", ")}`,
    );
    console.log(`==========================================\n`);

    // Validação básica
    if (!full_name || !email || !password) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { error: "Servidor não configurado" },
        { status: 500 },
      );
    }

    // Chama o backend para registrar o usuário
    const response = await fetch(`${backendUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        {
          error:
            error ||
            "Erro ao criar conta. Verifique se o e-mail já está registrado.",
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Erro ao processar o registro" },
      { status: 500 },
    );
  }
}
