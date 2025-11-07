import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const Rating = ({ value = 0, onRatingChange, disable = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(value);

  // Handle hover
  const handleMouseEnter = (rating) => {
    if (!disable) {
      setHoverRating(rating);
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (!disable) {
      setHoverRating(0);
    }
  };

  // Handle click (select rating)
  const handleClick = (rating) => {
    if (!disable) {
      setSelectedRating(rating);
      if (onRatingChange) {
        onRatingChange(rating);
      }
    }
  };

  // Generate star icons dynamically
  const generateStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoverRating || selectedRating);
      stars.push(
        <FaStar
          key={i}
          size={14}
          className={`cursor-pointer transition-colors duration-200 ${
            isFilled ? "text-yellow-400" : "text-gray-400"
          } ${disable ? "cursor-not-allowed opacity-70" : ""}`}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
        />
      );
    }
    return stars;
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      {generateStars()}
    </div>
  );
};

export default Rating;
