import React from "react";

interface Props {
  flip?: boolean;
}

const BackArrow: React.FC<Props> = ({ flip = false }) => {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path
        d="M25.0898 29.9181L18.5698 23.3981C17.7998 22.6281 17.7998 21.3681 18.5698 20.5981L25.0898 14.0781"
        stroke="#000000"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BackArrow;
