/**
 * Cloudflare Worker to redirect URLs to Obsidian vault URIs
 *
 * Usage: o.skg.gg/vault/path/to/note
 * Redirects to: obsidian://open?vault=vault&file=path/to/note
 */

export interface Env {}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname.slice(1)); // Remove leading slash and decode

    // Handle root path
    if (!path) {
      return new Response(
        'Obsidian Redirect Service\n\nUsage: o.skg.gg/vault/path/to/note\n\nExample: o.skg.gg/brain/050%20People/John%20Doe',
        {
          status: 400,
          headers: { 'Content-Type': 'text/plain' }
        }
      );
    }

    // Parse path into vault and file
    const parts = path.split('/');
    const vault = parts[0];
    const file = parts.slice(1).join('/');

    // Validate required parts
    if (!vault || !file) {
      return new Response(
        'Invalid path. Usage: o.skg.gg/vault/path/to/note',
        {
          status: 400,
          headers: { 'Content-Type': 'text/plain' }
        }
      );
    }

    // Build Obsidian URI
    const obsidianUrl = `obsidian://open?vault=${encodeURIComponent(vault)}&file=${encodeURIComponent(file)}`;

    // Return HTML that opens Obsidian and tries to close the tab
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Opening Obsidian...</title>
  <style>body{margin:0;background:#000;color:#0f0;font:18px monospace;display:flex;justify-content:center;align-items:center;height:100vh}</style>
</head>
<body>
  <p>Opening in Obsidian...</p>
  <script>
    const c = document.createElement('canvas');
    Object.assign(c.style, {position:'fixed',top:0,left:0,zIndex:-1,opacity:'0.05'});
    c.width = innerWidth; c.height = innerHeight;
    document.body.appendChild(c);
    const ctx = c.getContext('2d');
    const cols = Math.floor(c.width/14);
    const drops = Array(cols).fill(0);
    setInterval(() => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0,0,c.width,c.height);
      ctx.fillStyle = '#0f0';
      ctx.font = '14px monospace';
      drops.forEach((y,i) => {
        ctx.fillText(String.fromCharCode(0x30A0+Math.random()*96), i*14, y*14);
        drops[i] = y > c.height/14 + Math.random()*1e4 ? 0 : y+1;
      });
    }, 50);
    window.location.href = "${obsidianUrl}";
    setTimeout(() => { window.close(); }, 500);
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};
