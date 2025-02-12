# Project Setup Instruction

## Project Name : Notly

Prerequisites:

Before you begin, ensure you have the following installed:
Node.js (version 18.x or higher recommended)
npm (comes bundled with Node.js)

## Setup Instructions (Frontend)

Follow these steps to set up the project locally:

1. Clone the frontend repository
   git clone https://github.com/tinyscriptwebsite/Notly-ui.git
   cd Notly-ui

2. Install dependencies:
   npm install

3. Set up environment variables
   For Frontend :Create a .env.local file in the root directory and add the necessary environment variables as mention in step 4.

4. Edit the .env file with your configuration:
   _For Frontend environment variable_
   NODE_ENV=development
   BASE_URL_DEV=http://localhost:5000

5. Run the application
   Start the development server(Frontend): npm run dev

## Notly Website - Features & Future Improvements

# Features Implemented:

1. User Authentication:
   Create an account & login securely.

2. Sketching & Drawing Tools:
   Freehand drawing.
   Add shapes (Rectangle, Circle).
   Add text.
   Color selection for drawing.

3. Editing & Customization:
   Edit saved sketches.
   Undo & Redo functionality.
   Delete sketches if not needed.

4. Save & Export Options:
   Save sketches in the database.
   Download sketches as PNG & PDF.

5. Theme Toggle:
   Switch between Dark & Light themes.

# Future Improvements:

1. More Drawing Tools:
   Line, Arrow, Polygon, and Custom Shapes.
   Gradient and pattern fills.

2. Layer Management:
   Move, lock, and group elements.
   Change layer order.

3. Collaboration Features:
   Real-time collaboration with multiple users.
   Share sketches via links.

4. Advanced Exporting Options:
   SVG, GIF, and WebP formats.
   High-resolution export.

5. Performance & Usability:
   Optimize undo/redo for better control.
   Auto-save drafts while sketching.

6. Mobile & Tablet Support:
   Responsive design & touch gestures.
