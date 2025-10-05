# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Prompt Vault is a Chrome extension functioning as a password manager for AI prompts. It stores, organizes, and encrypts various prompt types (system prompts, context prompts, message prompts, persona/actor prompts) for use with AI services like ChatGPT, Claude, Gemini, and Grok.

**Business Model**: Freemium
- **Free**: 50 prompts, 5 folders, no sync
- **Pro ($4.99/month)**: Unlimited prompts/folders, cross-device sync, advanced statistics, priority support

**Tech Stack**:
- Frontend: React 19 + TypeScript + Vite + @crxjs/vite-plugin + React Router
- Backend: Supabase (Auth, Database, Edge Functions)
- UI: TailwindCSS + shadcn/ui
- Security: End-to-end encryption (zero-knowledge architecture)

## Build Commands

- `npm run dev` - Start development server with hot reload (requires `host_permissions` for localhost in manifest.json)
- `npm run build` - Type-check with TypeScript and build the extension for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build

## Architecture

### Extension Structure

The extension follows Chrome MV3 architecture with three main components:

1. **Popup.js** (`index.html` -> `src/main.tsx` -> `src/App.tsx`): Main UI with sidebar (all prompts, favorites, folders) and prompt list with search
2. **Content.js**: Injected into AI service pages (ChatGPT, Claude, Gemini, Grok) to detect sites and provide quick-access panel for recent prompts with one-click paste
3. **Background Service Worker** (`src/background.ts`): Handles extension lifecycle, sync, and communication between components

### Key Features to Implement

**Prompt Management**:
- Create/edit/delete prompts with: title, description, content, tags, folder assignment
- Variable system: auto-detect `{{variable_name}}` format, dynamic fill-in form before pasting
- Favorites marking for quick access
- Search by title, content, tags
- Organize with folders/subfolders (unlimited in Pro, 5 in Free)

**AI Service Integration** (Content.js):
- Detect active AI service (ChatGPT/Claude/Gemini/Grok)
- Quick access panel with keyboard shortcut (Alt+P)
- Display recent prompts for current platform
- One-click paste with/without variable filling

**Account & Settings** (Options.js):
- Login/register/password reset views
- Profile management, password change
- Subscription/payment handling
- Import/Export prompts
- Preferences: keyboard shortcuts, appearance (light/dark), date format
- Security: auto-logout, backups (Pro)

**Security**:
- End-to-end encryption of all prompts (encrypt locally before sending to Supabase)
- Zero-knowledge architecture (server never sees decrypted data)
- Only encrypt sensitive data (prompts, user data requiring security)

### Planned Tech Integration

- **React Router**: Navigation between Popup views and Options page
- **Supabase**:
  - Auth: User registration/login
  - Database: Encrypted prompts, folders, user settings
  - Edge Functions: If needed for server-side operations
- **TailwindCSS + shadcn/ui**: Component library for consistent UI

### Configuration Files

- `manifest.json`: Chrome extension manifest (V3) - defines permissions (`storage`, `activeTab`, `host_permissions` for localhost dev), icons, popup, background service worker
- `vite.config.ts`: Configures Vite with React and CRX plugins
- `tsconfig.app.json`: TypeScript config for app code (includes Chrome types)
- `tsconfig.node.json`: TypeScript config for build tooling
- `eslint.config.js`: ESLint flat config with React hooks and TypeScript rules

### Development Philosophy

- Write code as a senior lead React developer with Chrome extension and security expertise
- Keep solutions straightforward and aligned with project assumptions
- Avoid overcomplication - "good code reads itself"
- No git commits or automated tests - manual testing by developer
- Collaborate and ask for information when needed to fix issues

### Development Notes

- The extension requires icons in `icons/` directory (16px, 32px, 48px, 128px)
- TypeScript is configured with strict mode and bundler module resolution
- Chrome APIs are available via the global `chrome` object (typed via `@types/chrome`)
- HMR works during development - changes to React components reload instantly in the extension popup
- For dev mode, `host_permissions` includes `http://localhost:*/*` to allow Vite dev server connection
