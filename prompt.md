# PhotoBox Web Application - Complete Project Prompt

## LLM Persona

You are a Senior Full-Stack Developer with 8+ years of experience specializing in:
- **Technical Domain:** React 18+ with TypeScript, Next.js 14+ App Router, shadcn/ui component library, Tailwind CSS, modern web APIs (Camera API), and RESTful API integration
- **Architecture:** Component-based architecture with clean separation of concerns, API service layers, and modern frontend patterns
- **Best Practices:** Follow KISS, DRY, and SOLID principles. Write clean, maintainable code with proper TypeScript typing throughout
- **Decision-Making Style:** Prefer proven technologies over experimental ones, explicit code over clever abstractions, and built-in solutions over adding dependencies

**Working Style:** Keep working until you have fulfilled your task. After implementing each major component, review your solution and identify any issues or areas that need clarification before proceeding to the next step.

---

## Project Overview

Build a modern PhotoBox web application that allows users to capture photos from their device camera (PC or mobile) and transform them using AI-powered style transfers with preset suggestions (like 'BBQ Party', 'Van Gogh Style') and custom free-text prompts.

**Current Stage:** Initial local development prototype (no deployment or persistence needed yet)

---

## Technical Stack

- Next.js 16 with TypeScript
- shadcn/ui components
- Tailwind CSS v4
- App Router architecture
- Browser Camera API

---

## Feature Requirements

### 1. Camera Capture
- Device camera access using `navigator.mediaDevices.getUserMedia()` API
  - Support both desktop webcams and mobile cameras
  - Use modern best practices for camera resolution and constraints
  - Handle permission requests gracefully
  - Provide clear feedback if camera access is denied
- Live camera preview before capture
- Capture button with clear visual indication
- Retake capability
- File upload fallback option for devices without camera access
- Image optimization: resize/compress if needed before sending to API (consider max 2MB file size)

### 2. Style Selection
- Preset style buttons with user-friendly labels (5-7 creative options including):
  - BBQ Party
  - Van Gogh Style
  - [Add 3-5 more creative and diverse style options]
- **Important:** Each preset should map to a clear, concise prompt for image editing
  - Display simple label to user (e.g., "BBQ Party")
  - Send clear editing instruction to API (e.g., "Add BBQ party elements and warm summer lighting to the background")
- Custom free-text input field for advanced users who want to write their own detailed prompts
- Clean, minimal layout using shadcn/ui components

### 3. AI Image Processing
- Send image + style/prompt to TNG backend endpoint via multipart/form-data
- Display engaging loading state during processing (image transformations may take 10-30 seconds)
- Show transformed image on success with smooth transition
- Handle errors gracefully with user-friendly messages:
  - Network failures: "Unable to connect to image service. Please check your connection."
  - API errors: Display helpful error message and option to retry
  - Timeout handling: Set reasonable timeout (60s) and inform user if exceeded

### 4. User Flow
1. Landing → Clear instructions on how to use the app
2. Capture photo using device camera (or upload option as fallback)
3. Preview captured image with option to retake
4. Select preset style or enter custom prompt
5. Confirm and trigger AI transformation
6. Display loading state with progress indicator
7. Show transformed image with option to download
8. Provide clear option to start over with new photo

---

## Constraints

**Technology:**
- Use only shadcn/ui and Tailwind CSS (no additional dependencies without approval)
- TypeScript with proper type safety throughout
- Modern browser compatibility (Chrome, Safari, Firefox, Edge)

**UX/Design:**
- Modern, clean, minimal UI with excellent UX practices
- Fully responsive (mobile, tablet, desktop)
- Clear visual feedback for all actions (loading, error, success states)
- Accessibility best practices (ARIA labels, keyboard navigation)
- Use neutral, professional color scheme with good contrast

**Code Quality:**
- TypeScript interfaces for all data structures
- Proper error boundaries
- Dedicated API service layer
- Inline comments only for complex business logic

---

## Implementation Approach

### 1. Project Scaffolding
Use Next.js CLI to create the base project:

**⚠️ IMPORTANT: Use CLI flags to avoid interactive prompts**
```bash
npx create-next-app@latest [project-name] --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --use-npm --webpack --yes
```

**CLI Flags Explained:**
- `--typescript` - Initialize as TypeScript project
- `--tailwind` - Initialize with Tailwind CSS
- `--app` - Use App Router (not Pages Router)
- `--eslint` - Initialize with ESLint
- `--src-dir` - Create `src/` directory
- `--import-alias "@/*"` - Set import alias
- `--use-npm` - Use npm (not pnpm/yarn/bun)
- `--webpack` - Use Webpack bundler (not Turbopack)
- `--yes` - Skip remaining interactive prompts with defaults

**Note:** Next.js 16+ will ask about React Compiler and Turbopack. The `--yes --webpack` flags handle these automatically.

### 2. Install Dependencies
```bash
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install -D tailwindcss-animate autoprefixer
```

### 3. Setup shadcn/ui
Initialize shadcn/ui configuration:

**⚠️ IMPORTANT: Use --defaults flag to avoid interactive prompts**
```bash
npx shadcn@latest init --defaults
```

Then install required components:
```bash
npx shadcn@latest add button card input alert --yes
```

**Note:** The `--defaults` flag uses default configuration (Neutral color, CSS variables, etc.). The `--yes` flag on add commands skips confirmation prompts.

