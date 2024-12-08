// services/ratingModel.ts

interface Rating {
    userEmail: string;
    foodRating: number;
    locationRating: number;
    cleanlinessRating: number;
    serviceRating: number;
    valueForMoneyRating: number;
    menuVarietyRating: number;
    waitTimeRating: number;
    staffRating: number;
    overallSatisfactionRating: number;
    restaurantId: string;
  }
  
  const ratingsDb: Rating[] = [];
  
  export const RatingModel = {
    async create(ratingData: Rating): Promise<Rating> {
      ratingsDb.push(ratingData);
      return ratingData;
    },
  
    async getRatingsByRestaurant(restaurantId: string): Promise<Rating[]> {
      return ratingsDb.filter(rating => rating.restaurantId === restaurantId);
    },
  
    async getAverageRating(restaurantId: string): Promise<number> {
      const ratings = await this.getRatingsByRestaurant(restaurantId);
      const totalRatings = ratings.length;
  
      if (totalRatings === 0) return 0;
  
      const totalScore = ratings.reduce((acc, rating) => {
        return acc + rating.foodRating + rating.locationRating + rating.cleanlinessRating +
               rating.serviceRating + rating.valueForMoneyRating + rating.menuVarietyRating +
               rating.waitTimeRating + rating.staffRating + rating.overallSatisfactionRating;
      }, 0);
  
      return totalScore / (totalRatings * 9); // Divide by 9 for each rating type
    }
  };
  