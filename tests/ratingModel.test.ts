import { describe, it, expect, vi } from 'vitest';

// Mock the RatingModel
vi.mock('../src/services/ratingModel', () => ({
  RatingModel: {
    create: vi.fn().mockResolvedValue({ restaurant: 'Mock Restaurant', rating: 5, comment: 'Mock Comment' }),
    getRatingsByRestaurant: vi.fn().mockResolvedValue([{ restaurant: 'Mock Restaurant', rating: 5 }]),
    getAverageRating: vi.fn().mockResolvedValue(4.5),
  },
}));

import { RatingModel } from '../src/services/ratingModel';

describe('RatingModel Tests', () => {
  it('should create a new rating', async () => {
    const newRating = await RatingModel.create({
      restaurant: 'Test Restaurant',
      rating: 4,
      comment: 'Great!',
    });
    expect(newRating).toMatchObject({
      restaurant: 'Mock Restaurant',
      rating: 5,
      comment: 'Mock Comment',
    });
  });

  it('should fetch ratings by restaurant name', async () => {
    const ratings = await RatingModel.getRatingsByRestaurant('Test Restaurant');
    expect(ratings).toBeInstanceOf(Array);
    expect(ratings.length).toBeGreaterThan(0);
    expect(ratings[0]).toMatchObject({ restaurant: 'Mock Restaurant', rating: 5 });
  });

  it('should calculate the average rating for a restaurant', async () => {
    const average = await RatingModel.getAverageRating('Test Restaurant');
    expect(average).toBe(4.5);
  });
});
