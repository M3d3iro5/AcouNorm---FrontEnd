import { signOut } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Executar signout do NextAuth
    // Remover cookies de sessão
    const response = NextResponse.json({
      message: "Logout realizado com sucesso",
      redirectUrl: "/",
    });

    // Limpar cookies de autenticação
    response.cookies.set("next-auth.session-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    response.cookies.set("next-auth.csrf-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error("Signout error:", err);
    return NextResponse.json(
      { error: "Erro ao fazer logout" },
      { status: 500 },
    );
  }
}
