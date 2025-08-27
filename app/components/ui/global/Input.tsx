"use client";

import { Dispatch, SetStateAction, ReactNode, useState } from "react";

import Eye from "../icons/Eye";
import EyeClosed from "../icons/EyeClosed";

interface InputProps {
  name: string;
  label: string | ReactNode;
  labelRightComponent?: ReactNode;
  placeholder?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  error?: string;
  isSecret?: boolean;
  disabled?: boolean;
  textarea?: boolean;
}

export default function Input({
  name,
  label,
  labelRightComponent,
  placeholder,
  value,
  setValue,
  error,
  isSecret,
  disabled,
  textarea,
}: InputProps) {
  //Check if secret input is focused  and visible
  const [isSecretInputFocused, setIsSecretInputFocused] = useState(false);
  const [isSecretInputVisible, setIsSecretInputVisible] = useState(false);

  //Secret input visibility toggler
  function toggleSecretInputVisibility() {
    setIsSecretInputVisible((prevState) => !prevState);
  }

  return (
    <div className="w-full mb-[15px]">
      {/** Header */}
      <header className="flex items-center justify-between">
        <label
          htmlFor={name}
          className={`block text-[15px] text-black-2 mb-2 ${
            error && "!text-error-red-2"
          }`}
        >
          {label}
        </label>

        {labelRightComponent}
      </header>

      {/** Normal non-textarea Input */}
      {!isSecret && !textarea && (
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`h-[42px] w-full bg-white text-[15px] text-black-2 p-2 border-[1px] border-[#E2E5E7] rounded-[6px] transition-all duration-250 focus:border-teal ${
            error && "!bg-error-red-3 !border-error-red"
          }`}
          placeholder={!error ? placeholder : undefined}
          disabled={disabled}
        />
      )}

      {/** Normal textarea Input */}
      {!isSecret && textarea && (
        <textarea
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`min-h-[72px] max-h-[110px] w-full bg-white text-base text-black-2 p-2 border-[1px] border-[#E2E5E7] rounded-[6px] transition-all duration-250 focus:border-teal ${
            error && "!bg-error-red-3 !border-error-red"
          }`}
          placeholder={!error ? placeholder : undefined}
          disabled={disabled}
        />
      )}

      {/** Secret input */}
      {isSecret && (
        <div
          className={`h-[42px] w-full bg-white p-2 border-[1px] rounded-[6px] transition-all duration-250 overflow-hidden flex items-center gap-2 ${
            isSecretInputFocused ? "!border-teal" : "border-[#E2E5E7]"
          } ${error && "!bg-error-red-3 !border-error-red"}`}
        >
          {/** Input */}
          <input
            type={isSecretInputVisible ? "text" : "password"}
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-full outline-0 border-0 bg-transparent text-base text-black-2 "
            placeholder={!error ? placeholder : undefined}
            onFocus={() => setIsSecretInputFocused(true)}
            onBlur={() => setIsSecretInputFocused(false)}
            disabled={disabled}
          />

          {/** Eye */}
          <span
            className={`inline-block ${
              isSecretInputFocused ? "text-teal" : "text-gray-400"
            }`}
            onClick={toggleSecretInputVisibility}
          >
            {isSecretInputVisible ? <Eye size="16" /> : <EyeClosed size="16" />}
          </span>
        </div>
      )}

      {/** Error */}
      {error && (
        <span className="text-error-red-2 text-[14px] mt-[5px] mb-[10px]">
          {error}
        </span>
      )}
    </div>
  );
}
