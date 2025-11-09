import React, { SVGProps } from 'react';

const RightArrow = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.00003 19.9181L15.52 13.3981C16.29 12.6281 16.29 11.3681 15.52 10.5981L9.00003 4.07812"
        stroke="#0080c7"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RightArrow;
