import { RatingModel } from './RatingModel.js';

export const ratingRoutes = (app: any) => {
  app.post('/api/ratings', async (req: any, res: any) => {
    const ratingData = await req.json();
    const newRating = await RatingModel.create(ratingData);
    return res.json(newRating);
  });

  app.get('/api/ratings/:restaurantName', async (req: any, res: any) => {
    const restaurantName = req.params.restaurantName; // Use name instead of ID
    const ratings = await RatingModel.getRatingsByRestaurant(restaurantName);
    return res.json(ratings);
  });

  app.get('/api/ratings/average/:restaurantName', async (req: any, res: any) => {
    const restaurantName = req.params.restaurantName; // Use name instead of ID
    const averageRating = await RatingModel.getAverageRating(restaurantName);
    return res.json({ averageRating });
  });
};
