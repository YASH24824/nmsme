import { Star, StarHalf } from "lucide-react";

function RatingStars({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}

      {hasHalf && (
        <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      )}
    </div>
  );
}

export default RatingStars;
