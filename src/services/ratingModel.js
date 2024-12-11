/**
 * @typedef {Object} Rating
 * @property {string} userEmail - The user's email.
 * @property {string} restaurantName - The name of the restaurant.
 * @property {number} foodRating - Rating for food.
 * @property {number} locationRating - Rating for location.
 * @property {number} cleanlinessRating - Rating for cleanliness.
 * @property {number} serviceRating - Rating for service.
 * @property {number} valueForMoneyRating - Rating for value for money.
 * @property {number} menuVarietyRating - Rating for menu variety.
 * @property {number} waitTimeRating - Rating for wait time.
 * @property {number} staffRating - Rating for staff.
 * @property {number} overallSatisfactionRating - Rating for overall satisfaction.
 */

/** Simulated in-memory database */
const ratingsDb = [];

/** RatingModel provides methods to interact with the ratings database */
export const RatingModel = {
  /**
   * Add a new rating.
   * @param {Rating} ratingData - The rating data to be added.
   * @returns {Promise<Rating>} The added rating data.
   */
  create: async (ratingData) => {
    ratingsDb.push(ratingData);
    return ratingData;
  },

  /**
   * Get all ratings for a specific restaurant.
   * @param {string} restaurantName - The name of the restaurant.
   * @returns {Promise<Rating[]>} List of ratings for the restaurant.
   */
  getRatingsByRestaurant: async (restaurantName) => {
    return ratingsDb.filter((rating) => rating.restaurantName === restaurantName);
  },

  /**
   * Get the average ratings for a specific restaurant.
   * @param {string} restaurantName - The name of the restaurant.
   * @returns {Promise<Object|null>} The average ratings or null if no ratings exist.
   */
  getAverageRating: async (restaurantName) => {
    const restaurantRatings = ratingsDb.filter((rating) => rating.restaurantName === restaurantName);
    if (restaurantRatings.length === 0) return null;

    const totalRatings = restaurantRatings.length;
    const averageRating = {
      foodRating: restaurantRatings.reduce((sum, rating) => sum + rating.foodRating, 0) / totalRatings,
      locationRating: restaurantRatings.reduce((sum, rating) => sum + rating.locationRating, 0) / totalRatings,
      cleanlinessRating: restaurantRatings.reduce((sum, rating) => sum + rating.cleanlinessRating, 0) / totalRatings,
      serviceRating: restaurantRatings.reduce((sum, rating) => sum + rating.serviceRating, 0) / totalRatings,
      valueForMoneyRating: restaurantRatings.reduce((sum, rating) => sum + rating.valueForMoneyRating, 0) / totalRatings,
      menuVarietyRating: restaurantRatings.reduce((sum, rating) => sum + rating.menuVarietyRating, 0) / totalRatings,
      waitTimeRating: restaurantRatings.reduce((sum, rating) => sum + rating.waitTimeRating, 0) / totalRatings,
      staffRating: restaurantRatings.reduce((sum, rating) => sum + rating.staffRating, 0) / totalRatings,
      overallSatisfactionRating: restaurantRatings.reduce((sum, rating) => sum + rating.overallSatisfactionRating, 0) / totalRatings,
    };

    return averageRating;
  },
};