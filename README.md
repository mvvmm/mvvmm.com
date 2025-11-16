# mvvmm.dev

An interactive code editor for live-coding HTML, CSS, and JavaScript experiences with real-time preview.


![Editor Screenshot](assets/readme/editor.png)

## Running Locally

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run the development server:
   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- **`/editor/[experienceName]`** provides the editor interface for each experience.

- **`/components`** - React components including the editor UI (CodeMirror integration, controls, error display) and the live preview iframe.

- **`/experiences`** - Each subdirectory contains an experience's HTML, CSS, and JavaScript files that can be edited in the editor.

- **`/contexts`** - React Context API for managing the global state of the active experience, including file contents, editor/iframe refs, and preview controls.

- **`/data`** - Server-side functions that read experience files from the filesystem and generate the HTML document for the preview iframe.

- **`/lib`** - Utility code including CodeMirror editor configuration and theme definitions.

## Architecture

- **Next.js 15** with App Router for server-side rendering and routing
- **CodeMirror 6** for the code editor with JavaScript syntax highlighting
- **React Context** (`ExperienceContext`) manages the state of the active experience, including file contents, editor/iframe refs, and preview controls
- **Server Components** load experience files from the filesystem
- **Client Components** handle the interactive editor and live preview
- Experiences are stored as separate HTML, CSS, and JS files in the `experiences/` directory
- The preview is rendered in an iframe using a dynamically generated `srcDoc` that combines all experience files

