"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ResFav from "../../icons/ResFav";
import ResUnFav from "../../icons/ResUnFav";
import { useTranslation } from "react-i18next";

// Simple arrow components to replace heroicons
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5L8.25 12l7.5-7.5"
    />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
    />
  </svg>
);

interface ImageItem {
  id: number;
  url: string;
  alt?: string;
  responsive_urls?: string[];
}

interface ProductImageGalleryProps {
  images: ImageItem[];
  productName: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

interface MainGalleryProps {
  displayImages: ImageItem[];
  currentIndex: number;
  totalImages: number;
  productName: string;
  isRtl: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  galleryRef: React.RefObject<HTMLDivElement | null>;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  showSideThumbnails: boolean;
}

const MainGallery: React.FC<MainGalleryProps> = ({
  displayImages,
  currentIndex,
  totalImages,
  productName,
  isRtl,
  goToNext,
  goToPrevious,
  onToggleFavorite,
  isFavorite,
  galleryRef,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  showSideThumbnails,
}) => {
  return (
    <div
      ref={galleryRef}
      className={`relative ${
        showSideThumbnails ? "flex-1" : "w-full"
      } h-[300px] sm:h-[400px] md:h-[500px] lg:h-[590px] overflow-hidden rounded-lg`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full h-full relative">
        {displayImages.map((img, index) => {
          const isActive = index === currentIndex;
          const prevIndex = (currentIndex - 1 + totalImages) % totalImages;
          const nextIndex = (currentIndex + 1) % totalImages;
          const eagerLoad =
            isActive || index === prevIndex || index === nextIndex;

          return (
            <div
              key={`main-${img.id}-${index}`}
              className={`absolute inset-0 flex items-center justify-center transition-none ${
                isActive
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={img.url || "/placeholder-product.jpg"}
                alt={img.alt || productName}
                width={584}
                height={590}
                className="w-full h-full object-contain"
                // priority={isActive}
                loading={eagerLoad ? "eager" : "lazy"}
              />
            </div>
          );
        })}
      </div>

      {totalImages > 1 && (
        <>
          <button
            onClick={isRtl ? goToNext : goToPrevious}
            className={`absolute top-1/2 -translate-y-1/2 ${
              isRtl ? "right-4" : "left-4"
            } z-10 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            aria-label={isRtl ? "Next image" : "Previous image"}
          >
            {isRtl ? (
              <ChevronRightIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
            )}
          </button>
          <button
            onClick={isRtl ? goToPrevious : goToNext}
            className={`absolute top-1/2 -translate-y-1/2 ${
              isRtl ? "left-4" : "right-4"
            } z-10 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            aria-label={isRtl ? "Previous image" : "Next image"}
          >
            {isRtl ? (
              <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <ChevronRightIcon className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </>
      )}

      <button
        onClick={onToggleFavorite}
        className="absolute top-0 right-3 z-20 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? <ResFav /> : <ResUnFav />}
      </button>
    </div>
  );
};

interface ThumbnailsProps {
  displayImages: ImageItem[];
  currentIndex: number;
  goToSlide: (index: number) => void;
  productName: string;
  vertical?: boolean;
}

const Thumbnails: React.FC<ThumbnailsProps> = ({
  displayImages,
  currentIndex,
  goToSlide,
  productName,
  vertical = false,
}) => {
  if (vertical) {
    return (
      <div className="flex flex-col gap-2 justify-start overflow-y-auto pb-2 px-1 w-20 sm:w-24 md:w-28 max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[590px]">
        {displayImages.map((image, index) => (
          <button
            key={`${image.id}-thumb`}
            onClick={() => goToSlide(index)}
            className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-4 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              index === currentIndex
                ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <img
              src={image.url}
              alt={`${productName} - Image ${index + 1}`}
              width={112}
              height={112}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 justify-start overflow-x-auto pb-2 px-1 mt-4">
      {displayImages.map((image, index) => (
        <button
          key={`${image.id}-thumb`}
          onClick={() => goToSlide(index)}
          className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border-4 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            index === currentIndex
              ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <img
            src={image.url}
            alt={`${productName} - Image ${index + 1}`}
            width={112}
            height={112}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  );
};

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
  isFavorite,
  onToggleFavorite,
}) => {
  // Default to non-clothes (no side thumbnails)
  const showSideThumbnails = false;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isRtl, setIsRtl] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const {t} = useTranslation("Products");

  // Detect RTL direction
  useEffect(() => {
    const direction = document.documentElement.dir || document.body.dir;
    setIsRtl(direction === "rtl");
  }, []);

  // If no images provided, use placeholder
  const displayImages =
    images.length > 0
      ? images
      : [{ id: 0, url: "/placeholder-product.jpg", alt: productName }];

  const totalImages = displayImages.length;

  // Debug logging
  console.log("ProductImageGallery:", {
    showSideThumbnails,
    imagesCount: images.length,
    displayImagesCount: displayImages.length,
    displayImages,
  });

  // Navigation functions
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isRtl) {
      // In RTL, reverse the swipe logic
      if (isLeftSwipe) {
        goToPrevious();
      } else if (isRightSwipe) {
        goToNext();
      }
    } else if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isExpanded && e.key === "Escape") {
        setIsExpanded(false);
        return;
      }

      if (e.key === "ArrowLeft") {
        if (isRtl) {
          goToNext();
        } else {
          goToPrevious();
        }
      } else if (e.key === "ArrowRight") {
        if (isRtl) {
          goToPrevious();
        } else {
          goToNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRtl, goToNext, goToPrevious, isExpanded]);

  return (
    <div
      className={`${
        showSideThumbnails
          ? "flex flex-row w-full items-start gap-4"
          : "flex flex-col w-full max-w-[584px]"
      }`}
    >
      {showSideThumbnails ? (
        <>
          <Thumbnails
            displayImages={displayImages}
            currentIndex={currentIndex}
            goToSlide={goToSlide}
            productName={productName}
            vertical
          />
          <div className="flex-1 relative">
            <div onClick={() => setIsExpanded(true)} className="cursor-pointer">
              <MainGallery
                displayImages={displayImages}
                currentIndex={currentIndex}
                totalImages={totalImages}
                productName={productName}
                isRtl={isRtl}
                goToNext={goToNext}
                goToPrevious={goToPrevious}
                onToggleFavorite={onToggleFavorite}
                isFavorite={isFavorite}
                galleryRef={galleryRef}
                handleTouchStart={handleTouchStart}
                handleTouchMove={handleTouchMove}
                handleTouchEnd={handleTouchEnd}
                showSideThumbnails={showSideThumbnails}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative">
            <div 
              onClick={() => setIsExpanded(true)}
              className="cursor-pointer relative group"
            >
              <div className="transition-opacity duration-300 group-hover:opacity-70">
                <div
                  ref={galleryRef}
                  className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[590px] overflow-hidden rounded-lg"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="w-full h-full relative">
                    {displayImages.map((img, index) => {
                      const isActive = index === currentIndex;
                      const prevIndex =
                        (currentIndex - 1 + totalImages) % totalImages;
                      const nextIndex = (currentIndex + 1) % totalImages;
                      const eagerLoad =
                        isActive || index === prevIndex || index === nextIndex;

                      return (
                        <div
                          key={`main-${img.id}-${index}`}
                          className={`absolute inset-0 flex items-center justify-center transition-none ${
                            isActive
                              ? "opacity-100 z-10"
                              : "opacity-0 z-0 pointer-events-none"
                          }`}
                        >
                          <img
                            src={img.url || "/placeholder-product.jpg"}
                            alt={img.alt || productName}
                            width={584}
                            height={590}
                            className="w-full h-full object-contain"
                            loading={eagerLoad ? "eager" : "lazy"}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={onToggleFavorite}
                    className="absolute top-0 right-3 z-20 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    {isFavorite ? <ResFav /> : <ResUnFav />}
                  </button>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="text-white text-lg sm:text-xl font-medium bg-black/60 px-4 py-2 rounded-full">
                  {t('Products.tapToExpand')}
                </span>
              </div>
            </div>

            {totalImages > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // isRtl ? goToNext() : goToPrevious();
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    isRtl ? "right-4" : "left-4"
                  } z-20 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label={isRtl ? "Next image" : "Previous image"}
                >
                  {isRtl ? (
                    <ChevronRightIcon className="w-6 h-6 text-gray-700" />
                  ) : (
                    <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // isRtl ? goToPrevious() : goToNext();
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    isRtl ? "left-4" : "right-4"
                  } z-20 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label={isRtl ? "Previous image" : "Next image"}
                >
                  {isRtl ? (
                    <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                  ) : (
                    <ChevronRightIcon className="w-6 h-6 text-gray-700" />
                  )}
                </button>
              </>
            )}
          </div>
          <Thumbnails
            displayImages={displayImages}
            currentIndex={currentIndex}
            goToSlide={goToSlide}
            productName={productName}
            vertical={false}
          />
        </>
      )}

      {totalImages > 1 && (
        <div className="flex justify-center mt-4 gap-2 md:hidden">
          {displayImages.map((image, index) => (
            <button
              key={`dot-${image.id}`}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                index === currentIndex
                  ? "bg-blue-500 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {isExpanded && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsExpanded(false)}
        >
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close full screen"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div 
            className="relative w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                displayImages[currentIndex].url || "/placeholder-product.jpg"
              }
              alt={displayImages[currentIndex].alt || productName}
              width={1200}
              height={1200}
              className="max-w-full max-h-full object-contain"
            />

            {totalImages > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // isRtl ? goToNext() : goToPrevious();
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    isRtl ? "right-4" : "left-4"
                  } z-10 bg-white/80 hover:bg-white/90 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label={isRtl ? "Next image" : "Previous image"}
                >
                  {isRtl ? (
                    <ChevronRightIcon className="w-8 h-8 text-gray-700" />
                  ) : (
                    <ChevronLeftIcon className="w-8 h-8 text-gray-700" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // isRtl ? goToPrevious() : goToNext();
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    isRtl ? "left-4" : "right-4"
                  } z-10 bg-white/80 hover:bg-white/90 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label={isRtl ? "Previous image" : "Next image"}
                >
                  {isRtl ? (
                    <ChevronLeftIcon className="w-8 h-8 text-gray-700" />
                  ) : (
                    <ChevronRightIcon className="w-8 h-8 text-gray-700" />
                  )}
                </button>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {displayImages.map((image, index) => (
                    <button
                      key={`modal-dot-${image.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToSlide(index);
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 ${
                        index === currentIndex
                          ? "bg-white scale-125"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
