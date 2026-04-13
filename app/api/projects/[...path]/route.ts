import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Proxy requests to backend /api/projects/[...paths]
 * Handles: GET /api/projects/:id, POST /api/projects/:id/save-measurement, etc
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    const token =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token de autenticação ausente" },
        { status: 401 },
      );
    }

    const pathStr = path.join("/");
    const query = request.nextUrl.search;
    const url = `${API_BASE}/api/projects/${pathStr}${query}`;

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    const authHeader = request.headers.get("authorization");
    let token = authHeader?.replace("Bearer ", "");

    // Se não tiver token no header, tenta pegar do body
    if (!token) {
      const body = await request.clone().json();
      token = body.token;
    }

    if (!token) {
      return NextResponse.json(
        { error: "Token de autenticação ausente" },
        { status: 401 },
      );
    }

    const pathStr = path.join("/");
    const url = `${API_BASE}/api/projects/${pathStr}`;
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    const token =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token de autenticação ausente" },
        { status: 401 },
      );
    }

    const pathStr = path.join("/");
    const url = `${API_BASE}/api/projects/${pathStr}`;

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
