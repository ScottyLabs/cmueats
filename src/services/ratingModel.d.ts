export interface Rating {
  userEmail: string;
  restaurantName: string;
  foodRating: number;
  locationRating: number;
  cleanlinessRating: number;
  serviceRating: number;
  valueForMoneyRating: number;
  menuVarietyRating: number;
  waitTimeRating: number;
  staffRating: number;
  overallSatisfactionRating: number;
}

export declare const RatingModel: {
  create(ratingData: Rating): Promise<Rating>;
  getRatingsByRestaurant(restaurantName: string): Promise<Rating[]>;
  getAverageRating(restaurantName: string): Promise<{
    foodRating: number;
    locationRating: number;
    cleanlinessRating: number;
    serviceRating: number;
    valueForMoneyRating: number;
    menuVarietyRating: number;
    waitTimeRating: number;
    staffRating: number;
    overallSatisfactionRating: number;
  } | null>;
};