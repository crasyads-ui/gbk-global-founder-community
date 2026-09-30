const SUPABASE_URL = "https://yjwgnapymqetxvksqacd.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Y3n5bVO3xveBnyt4LKbCPg_f5ilMSuz";

const headers = {
  apikey: SUPABASE_KEY,
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

function addSearch(params: URLSearchParams, q: string) {
  const safe = q.replace(/[,()]/g, " ").trim();
  if (!safe) return;
  params.set("or", `(business_name.ilike.*${safe}*,description.ilike.*${safe}*,category.ilike.*${safe}*,city.ilike.*${safe}*,country.ilike.*${safe}*)`);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    const activeParams = new URLSearchParams({
      select: "id,business_name,category,city,country,description,address,phone,website,logo_url,listing_status,loyalty_status",
      listing_status: "eq.ACTIVE",
      order: "business_name.asc",
      limit: "100",
    });
    addSearch(activeParams, q);

    const activeResponse = await fetch(`${SUPABASE_URL}/rest/v1/merchants?${activeParams.toString()}`, {
      headers,
      cache: "no-store",
    });
    const activeText = await activeResponse.text();
    if (!activeResponse.ok) {
      return Response.json({ ok: false, error: activeText || "Business search unavailable." }, { status: 502, headers });
    }

    const suggestionParams = new URLSearchParams({
      select: "id,business_name,category,city,country,address,phone,website,maps_url,notes,status,auto_review_status,merchant_id",
      auto_review_status: "in.(APPROVED,AUTO_APPROVED)",
      status: "in.(PENDING,REVIEW)",
      order: "business_name.asc",
      limit: "100",
    });
    addSearch(suggestionParams, q);

    const suggestionResponse = await fetch(`${SUPABASE_URL}/rest/v1/business_suggestions?${suggestionParams.toString()}`, {
      headers,
      cache: "no-store",
    });

    const active = JSON.parse(activeText);
    let unclaimed: any[] = [];
    if (suggestionResponse.ok) {
      const suggestions = JSON.parse(await suggestionResponse.text());
      unclaimed = (Array.isArray(suggestions) ? suggestions : [])
        .filter((s: any) => !s.merchant_id)
        .map((s: any) => ({
          id: s.id,
          business_name: s.business_name,
          category: s.category,
          city: s.city,
          country: s.country,
          address: s.address,
          phone: s.phone,
          website: s.website,
          maps_url: s.maps_url,
          description: s.notes || "Real business listing. Owner has not claimed or activated GBK Loyalty yet.",
          listing_status: "UNCLAIMED",
          loyalty_status: "INACTIVE",
          listing_type: "UNCLAIMED",
          unclaimed: true,
        }));
    }

    const businesses = [
      ...(Array.isArray(active) ? active.map((b: any) => ({ ...b, listing_type: "ACTIVE", unclaimed: false })) : []),
      ...unclaimed,
    ].sort((a: any, b: any) => String(a.business_name || "").localeCompare(String(b.business_name || "")));

    return Response.json({
      ok: true,
      businesses,
      counts: {
        active: businesses.filter((b: any) => b.listing_type === "ACTIVE").length,
        unclaimed: businesses.filter((b: any) => b.listing_type === "UNCLAIMED").length,
      },
    }, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Business search unavailable.";
    return Response.json({ ok: false, error: message }, { status: 500, headers });
  }
}
