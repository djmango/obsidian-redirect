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

This project uses GitHub Actions for automatic deployment to Cloudflare Workers.

### Initial Setup

1. **Create a Cloudflare API Token**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
   - Click "Create Token"
   - Use the "Edit Cloudflare Workers" template
   - Scope it to your account and the specific zone (skg.gg)
   - Copy the token

2. **Add GitHub Secret**:
   - Go to your GitHub repository settings
   - Navigate to Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: Paste your Cloudflare API token

3. **Configure DNS** (if not already set up):
   - In Cloudflare Dashboard → DNS
   - Add an AAAA record:
     - Type: `AAAA`
     - Name: `o`
     - Content: `100::`
     - Proxied: Yes

4. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin git@github.com:yourusername/obsidian-redirect.git
   git push -u origin main
   ```

### Automatic Deployment

Once configured, any push to the `main` or `master` branch will automatically deploy to Cloudflare Workers via GitHub Actions.

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
