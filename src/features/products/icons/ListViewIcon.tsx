"use client";
import React from "react";

interface ListViewIconProps {
  selected?: boolean;
  darkMode?: boolean;
}

const ListViewIcon: React.FC<ListViewIconProps> = ({
  selected = false,
  darkMode = false,
}) => {
  if (selected) {
    return (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="48"
          height="48"
          rx="8"
          className="fill-current text-main"
        />
        <g clipPath="url(#clip0)">
          <path
            d="M20.25 18H32.25"
            stroke="#FDFDFD"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.25 24H32.25"
            stroke="#FDFDFD"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.25 30H32.25"
            stroke="#FDFDFD"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.125 19.125C16.7463 19.125 17.25 18.6213 17.25 18C17.25 17.3787 16.7463 16.875 16.125 16.875C15.5037 16.875 15 17.3787 15 18C15 18.6213 15.5037 19.125 16.125 19.125Z"
            fill="#FDFDFD"
          />
          <path
            d="M16.125 25.125C16.7463 25.125 17.25 24.6213 17.25 24C17.25 23.3787 16.7463 22.875 16.125 22.875C15.5037 22.875 15 23.3787 15 24C15 24.6213 15.5037 25.125 16.125 25.125Z"
            fill="#FDFDFD"
          />
          <path
            d="M16.125 31.125C16.7463 31.125 17.25 30.6213 17.25 30C17.25 29.3787 16.7463 28.875 16.125 28.875C15.5037 28.875 15 29.3787 15 30C15 30.6213 15.5037 31.125 16.125 31.125Z"
            fill="#FDFDFD"
          />
        </g>
        <defs>
          <clipPath id="clip0">
            <rect
              width="24"
              height="24"
              fill="white"
              transform="translate(12 12)"
            />
          </clipPath>
        </defs>
      </svg>
    );
  }

  // Unselected → light/dark mode
  const stroke = darkMode ? "#FDFDFD" : "#C0C0C0";
  const fill = darkMode ? "#FDFDFD" : "#121212";

  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="47" height="47" rx="7.5" stroke={stroke} />
      <g clipPath="url(#clip0)">
        <path
          d="M20.25 18H32.25"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.25 24H32.25"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.25 30H32.25"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.125 19.125C16.7463 19.125 17.25 18.6213 17.25 18C17.25 17.3787 16.7463 16.875 16.125 16.875C15.5037 16.875 15 17.3787 15 18C15 18.6213 15.5037 19.125 16.125 19.125Z"
          fill={fill}
        />
        <path
          d="M16.125 25.125C16.7463 25.125 17.25 24.6213 17.25 24C17.25 23.3787 16.7463 22.875 16.125 22.875C15.5037 22.875 15 23.3787 15 24C15 24.6213 15.5037 25.125 16.125 25.125Z"
          fill={fill}
        />
        <path
          d="M16.125 31.125C16.7463 31.125 17.25 30.6213 17.25 30C17.25 29.3787 16.7463 28.875 16.125 28.875C15.5037 28.875 15 29.3787 15 30C15 30.6213 15.5037 31.125 16.125 31.125Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(12 12)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ListViewIcon;
