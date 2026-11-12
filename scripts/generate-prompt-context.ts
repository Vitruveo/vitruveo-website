/**
 * Generate prompt context from site pages
 *
 * This script reads all site pages, PSC constants, and MCP tools
 * to generate a context file for the AI system prompt.
 *
 * Run: pnpm tsx scripts/generate-prompt-context.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = path.resolve(__dirname, '..');
const SITE_DIR = path.join(ROOT_DIR, 'app/(site)');
const OUTPUT_FILE = path.join(ROOT_DIR, 'lib/ai/generated-context.json');

interface PageInfo {
  path: string;
  title: string;
  description: string;
}

interface PSCInfo {
  name: string;
  slug: string;
  address: string;
  description: string;
  gas: string;
}

interface PromptContext {
  generatedAt: string;
  pages: PageInfo[];
  pscs: PSCInfo[];
  mcpTools: string[];
  network: {
    chainId: number;
    name: string;
    rpc: string;
    explorer: string;
    bridge: string;
    blockTime: number;
    gasPrice: number;
  };
}

// Extract metadata from page file content
function extractMetadata(content: string): { title: string; description: string } {
  // Match export const metadata = { ... }
  const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*\{([^}]+)\}/s);

  if (!metadataMatch) {
    return { title: '', description: '' };
  }

  const metadataBlock = metadataMatch[1];

  // Extract title
  const titleMatch = metadataBlock.match(/title:\s*['"`]([^'"`]+)['"`]/);
  const title = titleMatch ? titleMatch[1] : '';

  // Extract description - handle escaped quotes
  const descMatch = metadataBlock.match(/description:\s*['"`]((?:[^'"`\\]|\\.)*)['"`]/);
  const description = descMatch ? descMatch[1].replace(/\\'/g, "'").replace(/\\"/g, '"') : '';

  return { title, description };
}

// Convert file path to URL path
function filePathToUrlPath(filePath: string): string {
  // Remove the site dir prefix and page.jsx suffix
  let urlPath = filePath
    .replace(SITE_DIR, '')
    .replace(/\/page\.(jsx|tsx)$/, '')
    .replace(/^\/?/, '/');

  // Root page
  if (urlPath === '/') return '/';

  return urlPath;
}

// Get all page files recursively
function getPageFiles(dir: string): string[] {
  const files: string[] = [];

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      files.push(...getPageFiles(fullPath));
    } else if (item.name === 'page.jsx' || item.name === 'page.tsx') {
      files.push(fullPath);
    }
  }

  return files;
}

// Extract PSC list from developers page
function extractPSCList(): PSCInfo[] {
  const developersPage = path.join(SITE_DIR, 'developers/page.jsx');
  const content = fs.readFileSync(developersPage, 'utf-8');

  // Match the pscList array
  const pscListMatch = content.match(/const\s+pscList\s*=\s*\[([\s\S]*?)\];/);

  if (!pscListMatch) {
    console.warn('Could not find pscList in developers page');
    return [];
  }

  const pscs: PSCInfo[] = [];

  // Match each PSC object, then read its fields independently of order
  const objectRegex = /\{([^{}]*)\}/g;
  const field = (body: string, key: string) => {
    const m = body.match(new RegExp(`${key}:\\s*['"]([^'"]+)['"]`));
    return m ? m[1] : '';
  };

  let match;
  while ((match = objectRegex.exec(pscListMatch[1])) !== null) {
    const body = match[1];
    const addressMatch = body.match(/address:\s*PSC_ADDRESSES\.(\w+)/);
    const name = field(body, 'name');
    const slug = field(body, 'slug');
    if (!name || !slug || !addressMatch) continue;
    pscs.push({
      name,
      slug,
      address: addressMatch[1], // We'll resolve this later
      description: field(body, 'description'),
      gas: field(body, 'gas'),
    });
  }

  // Read PSC addresses
  const pscConstantsPath = path.join(ROOT_DIR, 'vitruveo/lib/psc-constants.js');
  const pscConstants = fs.readFileSync(pscConstantsPath, 'utf-8');

  // Extract addresses
  const addressMap: Record<string, string> = {};
  const addressRegex = /(\w+):\s*['"]([^'"]+)['"]/g;
  let addrMatch;
  while ((addrMatch = addressRegex.exec(pscConstants)) !== null) {
    addressMap[addrMatch[1]] = addrMatch[2];
  }

  // Resolve addresses
  for (const psc of pscs) {
    psc.address = addressMap[psc.address] || psc.address;
  }

  return pscs;
}

// Extract MCP tools from tools.ts
function extractMCPTools(): string[] {
  const toolsPath = path.join(ROOT_DIR, 'lib/mcp/tools.ts');
  const content = fs.readFileSync(toolsPath, 'utf-8');

  const tools: string[] = [];

  // Match server.tool("tool_name", ...)
  const toolRegex = /server\.tool\(\s*["']([^"']+)["']/g;

  let match;
  while ((match = toolRegex.exec(content)) !== null) {
    tools.push(match[1]);
  }

  return tools;
}

// Main function
async function main() {
  console.log('Generating prompt context...');

  // Get all page files
  const pageFiles = getPageFiles(SITE_DIR);

  // Extract page info
  const pages: PageInfo[] = [];

  for (const filePath of pageFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const urlPath = filePathToUrlPath(filePath);
    const { title, description } = extractMetadata(content);

    // Skip redirect pages (like /developers/psc)
    if (content.includes("redirect(")) {
      console.log(`  Skipping redirect: ${urlPath}`);
      continue;
    }

    // Skip pages without metadata
    if (!title && !description) {
      console.log(`  Skipping (no metadata): ${urlPath}`);
      continue;
    }

    pages.push({
      path: urlPath,
      title: title.replace(' - Vitruveo', ''),
      description,
    });

    console.log(`  Found: ${urlPath} - ${title}`);
  }

  // Sort pages by path
  pages.sort((a, b) => {
    // Root first
    if (a.path === '/') return -1;
    if (b.path === '/') return 1;
    return a.path.localeCompare(b.path);
  });

  // Extract PSCs
  const pscs = extractPSCList();
  console.log(`  Found ${pscs.length} PSCs`);

  // Extract MCP tools
  const mcpTools = extractMCPTools();
  console.log(`  Found ${mcpTools.length} MCP tools`);

  // Build context
  const context: PromptContext = {
    generatedAt: new Date().toISOString(),
    pages,
    pscs,
    mcpTools,
    network: {
      chainId: 1490,
      name: 'Vitruveo',
      rpc: 'https://rpc.vitruveo.ai',
      explorer: 'https://explorer.vitruveo.ai',
      bridge: 'https://bridge.vitruveo.ai',
      blockTime: 5,
      gasPrice: 4,
    },
  };

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(context, null, 2));
  console.log(`\nWritten to: ${OUTPUT_FILE}`);
}

main().catch(console.error);
