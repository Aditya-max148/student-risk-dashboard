export async function POST(req: Request) {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    if (!base) {
      return new Response(
        JSON.stringify({
          error: "Missing NEXT_PUBLIC_API_BASE_URL",
          hint:
            "Set NEXT_PUBLIC_API_BASE_URL to your backend base URL (e.g., https://your-backend.onrender.com). " +
            "Make sure it is HTTPS if your site is on HTTPS.",
        }),
        { status: 500, headers: { "content-type": "application/json" } },
      )
    }

    // Basic sanity check to help avoid mixed-content issues
    const isHttp = /^http:\/\//i.test(base)
    const target = `${base.replace(/\/$/, "")}/api/upload`

    // Read incoming multipart form-data
    const formData = await req.formData()

    // Timeout handling for backend fetch
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000) // 25s
    try {
      console.log("[v0] Upload proxy target:", target)
      const resp = await fetch(target, {
        method: "POST",
        body: formData,
        signal: controller.signal,
        redirect: "follow",
      })
      clearTimeout(timeout)

      const contentType = resp.headers.get("content-type") || "application/json"
      const text = await resp.text()
      if (!resp.ok) {
        console.log("[v0] Upload proxy backend error:", resp.status, text)
        return new Response(
          JSON.stringify({
            error: "Backend returned error",
            status: resp.status,
            target,
            details: contentType.includes("application/json")
              ? (() => {
                  try {
                    return JSON.parse(text)
                  } catch {
                    return text
                  }
                })()
              : text,
          }),
          { status: 502, headers: { "content-type": "application/json" } },
        )
      }
      return new Response(text, { status: resp.status, headers: { "content-type": contentType } })
    } catch (err: any) {
      clearTimeout(timeout)
      console.log("[v0] Upload proxy fetch failure:", err?.message)
      return new Response(
        JSON.stringify({
          error: "Proxy to backend failed",
          message: err?.name === "AbortError" ? "Request to backend timed out" : err?.message || "Unknown error",
          target,
          hint: isHttp
            ? "Your backend URL is HTTP. If your site is on HTTPS, switch backend to HTTPS to avoid mixed-content/network issues."
            : "Verify the backend is running and publicly reachable. Try hitting {base}/api/health directly.",
        }),
        { status: 502, headers: { "content-type": "application/json" } },
      )
    }
  } catch (err: any) {
    console.log("[v0] Upload proxy outer failure:", err?.message)
    return new Response(
      JSON.stringify({
        error: "Proxy to backend failed",
        message: err?.message || "Unknown error",
      }),
      { status: 502, headers: { "content-type": "application/json" } },
    )
  }
}
