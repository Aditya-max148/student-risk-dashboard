export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    if (!base) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Missing NEXT_PUBLIC_API_BASE_URL",
          hint: "Set NEXT_PUBLIC_API_BASE_URL to your backend base URL (e.g., https://your-backend.onrender.com)",
        }),
        { status: 500, headers: { "content-type": "application/json" } },
      )
    }
    const target = `${base.replace(/\/$/, "")}/api/health`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    try {
      const r = await fetch(target, { signal: controller.signal })
      clearTimeout(timeout)
      const text = await r.text()
      return new Response(
        JSON.stringify({
          ok: r.ok,
          status: r.status,
          target,
          body: (() => {
            try {
              return JSON.parse(text)
            } catch {
              return text
            }
          })(),
        }),
        { status: r.ok ? 200 : 502, headers: { "content-type": "application/json" } },
      )
    } catch (e: any) {
      clearTimeout(timeout)
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Health check failed",
          message: e?.name === "AbortError" ? "Timeout contacting backend" : e?.message || "Unknown error",
          target,
        }),
        { status: 502, headers: { "content-type": "application/json" } },
      )
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || "Unknown error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }
}
