"use client";

import { Loader2 } from "lucide-react";
import { Button } from "./button";

const Appbutton = ({
  buttonText,
  loading,
  disabled,
  className,
  onClick,
  type,
}: {
  loading?: boolean;
  disabled?: boolean;
  buttonText: string;
  className?: string;
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
}) => {
  return (
    <Button
      disabled={disabled}
      className={`rounded-lg text-sm font-semibold p-2 text-white ${className ?? "bg-primary "}`}
      onClick={onClick}
      type={type}
    >
      {loading && <Spinner className="" />}
      <span>{buttonText}</span>
    </Button>
  );
};

export const Spinner = ({ ...props }) => (
  <Loader2 className={`animate-spin text-primary ${props.className ?? ""}`} />
);

export default Appbutton;
