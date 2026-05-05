export async function GET() {
  try {
    await fetch('https://orders-rest-api-python.onrender.com/api/v1/health')
    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false })
  }
}