### 4. Implementation Steps
1. Create type definitions in `src/types/index.ts`
2. Create API service layer for Qwen model in `src/services/image-api.ts`
3. Create style presets configuration in `src/config/styles.ts`
4. Build UI components:
   - CameraCapture component with live preview
   - ImagePreview component
   - StyleSelection component with preset-to-prompt mapping
   - LoadingState component with animations
   - TransformationResult component
5. Implement main page with complete user flow in `src/app/page.tsx`
6. Add comprehensive error handling and loading states
7. Ensure mobile responsiveness and test on various devices
8. Create environment configuration files (.env.example, .env.local)
9. **Verify build:** Run `npm run build` to catch any TypeScript errors or configuration issues before considering the project complete

### 5. Important Technical Notes
- **Tailwind CSS v4:** Next.js 16 ships with Tailwind v4, which uses `@tailwindcss/postcss` plugin
  - The `postcss.config.mjs` will have `@tailwindcss/postcss` only (no separate autoprefixer needed)
  - This is the correct configuration - don't modify it
- Use SVG for favicon (`src/app/icon.svg`) instead of ICO format
- Next.js 16 uses React 19 - fully compatible with shadcn/ui
- `.env.local` is gitignored and may not be writable by automation - this is expected behavior
- **Camera Stream Timing:** Be mindful of React's render cycle when attaching media streams to video elements, especially if the video element is conditionally rendered. Consider using React lifecycle methods to ensure refs are available before accessing them.

---

## API Integration Details

**Endpoint:**
- Base URL: `https://image.model.tngtech.com/api/v1`
- Full endpoint: `https://image.model.tngtech.com/api/v1/images/edits`
- Method: POST
- OpenAI-compatible API

**Model:** `Qwen/Qwen-Image-Edit` - Specialized image editing model

**Request Format:** `multipart/form-data`

**Required fields:**
- `image` (binary file) - The image to edit
- `prompt` (string) - Clear editing instruction (e.g., "Add BBQ party elements to the background")
- `model` (string) - Must be "Qwen/Qwen-Image-Edit"
- `response_format` (string) - Use "b64_json" to receive base64-encoded image

**Response Format:** OpenAI-compatible JSON response with base64-encoded image data

**Example (Python):**
```python
import openai

openai.base_url = "https://image.model.tngtech.com/api/v1/"
openai.api_key = os.environ['TOKEN']

response = openai.images.edit(
    prompt="Add a moustache to the face",
    model="Qwen/Qwen-Image-Edit",
    image=open("photo.jpg", "rb"),
    response_format="b64_json"
)
```

**Authentication:** Bearer token in request headers
- Header format: `Authorization: Bearer <tng_token>`
- Token must be stored in environment variables (`.env.local`)
- Use placeholder token initially: `NEXT_PUBLIC_TNG_API_TOKEN=your_token_here`
- Create `.env.example` with placeholder for documentation
- Add `.env.local` to `.gitignore` (should be done automatically by create-next-app)
- **Important:** Once the application is ready for testing, ask the user to provide the actual TNG API token to replace the placeholder

---

## Deliverables

1. Fully functional Next.js application with complete user flow
2. Clean, maintainable TypeScript codebase with proper type definitions
3. Responsive UI working on all devices (mobile-first approach)
4. Environment configuration files:
   - `.env.example` with `NEXT_PUBLIC_TNG_API_TOKEN=your_token_here`
   - `.env.local` with the same placeholder (gitignored)
5. **Single documentation file:**
   - `README.md` ONLY - Comprehensive documentation including:
     - Project overview and features
     - Quick start / setup instructions
     - Usage guide
     - API integration details
     - Troubleshooting section
   - **DO NOT create:** SETUP.md, IMPLEMENTATION_NOTES.md, PROJECT_SUMMARY.md, or any other documentation files
6. Proper PostCSS configuration:
   - `postcss.config.mjs` with appropriate plugins (Tailwind v4 uses `@tailwindcss/postcss` only)
7. Icon/favicon:
   - `src/app/icon.svg` for the application favicon

## Common Pitfalls to Avoid

1. **DO use CLI flags** - Always use `--yes --webpack` and other flags to avoid interactive prompts in create-next-app
2. **DO use --defaults** - Use `npx shadcn@latest init --defaults` to skip shadcn interactive setup
3. **DO use SVG for favicon** - `src/app/icon.svg` not ICO format (Next.js metadata format)
4. **DO use create-next-app** - For scaffolding to ensure proper Next.js setup
5. **DO clean up camera streams** - Call `stream.getTracks().forEach(track => track.stop())` when unmounting
6. **DO compress images** - Before sending to API (max 2MB recommended)
7. **DO handle base64 response** - Qwen model returns `b64_json` format, not URL
8. **DO set proper timeout** - 60 seconds for API requests (transformations take 10-30 seconds)
9. **DO NOT try to write .env.local via automation** - It's gitignored and may be blocked; create .env.example instead
10. **DO handle React refs carefully** - When working with refs to DOM elements that are conditionally rendered, ensure the element exists before trying to access or modify it. React lifecycle methods can help synchronize state changes with DOM availability.

---

**After implementation is complete and ready for testing:** Ask the user to provide the actual TNG API token to replace the placeholder in `.env.local`.

