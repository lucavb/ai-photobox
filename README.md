# PhotoBox AI 📷✨

A modern web application that allows users to capture photos from their device camera and transform them using AI-powered style transfers with preset suggestions and custom prompts.

## Features

- 📸 **Camera Capture**: Access device camera (desktop webcams and mobile cameras) with live preview
- 🎨 **Style Presets**: 7 carefully crafted artistic styles including:
  - BBQ Party
  - Van Gogh Style
  - Cyberpunk Future
  - Watercolor Dream
  - Vintage Film
  - Comic Book Art
  - Fantasy Realm
- ✏️ **Custom Prompts**: Write your own detailed transformation prompts for unlimited creativity
- 📤 **File Upload**: Fallback option for devices without camera access
- 🖼️ **Before/After Comparison**: View original and transformed images side by side
- 💾 **Download Results**: Save transformed images to your device
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- 🎯 **User-Friendly**: Clean, modern UI with clear visual feedback at every step

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS (v4)
- **Icons**: lucide-react
- **Architecture**: App Router
- **APIs**: Browser Camera API, TNG Image Model API

## Prerequisites

- Node.js 18+ 
- npm or yarn
- A modern web browser (Chrome, Safari, Firefox, Edge)
- TNG API token (required for image transformations)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ai-photobox
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   
   Create a `.env.local` file in the root directory (or copy from `.env.example`):
   ```bash
   cp .env.example .env.local
   ```

4. **Add your TNG API token**:
   
   Open `.env.local` and replace the placeholder with your actual TNG API token:
   ```env
   NEXT_PUBLIC_TNG_API_TOKEN=your_actual_token_here
   ```

   **Important**: Without a valid API token, the image transformation feature will not work.

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will hot-reload as you make changes to the code.

## Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
ai-photobox/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx             # Main application page with user flow
│   │   └── globals.css          # Global styles and Tailwind config
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── CameraCapture.tsx    # Camera access and photo capture
│   │   ├── ImagePreview.tsx     # Captured image preview
│   │   ├── StyleSelection.tsx   # Style preset and custom prompt UI
│   │   ├── LoadingState.tsx     # Transformation loading indicator
│   │   └── TransformationResult.tsx  # Before/after comparison
│   ├── services/
│   │   └── image-api.ts         # TNG API service layer
│   ├── config/
│   │   └── styles.ts            # Style preset configurations
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── lib/
│       └── utils.ts             # Utility functions
├── public/                      # Static assets
├── .env.local                   # Environment variables (gitignored)
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## Usage

1. **Capture or Upload**: Start by capturing a photo using your camera or uploading an existing image
2. **Preview**: Review your photo and choose to continue or retake
3. **Select Style**: Choose from preset styles or write a custom prompt
4. **Transform**: Wait 10-30 seconds while AI transforms your photo
5. **Download**: View the before/after comparison and download your transformed image
6. **Start Over**: Create more transformations with new photos

## Camera Permissions

On first use, your browser will request camera access. Grant permissions to use the camera capture feature. If denied:
- You can still use the file upload option
- Enable camera permissions in your browser settings and refresh the page

## Browser Compatibility

- ✅ Chrome 53+
- ✅ Safari 11+
- ✅ Firefox 36+
- ✅ Edge 79+

Camera API support varies by browser and device. File upload is available as a fallback.

## API Integration

The application uses the TNG Image Model API for AI transformations:

- **Endpoint**: `https://image.model.tngtech.com/api/v1/images/edits`
- **Method**: POST with multipart/form-data
- **Authentication**: Bearer token (configured in `.env.local`)
- **Timeout**: 60 seconds
- **Image Optimization**: Automatically resizes images over 2MB

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_TNG_API_TOKEN` | TNG API authentication token | Yes |

## Troubleshooting

### Camera Not Working
- Check browser permissions for camera access
- Ensure you're using HTTPS (required for camera API)
- Try the file upload option as a fallback

### Transformation Fails
- Verify your TNG API token is correct in `.env.local`
- Check your internet connection
- Ensure image size is reasonable (under 10MB)
- Try a different style or custom prompt

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Ensure you're using Node.js 18+

## Contributing

This is a prototype project. Contributions, issues, and feature requests are welcome!

## License

[MIT License](LICENSE)

## Acknowledgments

- Built with Next.js and shadcn/ui
- Powered by TNG Image Model API
- Icons by lucide-react

---

**Note**: This is a local development prototype. No data or images are stored on any server. All processing happens via the TNG API, and results are only stored locally in your browser session.
