import { useState } from "react";
import { Spinner } from "./app-button";

const AppInputText = ({
  label,
  id,
  placeholder,
  requiredField = false,
  type = "text",
  name,
  onChange,
  value,
  disabled,
  isLoadingContent = false,
  onBlur,
}: {
  label?: string;
  id: string;
  placeholder: string;
  requiredField?: boolean;
  type?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
  disabled?: boolean;
  isLoadingContent?: boolean;
  onBlur?: () => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";

  return (
    <div className="space-y-1 w-full">
      <label
        htmlFor={id}
        className={`text-xs font-semibold text-gray-700 ${requiredField ? 'after:content-["*"] after:text-red-500 after:ml-1 after:font-bold' : ""}`}
      >
        {label}
      </label>
      <div className="relative overflow-hidden rounded-md border border-gray-300">
        {isLoadingContent && (
          <div className="absolute inset-0 w-full h-full flex items-center pl-2 bg-white">
            <Spinner className="size-4 text-primary" />
          </div>
        )}
        <input
          type={isPasswordField && showPassword ? "text" : type}
          id={id}
          name={name}
          placeholder={placeholder}
          className="w-full rounded-md p-2 placeholder:text-xs text-xs outline-none focus:border-primary transition-all duration-300 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300"
          onChange={onChange}
          value={value}
          disabled={disabled}
          onBlur={onBlur}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 text-xs"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AppInputText;