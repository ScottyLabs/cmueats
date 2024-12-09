import { describe, it, expect } from 'vitest';
import { RatingModel } from '../src/services/ratingModel';

describe('RatingModel Tests', () => {
  it('should create a new rating', async () => {
    const newRating = await RatingModel.create({
      restaurant: 'Test Restaurant',
      rating: 4,
      comment: 'Great!',
    });
    expect(newRating).toMatchObject({
      restaurant: 'Test Restaurant',
      rating: 4,
      comment: 'Great!',
    });
  });

  it('should fetch ratings by restaurant name', async () => {
    const ratings = await RatingModel.getRatingsByRestaurant('Test Restaurant');
    expect(ratings).toBeInstanceOf(Array);
    expect(ratings.length).toBeGreaterThan(0);
  });

  it('should calculate the average rating for a restaurant', async () => {
    const average = await RatingModel.getAverageRating('Test Restaurant');
    expect(average).toBeGreaterThanOrEqual(1);
    expect(average).toBeLessThanOrEqual(5);
  });
});
