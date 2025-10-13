import React, { SVGProps } from 'react';

const LeftArrow = (props: SVGProps<SVGSVGElement>) => {
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
        d="M15.09 19.9181L8.57003 13.3981C7.80003 12.6281 7.80003 11.3681 8.57003 10.5981L15.09 4.07812"
        stroke="#838383"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LeftArrow;
