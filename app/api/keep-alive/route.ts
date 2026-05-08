import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error, count } = await supabase
    .from("expedientes")
    .select("*", { count: "exact", head: true });

  if (error) {
    return Response.json(
      { ok: false, message: "Error conectando Supabase", error: error.message },
      { status: 500 }
    );
  }

  return Response.json({
    ok: true,
    message: "Supabase activo",
    count,
    time: new Date().toISOString()
  });
}