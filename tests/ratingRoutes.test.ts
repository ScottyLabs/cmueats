import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app'; // Replace with the correct path to your Express app

describe('Rating Routes Tests', () => {
  it('should create a new rating via POST /api/ratings', async () => {
    const response = await request(app).post('/api/ratings').send({
      restaurant: 'Test Restaurant',
      rating: 5,
      comment: 'Excellent!',
    });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      restaurant: 'Test Restaurant',
      rating: 5,
      comment: 'Excellent!',
    });
  });

  it('should fetch ratings via GET /api/ratings/:restaurantName', async () => {
    const response = await request(app).get('/api/ratings/Test Restaurant');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should calculate the average rating via GET /api/ratings/average/:restaurantName', async () => {
    const response = await request(app).get('/api/ratings/average/Test Restaurant');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('averageRating');
    expect(response.body.averageRating).toBeGreaterThanOrEqual(1);
    expect(response.body.averageRating).toBeLessThanOrEqual(5);
  });
  it('should handle server errors gracefully', async () => {
    // Simulate a database error
    vi.spyOn(RatingModel, 'getRatingsByRestaurant').mockImplementation(() => {
      throw new Error('Database error');
    });
  
    const response = await request(app).get('/api/ratings/Test Restaurant');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Failed to fetch ratings');
  });  
});
