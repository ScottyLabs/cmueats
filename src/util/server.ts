import { RatingModel } from './services/RatingModel.js';
import { ratingRoutes } from './services/ratingRoutes.ts';

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    // Handle routes using ratingRoutes
    const url = new URL(req.url);
    if (url.pathname.startsWith('/api/ratings')) {
      return ratingRoutes(req);
    }
    return new Response('Not Found', { status: 404 });
  },
});

console.log(`Server running on http://localhost:${server.port}`);

