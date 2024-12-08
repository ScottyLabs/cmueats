type Rating = {
    userEmail: string;
    restaurantName: string; // Use name instead of ID
    foodRating: number;
    locationRating: number;
    cleanlinessRating: number;
    serviceRating: number;
    valueForMoneyRating: number;
    menuVarietyRating: number;
    waitTimeRating: number;
    staffRating: number;
    overallSatisfactionRating: number;
  };
  
  const ratingsDb: Rating[] = []; // Simulated in-memory database
  
  export const RatingModel = {
    create: async (ratingData: Rating) => {
      ratingsDb.push(ratingData);
      return ratingData;
    },
  
    getRatingsByRestaurant: async (restaurantName: string) => {
      return ratingsDb.filter((rating) => rating.restaurantName === restaurantName);
    },
  
    getAverageRating: async (restaurantName: string) => {
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
  