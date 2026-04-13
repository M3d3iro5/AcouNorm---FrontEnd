import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Proxy requests to backend /api/projects endpoints
 * Forwards JWT token and request body
 */
export async function GET(request: NextRequest) {
  try {
    const token =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token de autenticação ausente" },
        { status: 401 },
      );
    }

    // Get the path and query params
    const path = request.nextUrl.pathname.replace("/api/projects", "");
    const query = request.nextUrl.search;
    const url = `${API_BASE}/api/projects${path}${query}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erro ao chamar API de projetos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      (await request.json()).token;

    if (!token) {
      return NextResponse.json(
        { error: "Token de autenticação ausente" },
        { status: 401 },
      );
    }

    const path = request.nextUrl.pathname.replace("/api/projects", "");
    const url = `${API_BASE}/api/projects${path}`;
    const body = await request.json();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erro ao chamar API de projetos:", error);
    return NextResponse.json(
      { error: "Erro ao salvar dados" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token de autenticação ausente" },
        { status: 401 },
      );
    }

    const path = request.nextUrl.pathname.replace("/api/projects", "");
    const url = `${API_BASE}/api/projects${path}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erro ao chamar API de projetos:", error);
    return NextResponse.json(
      { error: "Erro ao deletar dados" },
      { status: 500 },
    );
  }
}
