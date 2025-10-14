import React from "react";

interface Props {
  flip?: boolean;
}

const RedArrow: React.FC<Props> = ({ flip = false }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path
        d="M8.90997 19.9181L15.43 13.3981C16.2 12.6281 16.2 11.3681 15.43 10.5981L8.90997 4.07812"
        stroke="var(--color-main)"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RedArrow;
