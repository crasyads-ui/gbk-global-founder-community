const SUPABASE_URL = "https://yjwgnapymqetxvksqacd.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Y3n5bVO3xveBnyt4LKbCPg_f5ilMSuz";

const headers = {
  apikey: SUPABASE_KEY,
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const country = (searchParams.get("country") || "").trim();
    const city = (searchParams.get("city") || "").trim();
    const category = (searchParams.get("category") || "").trim();

    const params = new URLSearchParams({
      select: "id,business_name,category,city,country,description,address,phone,website,logo_url,listing_status,loyalty_status",
      listing_status: "eq.ACTIVE",
      order: "business_name.asc",
      limit: "100",
    });

    if (q) {
      const safe = q.replace(/[,()]/g, " ").trim();
      params.set("or", `business_name.ilike.*${safe}*,description.ilike.*${safe}*,category.ilike.*${safe}*,city.ilike.*${safe}*,country.ilike.*${safe}*`);
    }
    if (country) params.set("country", `ilike.*${country}*`);
    if (city) params.set("city", `ilike.*${city}*`);
    if (category) params.set("category", `ilike.*${category}*`);

    const response = await fetch(`${SUPABASE_URL}/rest/v1/merchants?${params.toString()}`, {
      headers,
      cache: "no-store",
    });

    const text = await response.text();
    if (!response.ok) {
      return Response.json({ ok: false, error: text || "Business search unavailable." }, { status: 502, headers });
    }

    return Response.json({ ok: true, businesses: JSON.parse(text) }, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Business search unavailable.";
    return Response.json({ ok: false, error: message }, { status: 500, headers });
  }
}
