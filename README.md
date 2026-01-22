# Secret Cloud Storage

A secure, personal cloud storage solution built with Cloudflare Workers and R2. Designed for easy file transfer between devices without the hassle of VPNs or tunnels.

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
- **Backend**: Cloudflare Workers with TypeScript
- **Storage**: Cloudflare R2
- **Package Manager**: Bun
- **Security**: Cloudflare Access

### Project Structure

```
secret-cloud-storage/
├── src/
│   ├── index.ts              # Main Worker entry point
│   ├── types/
│   │   ├── environment.ts    # Environment bindings
│   │   └── file.ts           # File metadata types
│   ├── utils/
│   │   ├── file.ts           # Checksum & metadata utilities
│   │   └── response.ts       # HTTP response helpers
│   └── handlers/
│       ├── upload.ts         # File upload with duplicate detection
│       ├── list.ts           # File listing
│       ├── download.ts       # File download
│       └── delete.ts         # File deletion
├── public/
│   ├── index.html            # Main UI
│   ├── css/
│   │   └── styles.css        # Premium dark theme styles
│   └── js/
│       ├── app.ts            # Frontend TypeScript
│       └── app.js            # Compiled JavaScript
└── wrangler.toml             # Cloudflare Workers configuration
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
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) for Cloudflare Workers
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

- `bun run build:frontend` - Compile TypeScript frontend to JavaScript
- `bun run dev` - Build frontend and start local development server
- `bun run deploy` - Build and deploy to Cloudflare Workers
- `bun run typecheck` - Run TypeScript type checking

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
   bunx wrangler login
   ```

2. **Deploy**:
   ```bash
   bun run deploy
   ```

3. **Configure Cloudflare Access**:
   - Go to Cloudflare Dashboard → Zero Trust → Access
   - Create an application for your Worker URL
   - Configure authentication (email, Google, etc.)

## Security

- **Cloudflare Access**: All requests are protected by Cloudflare Access
- **No User Management**: Designed for single-user use
- **SHA-256 Checksums**: Verify file integrity
- **CORS**: Configured for secure cross-origin requests

## Code Quality

The codebase follows best practices:

- **Separation of Concerns**: Clear separation between handlers, utilities, and types
- **DRY**: No code duplication
- **KISS**: Simple, straightforward implementations
- **High Cohesion, Low Coupling**: Each module has a single responsibility
- **Strict TypeScript**: Full type safety throughout

## License

MIT

## Author

Built with Cloudflare Workers, R2, and modern web technologies.
