# Deployment Guide

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Enable R2**: Enable R2 in your Cloudflare account
3. **Create R2 Bucket**: Create a bucket named `secret-cloud-storage` (or update `wrangler.toml`)

## Steps

### 1. Login to Cloudflare

```bash
bunx wrangler login
```

This will open a browser window for you to authenticate.

### 2. Verify Configuration

Ensure your `wrangler.toml` has the correct bucket name:

```toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "secret-cloud-storage"  # Change if needed
```

### 3. Build Frontend

```bash
bun run build
```

This copies static assets and compiles TypeScript to the `public/` directory.

### 4. Test Deployment (Dry Run)

```bash
bunx wrangler pages deploy public --dry-run
```

This verifies your configuration without actually deploying.

### 5. Deploy to Production

```bash
bun run deploy
```

Or manually:

```bash
bunx wrangler pages deploy public
```

Wrangler will output your Pages URL, e.g., `https://secret-cloud-storage.pages.dev`

### 6. Configure Cloudflare Access

To secure your cloud storage:

1. Go to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. Navigate to **Access** → **Applications**
3. Click **Add an application**
4. Select **Self-hosted**
5. Configure:
   - **Application name**: Secret Cloud Storage
   - **Application domain**: Your Pages URL
   - **Session duration**: As desired
6. Add an **Access Policy**:
   - **Policy name**: Personal Access
   - **Action**: Allow
   - **Configure rules**: 
     - Include → Email → Your email address
     - Or use Google/GitHub/Microsoft login
7. Save the application

Now only you can access the storage through Cloudflare Access authentication!

## Local Development

To test locally:

```bash
bun run dev
```

This will start a local Cloudflare Pages development server at `http://localhost:8788`

**Note**: R2 bucket access requires authentication even in local dev mode.

## Updating

To update your deployment:

1. Make your changes in `src/frontend/` or `functions/`
2. Build: `bun run build`
3. Deploy: `bun run deploy`

## Architecture Notes

This project uses **Cloudflare Pages** for a fullstack application:

- **Source**: `src/frontend/` contains frontend source (HTML, CSS, TypeScript)
- **Build Output**: `public/` is generated from source (gitignored)
- **Backend**: `functions/` directory with file-based routing
  - `functions/api/*` - API route handlers (thin routing layer)
  - `functions/_lib/*` - Shared business logic (underscore prefix = not routed)
- **Storage**: R2 bucket binding

Pages Functions automatically:
- Serve static assets from `public/` (build output)
- Route API requests based on `functions/` file structure
- Ignore `_` prefixed folders (for shared code only)
- Handle both frontend and backend in a single deployment

## Troubleshooting

### R2 Bucket Not Found

Ensure:
- The bucket exists in your Cloudflare account
- The name in `wrangler.toml` matches exactly
- You have R2 enabled in your account

### Authentication Errors

- Run `bunx wrangler login` again
- Check your Cloudflare API token has proper permissions

### Build Errors

- Run `bun install` to ensure dependencies are installed
- Clear build cache: `rm -rf .wrangler`

## Monitoring

View your Worker logs and analytics in the Cloudflare Dashboard:

1. Go to **Workers & Pages**
2. Select your `secret-cloud-storage` worker
3. View **Metrics** and **Logs**

## Cost Considerations

- **Workers**: 100,000 requests/day on free tier
- **R2**: 
  - Storage: $0.015/GB/month
  - Class A operations (write): $4.50/million
  - Class B operations (read): $0.36/million
  - **No egress fees** 🎉

Since this is for personal use, costs should be minimal or free within Cloudflare's generous limits.
