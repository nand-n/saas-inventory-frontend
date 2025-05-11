import React from "react";

interface PercentageChangeProps {
  value: number;
  text?: string;
  className?: string;
}

export const PercentageChange: React.FC<PercentageChangeProps> = ({
  value,
  text = "from last month",
  className = "",
}) => {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  const absoluteValue = Math.abs(value);
  const displayValue = Number.isInteger(absoluteValue)
    ? absoluteValue
    : absoluteValue.toFixed(1);

  return (
    <span className={className}>
      {sign}
      {displayValue}% {text}
    </span>
  );
};
