import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/session";
import { optionsCors, withCors } from "@/lib/api/cors";

export async function OPTIONS(request: Request) {
  return optionsCors(request);
}

export async function POST(request: Request) {
  await clearSession();
  return withCors(
    request,
    NextResponse.json({ message: "Sessão encerrada." })
  );
}
