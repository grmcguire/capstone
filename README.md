# Snapshots in Time - Davidson College Photo Gallery

## Project Overview
This interactive gallery showcases moments captured by Davidson College students and community members during the Spring of 2025. Visitors can explore the gallery, filter by contributor affiliation, and add comments to create a collective narrative.

## Technical Implementation

### Frontend
- Built with React and Vite
- Responsive design for all device sizes
- Interactive photo gallery with filtering capabilities
- Modal view for detailed photo information and comments

### Backend
- Express.js server for local development
- Serverless functions for production deployment on Vercel
- Comments API for storing and retrieving user comments

## Deployment Notes

### Local Development
1. Run the development server:
   ```
   npm run dev
   ```
   This starts both the React frontend and Express backend concurrently.

### Production Deployment (Vercel)
- The application is configured to use Vercel serverless functions for the API
- Comments are stored in a temporary file system in the Vercel environment
- API routes are configured in vercel.json to properly route requests

## API Endpoints

- `GET /api/comments` - Retrieve all comments
- `POST /api/comments` - Add a new comment

## Known Limitations

In the Vercel production environment, comments are stored in the `/tmp` directory, which is ephemeral. This means comments may not persist indefinitely in production. For a more permanent solution, consider implementing a database solution like MongoDB, Firebase, or a SQL database.