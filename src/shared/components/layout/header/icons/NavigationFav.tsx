import React from "react";

interface NavigationFavProps {
  className?: string;
  isActive?: boolean;
}

const NavigationFav = ({ className = "", isActive = false }: NavigationFavProps) => {
  if (isActive) {
    return (
      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M17.106 3.10156C15.296 3.10156 13.676 3.98156 12.666 5.33156C11.656 3.98156 10.036 3.10156 8.22602 3.10156C5.15602 3.10156 2.66602 5.60156 2.66602 8.69156C2.66602 9.88156 2.85602 10.9816 3.18602 12.0016C4.76602 17.0016 9.63602 19.9916 12.046 20.8116C12.386 20.9316 12.946 20.9316 13.286 20.8116C15.696 19.9916 20.566 17.0016 22.146 12.0016C22.476 10.9816 22.666 9.88156 22.666 8.69156C22.666 5.60156 20.176 3.10156 17.106 3.10156Z"
          fill="var(--color-main)"
        />
      </svg>
    );
  }

  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.954 20.8116C12.614 20.9316 12.054 20.9316 11.714 20.8116C8.81398 19.8216 2.33398 15.6916 2.33398 8.69156C2.33398 5.60156 4.82398 3.10156 7.89398 3.10156C9.71398 3.10156 11.324 3.98156 12.334 5.34156C13.344 3.98156 14.964 3.10156 16.774 3.10156C19.844 3.10156 22.334 5.60156 22.334 8.69156C22.334 15.6916 15.854 19.8216 12.954 20.8116Z"
        stroke="#888888"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NavigationFav;
