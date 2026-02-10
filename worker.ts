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
  <style>body{line-height:1.5;font-size:18px;padding:0 10px;margin:50px auto;max-width:650px;text-align:center}</style>
</head>
<body>
  <p>Opening in Obsidian...</p>
  <p>You can close this tab</p>
  <script>
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
