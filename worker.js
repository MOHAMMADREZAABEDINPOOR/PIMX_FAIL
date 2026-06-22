export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/api/visits' && request.method === 'POST') {
      // Record a new visit
      try {
        const visitData = await request.json();
        visitData.timestamp = new Date().toISOString();
        
        // Get client IP
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        visitData.ip = clientIP;
        
        // Get approximate location from Cloudflare headers
        const country = request.cf?.country || 'unknown';
        const city = request.cf?.city || 'unknown';
        visitData.location = `${city}, ${country}`;
        
        // Get user agent info
        const userAgent = request.headers.get('user-agent') || 'unknown';
        visitData.userAgent = userAgent;
        visitData.device = getDeviceType(userAgent);
        visitData.browser = getBrowser(userAgent);
        visitData.os = getOS(userAgent);
        
        // Store in KV
        const visitId = `visit:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
        await env.VISIT_KV.put(visitId, JSON.stringify(visitData));
        
        // Also add to a list of recent visits (for the admin panel)
        let recentVisits = await env.VISIT_KV.get('recent_visits', { type: 'json' }) || [];
        recentVisits.unshift(visitData);
        // Keep only the last 1000 visits
        recentVisits = recentVisits.slice(0, 1000);
        await env.VISIT_KV.put('recent_visits', JSON.stringify(recentVisits));
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else if (path === '/api/visits' && request.method === 'GET') {
      // Get all recent visits
      try {
        const recentVisits = await env.VISIT_KV.get('recent_visits', { type: 'json' }) || [];
        return new Response(JSON.stringify(recentVisits), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Default: return 404
    return new Response('Not Found', { status: 404 });
  }
};

function getDeviceType(userAgent) {
  if (/Mobile|Android|iPhone|iPad|iPod/.test(userAgent)) {
    return 'Mobile';
  } else if (/Tablet/.test(userAgent)) {
    return 'Tablet';
  } else {
    return 'Desktop';
  }
}

function getBrowser(userAgent) {
  if (/Firefox/.test(userAgent)) return 'Firefox';
  if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) return 'Safari';
  if (/Chrome/.test(userAgent)) return 'Chrome';
  if (/Edge/.test(userAgent)) return 'Edge';
  if (/Opera/.test(userAgent)) return 'Opera';
  return 'Unknown';
}

function getOS(userAgent) {
  if (/Windows/.test(userAgent)) return 'Windows';
  if (/Mac/.test(userAgent)) return 'macOS';
  if (/Linux/.test(userAgent)) return 'Linux';
  if (/Android/.test(userAgent)) return 'Android';
  if (/iOS|iPhone|iPad/.test(userAgent)) return 'iOS';
  return 'Unknown';
}
