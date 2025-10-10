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

- Next.js (latest) with TypeScript
- shadcn/ui components
- Tailwind CSS
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
- **Important:** Each preset should map to a comprehensive, well-crafted prompt that follows image editing best practices
  - Display simple label to user (e.g., "BBQ Party")
  - Send detailed, optimized prompt to API (e.g., "Transform this photo into a vibrant outdoor BBQ party scene with warm summer lighting, people socializing, grilled food on plates, and festive decorations, photorealistic style, high detail")
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
- Consider using `guidance_scale` parameter (default 8.0) for consistent results

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

1. Set up Next.js project with TypeScript, shadcn/ui, and Tailwind CSS
2. Create camera capture component
3. Build style selection interface with preset-to-prompt mapping
   - Create a mapping object/configuration for presets → detailed prompts
   - UI displays friendly preset names
   - Backend receives optimized, detailed prompts
4. Implement image preview and display components
5. Create API service layer for TNG backend
6. Integrate components into cohesive flow
7. Add error handling and loading states
8. Ensure mobile responsiveness

---

## API Integration Details

**Endpoint:**
- Base URL: `https://image.model.tngtech.com`
- Full endpoint: `https://image.model.tngtech.com/api/v1/images/edits`
- Method: POST

**Request Format:** `multipart/form-data`

Required fields:
- `image` (binary file) - The image to edit
- `prompt` (string) - Detailed, well-crafted transformation prompt
  - For presets: Use comprehensive prompts (e.g., "Transform this photo into a vibrant outdoor BBQ party scene with warm summer lighting, people socializing, grilled food on plates, and festive decorations, photorealistic style, high detail")
  - For custom input: Use user's free-text prompt as-is

Optional fields:
- `mask` (binary, optional) - Mask defining where to edit (not needed for full image transformation)
- `seed` (integer, optional) - For reproducible results
- `negative_prompt` (string, optional) - What to avoid in the generation
- `guidance_scale` (number, default: 8.0) - Higher values = closer to prompt (range typically 1-20)
- `size` (string, optional) - Format: 'widthxheight' (e.g., "512x512")
- `model` (string, default: "diffusers/stable-diffusion-xl-1.0-inpainting-0.1")

**Response Format:** OpenAI-compatible JSON response containing the edited image data

**Authentication:** Bearer token in request headers
- Header format: `Authorization: Bearer <tng_token>`
- Token should be stored in environment variables (`.env.local`)
- Use placeholder token initially: `NEXT_PUBLIC_TNG_API_TOKEN=your_token_here`
- **Important:** Once the application is ready for testing, ask the user to provide the actual TNG API token to replace the placeholder

---

## Deliverables

1. Fully functional Next.js application with complete user flow
2. Clean, maintainable TypeScript codebase with proper type definitions
3. Responsive UI working on all devices (mobile-first approach)
4. Environment configuration files:
   - `.env.example` with `NEXT_PUBLIC_TNG_API_TOKEN=your_token_here`
   - `.env.local` with the same placeholder (gitignored)
   - Instructions in README on how to add the actual token

---

**After implementation is complete and ready for testing:** Ask the user to provide the actual TNG API token to replace the placeholder in `.env.local`.

