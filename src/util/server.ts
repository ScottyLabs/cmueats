import { ratingRoutes } from '../services/ratingRoutes';

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    // Delegate to ratingRoutes for handling API requests
    if (req.url.startsWith('/api/ratings')) {
      return ratingRoutes(req);
    }
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Server running on http://localhost:${server.port}`);