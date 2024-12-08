declare module './RatingModel.js' {
    type Rating = {
      restaurant: string;
      rating: number;
      comment?: string;
    };
  
    export const RatingModel: {
      create: (rating: Rating) => Rating;
      getRatingsByRestaurant: (restaurantName: string) => Rating[];
      getAverageRating: (restaurantName: string) => number | null;
    };
  }
  