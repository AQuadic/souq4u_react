import React from "react";
import SingleFav from "../../icons/SingleFav";
import SingleUnFav from "../../icons/SingleUnFav";

interface ProductImageProps {
  imageUrl: string;
  productName: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  imageUrl,
  productName,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div className="relative">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={productName}
          width={584}
          height={590}
          className="w-[584px] h-[590px] object-contain"
        />
      ) : (
        <div className="w-[584px] h-[590px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
          <svg
            className="w-24 h-24 text-gray-400/50 dark:text-gray-600/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
      <button
        onClick={onToggleFavorite}
        className="cursor-pointer md:hidden flex absolute top-20 right-0 bg-transparent border-none p-1"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? <SingleFav /> : <SingleUnFav />}
      </button>
    </div>
  );
};
