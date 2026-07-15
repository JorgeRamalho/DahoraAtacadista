import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      service: "dahora-atacadista",
      database: "up",
      provider: "postgresql",
      latencyMs: Date.now() - started,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "dahora-atacadista",
        database: "down",
        provider: "postgresql",
        latencyMs: Date.now() - started,
        timestamp: new Date().toISOString(),
        message:
          error instanceof Error ? error.message : "Falha ao conectar no banco",
      },
      { status: 503 }
    );
  }
}
