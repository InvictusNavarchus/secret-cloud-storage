# Secret Cloud Storage

A secure, personal cloud storage solution built with Cloudflare Pages and R2. Designed for easy file transfer between devices without the hassle of VPNs or tunnels.

## Features

- **🔒 Secure**: Protected by Cloudflare Access - no login page needed
- **📦 SHA-256 Checksum**: Automatic duplicate detection via content hashing
- **🎯 Smart Naming**: Automatically appends timestamps to files with duplicate names but different content
- **🎨 Modern UI**: Clean, premium dark theme with smooth animations
- **📱 Responsive**: Works seamlessly on desktop and mobile devices
- **⚡ Fast**: Built on Cloudflare's global network for instant uploads and downloads
- **💾 Reliable**: Uses Cloudflare R2 for durable object storage

## Architecture

### Tech Stack

- **Frontend**: Pure HTML, CSS, TypeScript (no frameworks)
- **Backend**: Cloudflare Pages Functions with TypeScript
- **Storage**: Cloudflare R2
- **Package Manager**: Bun
- **Security**: Cloudflare Access

### Project Structure

```
secret-cloud-storage/
├── src/
│   └── frontend/             # Frontend source files
│       ├── index.html
│       ├── css/
│       │   └── styles.css
│       └── js/
│           └── app.ts
├── functions/                # Backend (Cloudflare Pages Functions)
│   ├── _lib/                 # Shared utilities (not routed)
│   │   ├── handlers/
│   │   │   ├── upload.ts
│   │   │   ├── list.ts
│   │   │   ├── download.ts
│   │   │   └── delete.ts
│   │   ├── types/
│   │   │   ├── environment.ts
│   │   │   └── file.ts
│   │   └── utils/
│   │       ├── file.ts
│   │       └── response.ts
│   └── api/                  # API routes (file-based routing)
│       ├── upload.ts         # POST /api/upload
│       └── files/
│           ├── index.ts      # GET /api/files
│           └── [key].ts      # GET|DELETE /api/files/:key
├── public/                   # Build output (gitignored)
└── wrangler.toml
```

## Core Logic

### Duplicate Detection

1. **By Content**: Calculates SHA-256 checksum of every uploaded file
2. **Exact Match**: If a file with the same checksum exists, upload is rejected with a friendly message
3. **Same Name, Different Content**: Appends ISO timestamp to filename to avoid conflicts
4. **Example**: 
   - Upload `document.pdf` → stored as `document.pdf`
   - Upload different `document.pdf` → stored as `document_2026-01-22T09-48-59-123Z.pdf`

## Development

### Prerequisites

- [Bun](https://bun.sh/) for package management
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) for Cloudflare Pages
- Cloudflare account with R2 enabled

### Setup

1. **Clone and install dependencies**:
   ```bash
   bun install
   ```

2. **Configure R2 bucket**:
   - Ensure you have an R2 bucket named `secret-cloud-storage`
   - Or update `wrangler.toml` with your bucket name

3. **Build frontend**:
   ```bash
   bun run build:frontend
   ```

4. **Run locally**:
   ```bash
   bun run dev
   ```

### Scripts

- `bun run build` - Build frontend (copy assets + compile TypeScript)
- `bun run dev` - Build and start local Cloudflare Pages development server
- `bun run deploy` - Build and deploy to Cloudflare Pages
- `bun run typecheck` - Run TypeScript type checking
- `bun run clean` - Remove build output

## API Endpoints

### Upload File
```
POST /api/upload
Content-Type: multipart/form-data

Body: file (File)
```

**Response**:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "key": "document.pdf",
    "name": "document.pdf",
    "size": 1024,
    "contentType": "application/pdf",
    "uploadedAt": "2026-01-22T09:48:59.123Z",
    "checksum": "abc123..."
  }
}
```

### List Files
```
GET /api/files
```

**Response**:
```json
{
  "files": [...],
  "count": 5
}
```

### Download File
```
GET /api/files/:key
```

Returns the file with appropriate headers.

### Delete File
```
DELETE /api/files/:key
```

**Response**:
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Deployment

1. **Login to Cloudflare**:
   ```bash
   npx wrangler login
   ```

2. **Deploy**:
   ```bash
   bun run deploy
   ```

3. **Configure Cloudflare Access**:
   - Go to Cloudflare Dashboard → Zero Trust → Access
   - Create an application for your Pages URL
   - Configure authentication (email, Google, etc.)

## Security

- **Cloudflare Access**: All requests are protected by Cloudflare Access
- **No User Management**: Designed for single-user use
- **SHA-256 Checksums**: Verify file integrity
- **CORS**: Configured for secure cross-origin requests

## Code Quality

The codebase follows best practices:

- **Separation of Concerns**: Clear separation between Pages Functions, handlers, utilities, and types
- **DRY**: No code duplication
- **KISS**: Simple, straightforward implementations
- **High Cohesion, Low Coupling**: Each module has a single responsibility
- **Strict TypeScript**: Full type safety throughout

## License

MIT

## Author

Built with Cloudflare Workers, R2, and modern web technologies.
