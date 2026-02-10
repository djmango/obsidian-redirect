# Obsidian Redirect Service

A Cloudflare Worker that redirects web URLs to Obsidian vault URIs, making it easy to share deep links to your Obsidian notes.

## Usage

Access your Obsidian notes via URL:

```
https://o.skg.gg/vault/path/to/note
```

This redirects to:

```
obsidian://open?vault=vault&file=path/to/note
```

### Examples

- `https://o.skg.gg/myvault/People/Joe%20Schmoe`
- `https://o.skg.gg/myvault/Journal/2024-01-15`
- `https://o.skg.gg/work/Projects/Meeting%20Notes`

## Deployment

This project uses Cloudflare's built-in GitHub integration for automatic deployments.

### Initial Setup

1. **Configure DNS** (if not already set up):
   - In Cloudflare Dashboard → DNS
   - Add an AAAA record:
     - Type: `AAAA`
     - Name: `o`
     - Content: `100::`
     - Proxied: Yes

2. **Link GitHub Repository**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to Workers & Pages
   - Click "Create Application" → "Pages" → "Connect to Git"
   - Select your GitHub repository
   - Configure build settings:
     - Framework preset: None
     - Build command: (leave empty)
     - Build output directory: (leave empty)
   - Click "Save and Deploy"

### Automatic Deployment

Once configured, any push to your repository will automatically trigger a deployment to Cloudflare Workers.

### Manual Deployment

```bash
bun install
bun run deploy
```

Or with wrangler directly:

```bash
bunx wrangler login
bunx wrangler deploy
```

## Development

Run locally:

```bash
bun install
bun run dev
```

## Security

- No secrets are stored in the repository
- Cloudflare API token is stored as a GitHub secret
- API token has minimal permissions (Workers deployment only)

## License

Apache-2.0
