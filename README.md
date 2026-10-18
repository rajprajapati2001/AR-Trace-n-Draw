# AR Trace & Draw - Camera Sketch Studio

<div align="center">
  <img src="public/favicon.svg" alt="AR Trace & Draw Logo" width="140" style="border-radius: 20%;" />

  <p><br>AR Trace & Draw is an AR sketching web app that projects translucent image overlays onto physical paper via your camera or a screen lightbox. Simply position your phone, look through the screen, and trace the contours with precision.</p>


<div align="center">
  <a href="#" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/React-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=white" alt="React badge" style="height:28px;margin:4px;vertical-align:middle;" /></a>
<a href="#" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Tailwind%20CSS-%2306B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS badge" style="height:28px;margin:4px;vertical-align:middle;" /></a>
<a href="#" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/TypeScript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript badge" style="height:28px;margin:4px;vertical-align:middle;" /></a>
<a href="#" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Node.js-%235FA04E.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js badge" style="height:28px;margin:4px;vertical-align:middle;" /></a>
<a href="#" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/Vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite badge" style="height:28px;margin:4px;vertical-align:middle;" /></a>
</div>


</div>

🌐Live Demo: [https://ar-trace-n-draw.vercel.app/](https://ar-trace-n-draw.vercel.app/)

## Screenshots


## 📂 System Project Structure

Here is a visual map of the files in this simulated repository:

```
AR-Trace-n-Draw
├── public
├── src
│   ├── assets
│   │   └── images
│   │       ├── guide_step1_cup_1792308903914.jpg
│   │       └── sketch_wild_tiger_1792307286239.jpg
│   ├── components
│   │   ├── AppLogo.tsx
│   │   ├── CameraWorkspace.tsx
│   │   ├── ControlHUD.tsx
│   │   ├── SetupGuideModal.tsx
│   │   ├── SketchGallery.tsx
│   │   ├── SnapshotModal.tsx
│   │   └── TopBar.tsx
│   ├── data
│   │   └── sampleSketches.ts
│   ├── utils
│   │   └── imageProcessing.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Installation & Setup Guide

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm, yarn, or pnpm
- A modern web browser (Chrome, Safari, Edge, or Firefox) with camera permissions enabled

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rajprajapati2001/AR-Trace-n-Draw.git
   cd AR-Trace-n-Draw
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Navigate to `http://localhost:3001` to access the application.

5. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready assets will be compiled into the `dist/` directory.




---

## ⚡ Technology Used
- **Frontend Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode, ES2022)
- **Build Tool**: [Vite 8](https://vitejs.dev/) with `@vitejs/plugin-react`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Processing**: HTML5 Offscreen Canvas API with custom Sobel Edge Detection kernel
- **Hardware Integration**: Web MediaDevices API (`navigator.mediaDevices.getUserMedia`) with Torch / Flashlight constraints

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---
**Raj Prajapati**

Developed on `18th October 2026`/`Sunday`.