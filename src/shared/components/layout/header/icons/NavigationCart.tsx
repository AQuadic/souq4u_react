import React from "react";

interface NavigationCartProps {
  className?: string;
  isActive?: boolean;
}

const NavigationCart = ({ className = "", isActive = false }: NavigationCartProps) => {
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
          d="M20.6258 8.95844C19.9558 8.21844 18.9458 7.78844 17.5458 7.63844V6.87844C17.5458 5.50844 16.9658 4.18844 15.9458 3.26844C14.9158 2.32844 13.5758 1.88844 12.1858 2.01844C9.79576 2.24844 7.78576 4.55844 7.78576 7.05844V7.63844C6.38576 7.78844 5.37576 8.21844 4.70576 8.95844C3.73576 10.0384 3.76576 11.4784 3.87576 12.4784L4.57576 18.0484C4.78576 19.9984 5.57576 21.9984 9.87576 21.9984H15.4558C19.7558 21.9984 20.5458 19.9984 20.7558 18.0584L21.4558 12.4684C21.5658 11.4784 21.5858 10.0384 20.6258 8.95844ZM12.3258 3.40844C13.3258 3.31844 14.2758 3.62844 15.0158 4.29844C15.7458 4.95844 16.1558 5.89844 16.1558 6.87844V7.57844H9.17576V7.05844C9.17576 5.27844 10.6458 3.56844 12.3258 3.40844ZM9.08576 13.1484H9.07576C8.52576 13.1484 8.07576 12.6984 8.07576 12.1484C8.07576 11.5984 8.52576 11.1484 9.07576 11.1484C9.63576 11.1484 10.0858 11.5984 10.0858 12.1484C10.0858 12.6984 9.63576 13.1484 9.08576 13.1484ZM16.0858 13.1484H16.0758C15.5258 13.1484 15.0758 12.6984 15.0758 12.1484C15.0758 11.5984 15.5258 11.1484 16.0758 11.1484C16.6358 11.1484 17.0858 11.5984 17.0858 12.1484C17.0858 12.6984 16.6358 13.1484 16.0858 13.1484Z"
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
        d="M8.16797 7.66952V6.69952C8.16797 4.44952 9.97797 2.23952 12.228 2.02952C14.908 1.76952 17.168 3.87952 17.168 6.50952V7.88952"
        stroke="#888888"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.66877 22H15.6688C19.6888 22 20.4088 20.39 20.6188 18.43L21.3688 12.43C21.6388 9.99 20.9388 8 16.6688 8H8.66877C4.39877 8 3.69877 9.99 3.96877 12.43L4.71877 18.43C4.92877 20.39 5.64877 22 9.66877 22Z"
        stroke="#888888"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.1625 12H16.1715"
        stroke="#888888"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.16248 12H9.17146"
        stroke="#888888"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NavigationCart;
