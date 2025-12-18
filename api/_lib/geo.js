export function resolveGeo(req) {
  return {
    country: req.headers["x-vercel-ip-country"] || null,
    region: req.headers["x-vercel-ip-country-region"] || null,
    city: req.headers["x-vercel-ip-city"] || null
  };
}
