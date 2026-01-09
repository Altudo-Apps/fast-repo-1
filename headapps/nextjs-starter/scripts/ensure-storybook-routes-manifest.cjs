const fs = require('fs');
const path = require('path');

// Ensure Vercel's Next.js deploy hook finds a routes-manifest, even though
// Storybook is a static export. Vercel looks for this file when the project
// is classified as Next.js. Creating a minimal manifest unblocks deploys.
const outputDir = path.resolve(__dirname, '../storybook-static');
const manifestPath = path.join(outputDir, 'routes-manifest.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (!fs.existsSync(manifestPath)) {
  const manifest = {
    version: 3,
    pages: [],
    dynamicRoutes: [],
    dataRoutes: [],
    preview: {
      previewModeId: 'storybook',
      previewModeSigningKey: 'storybook',
      previewModeEncryptionKey: 'storybook',
    },
    rewrites: { beforeFiles: [], afterFiles: [], fallback: [] },
    headers: [],
    redirects: [],
    rsc: { header: 'RSC', static: [], dynamic: [] },
    ssgNotFound: [],
    ampFirstPages: [],
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

