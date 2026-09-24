const SUPABASE_URL = "https://yjwgnapymqetxvksqacd.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Y3n5bVO3xveBnyt4LKbCPg_f5ilMSuz";

const cors = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await fetch(`${SUPABASE_URL}/functions/v1/gbk-founder-membership`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await response.text();
    let payload: unknown;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { ok: false, error: text || "Founder verification service returned an invalid response." };
    }

    return Response.json(payload, {
      status: response.ok ? 200 : response.status,
      headers: cors,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Founder verification service unavailable.";
    return Response.json(
      { ok: false, error: `Founder verification service unavailable: ${message}` },
      { status: 502, headers: cors },
    );
  }
}
