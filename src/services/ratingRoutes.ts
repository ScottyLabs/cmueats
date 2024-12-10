import { RatingModel } from './ratingModel.js';

export const ratingRoutes = (req: Request) => {
  const url = new URL(req.url);
  const method = req.method;

  if (url.pathname === '/api/ratings' && method === 'POST') {
    return req.json().then(async (ratingData) => {
      const newRating = await RatingModel.create(ratingData);
      return new Response(JSON.stringify(newRating), { status: 200 });
    });
  }

  if (url.pathname.startsWith('/api/ratings/average/') && method === 'GET') {
    const restaurantName = url.pathname.split('/').pop();
    return RatingModel.getAverageRating(restaurantName || '').then((averageRating) =>
      new Response(JSON.stringify({ averageRating }), { status: 200 })
    );
  }

  if (url.pathname.startsWith('/api/ratings/') && method === 'GET') {
    const restaurantName = url.pathname.split('/').pop();
    return RatingModel.getRatingsByRestaurant(restaurantName || '').then((ratings) =>
      new Response(JSON.stringify(ratings), { status: 200 })
    );
  }

  return Promise.resolve(new Response('Not Found', { status: 404 }));
};
