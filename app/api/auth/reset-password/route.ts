import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token, password, password_confirm } = await request.json();

    if (!token || !password || !password_confirm) {
      return NextResponse.json(
        { error: "Token, senha e confirmação são obrigatórios" },
        { status: 400 },
      );
    }

    if (password !== password_confirm) {
      return NextResponse.json(
        { error: "As senhas não conferem" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Senha deve ter pelo menos 8 caracteres" },
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

    // Chama backend para resetar senha
    const response = await fetch(`${backendUrl}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password,
        password_confirm,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: error || "Erro ao resetar senha" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { error: "Erro ao resetar senha" },
      { status: 500 },
    );
  }
}
