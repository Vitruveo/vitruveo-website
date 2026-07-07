# Vitruveo Website & AI Chat

## Project Goals

### Primary Goals
1. **Marketing Website** - Clean, modern site explaining Vitruveo's value proposition
2. **AI Chat Assistant** - Gemini-powered chat that answers questions about Vitruveo, PSCs, and building on-chain
3. **Developer Documentation** - Interactive documentation for all 12 Protocol Smart Contracts
4. **Vitruveo Starter Kit** - The `/vitruveo` folder is designed to be extracted as a standalone, dependency-free starter kit for developers

### The Vitruveo Folder (Starter Kit)

The `/vitruveo` folder is **intentionally kept dependency-free** from the rest of the project. It contains:

```
vitruveo/
├── index.js                    # Main exports
├── lib/
│   ├── index.js
│   └── psc-constants.js        # All PSC addresses and gas costs
└── components/
    ├── index.js
    ├── rng/
    │   ├── index.js
    │   ├── rng-info.jsx        # Documentation/explanation
    │   └── rng-example.jsx     # Code examples + Try It section
    ├── shuffle/
    ├── host/
    ├── trend/
    ├── compound-interest/
    ├── passkey/
    ├── merkle-proof/
    ├── ibc/
    ├── batch-balance/
    ├── batch-balance-native/
    ├── batch-send-erc20/
    └── batch-send-native/
```

**Each PSC component has:**
- `*-info.jsx` - What it does, why it matters, interface documentation
- `*-example.jsx` - Solidity code examples and a "Try It" section

**IMPORTANT:** All imports in `/vitruveo` use relative paths (`../../lib/psc-constants`) to stay self-contained. Do NOT add imports from `@/` or other project paths.

---

## What Has Been Achieved

### Site Pages (Complete)
- **Home** (`/`) - Hero with video, feature highlights, ecosystem preview
- **About** (`/about`) - Detailed explanation of Vitruveo's technology
- **Ecosystem** (`/ecosystem`) - Featured app (Pretrend) and infrastructure
- **Developers** (`/developers`) - PSC overview, MCP documentation, quick start guide
- **PSC Detail Pages** (`/developers/psc/[slug]`) - Individual pages for each of 12 PSCs
- **HOST Primer** (`/host-primer`) - Deep-dive documentation for HOST protocol
- **Chat** (`/chat`) - AI assistant powered by Gemini

### AI Chat Features
- Gemini model integration via Vercel AI SDK
- MCP (Model Context Protocol) server at `/mcp` with 17 blockchain tools
- System prompt auto-generated from site content (`scripts/generate-prompt-context.ts`)
- Chat history persisted to localStorage
- Footer chat input on site pages that navigates to `/chat?q=` and auto-submits
- Purple-pink gradient user message bubbles
- Clear chat button in input toolbar

### Technical Infrastructure
- Next.js 15 with App Router
- Route groups: `(site)` for marketing pages, `(chat)` for AI chat
- Tailwind CSS + Bootstrap hybrid styling
- Pre-build script generates AI context from site content
- MCP server for AI agent blockchain interactions


## Key Files Reference

### Site Structure
- `/app/(site)/` - Marketing pages
- `/app/(chat)/` - AI chat application
- `/components/site/` - Site-specific components (header, footer, etc.)
- `/components/` - Shared/chat components

### AI Chat
- `/app/(chat)/api/chat/route.ts` - Chat API endpoint
- `/lib/ai/prompts.ts` - System prompt (uses generated context)
- `/lib/ai/generated-context.json` - Auto-generated site content for AI
- `/scripts/generate-prompt-context.ts` - Prebuild script for AI context
- `/app/mcp/route.js` - MCP server endpoint
- `/lib/mcp/tools.ts` - MCP tool definitions

### Vitruveo Starter Kit
- `/vitruveo/lib/psc-constants.js` - All PSC addresses and gas costs
- `/vitruveo/components/*/` - Each PSC's info and example components

### Styling
- `/app/(site)/site.css` - Site-specific styles
- `/app/(chat)/chat-layout.css` - Chat-specific styles
- `/app/globals.css` - Global styles and CSS variables

---

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build (runs generate-context automatically)
pnpm build
```

### Environment Variables
```
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```




