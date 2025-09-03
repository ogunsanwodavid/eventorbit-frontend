"use client";

import { Dispatch, SetStateAction, ReactNode, useState } from "react";

import Eye from "../icons/Eye";
import EyeClosed from "../icons/EyeClosed";
import Location from "../icons/Location";

interface InputProps {
  className?: string;
  inputClassName?: string;
  name: string;
  label: string | ReactNode;
  labelRightComponent?: ReactNode;
  placeholder?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  error?: string;
  isSecret?: boolean;
  isLocation?: boolean;
  disabled?: boolean;
  textarea?: boolean;
  maxLength?: number;
  isInputFocused?: boolean;
  setIsInputFocused?: (arg: boolean) => void;
}

export default function Input({
  className,
  inputClassName,
  name,
  label,
  labelRightComponent,
  placeholder,
  value,
  setValue,
  error,
  isSecret,
  isLocation,
  disabled,
  textarea,
  maxLength,
  setIsInputFocused,
}: InputProps) {
  //Check if secret input is focused  and visible
  const [isSecretInputFocused, setIsSecretInputFocused] = useState(false);
  const [isSecretInputVisible, setIsSecretInputVisible] = useState(false);

  //Check if location input is focused
  const [isLocationInputFocused, setIsLocationInputFocused] = useState(false);

  //Secret input visibility toggler
  function toggleSecretInputVisibility() {
    setIsSecretInputVisible((prevState) => !prevState);
  }

  //Handle when inputs are focused
  function handleFocus() {
    if (!setIsInputFocused) return;

    //For normal and textarea inputs
    if (!isSecret && !isLocation) {
      setIsInputFocused(true);
    }

    //For secret inputs
    if (isSecret && !isLocation) {
      setIsInputFocused(true);
      setIsSecretInputFocused(true);
    }

    //For location inputs
    if (isLocation && !isSecret) {
      setIsInputFocused(true);
      setIsLocationInputFocused(true);
    }
  }

  //Handle when inputs are blurred
  function handleBlur() {
    if (!setIsInputFocused) return;

    //For normal and textarea inputs
    if (!isSecret && !isLocation) {
      setIsInputFocused(false);
    }

    //For secret inputs
    if (isSecret && !isLocation) {
      setIsInputFocused(false);
      setIsSecretInputFocused(false);
    }

    //For location inputs
    if (isLocation && !isSecret) {
      setIsInputFocused(false);
      setIsLocationInputFocused(false);
    }
  }

  return (
    <div className={`w-full mb-[15px] ${className}`}>
      {/** Header */}
      <header className="flex items-center justify-between">
        <label
          htmlFor={name}
          className={`w-full block text-[15px] text-black-2 mb-2 ${
            error && "!text-error-red-2"
          }`}
        >
          {label}
        </label>

        {labelRightComponent}
      </header>

      {/** Normal non-textarea Input */}
      {!isSecret && !isLocation && !textarea && (
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`h-[42px] w-full bg-white text-[15px] text-black-2 p-2 border-[1px] border-[#E2E5E7] rounded-[6px] transition-all duration-250 focus:border-teal ${
            error && "!bg-error-red-3 !border-error-red"
          } ${inputClassName}`}
          placeholder={!error ? placeholder : undefined}
          disabled={disabled}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}

      {/** Normal textarea Input */}
      {!isSecret && !isLocation && textarea && (
        <textarea
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`min-h-[72px] max-h-[110px] w-full bg-white text-[15px] text-black-2 p-2 border-[1px] border-[#E2E5E7] rounded-[6px] transition-all duration-250 focus:border-teal ${
            error && "!bg-error-red-3 !border-error-red"
          } ${inputClassName}`}
          placeholder={!error ? placeholder : undefined}
          disabled={disabled}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}

      {/** Secret input */}
      {isSecret && !isLocation && (
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
            className={`w-full h-full outline-0 border-0 bg-transparent text-[15px] text-black-2 ${inputClassName}`}
            placeholder={!error ? placeholder : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            maxLength={maxLength}
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

      {/** Location input */}
      {!isSecret && isLocation && (
        <div
          className={`h-[42px] w-full bg-white p-2 border-[1px] rounded-[6px] transition-all duration-250 overflow-hidden flex items-center gap-3 ${
            isLocationInputFocused ? "!border-teal" : "border-[#E2E5E7]"
          } ${error && "!bg-error-red-3 !border-error-red"}`}
        >
          {/** Location icon */}
          <span
            className={`inline-block ${
              isLocationInputFocused ? "text-teal" : "text-gray-400"
            }`}
          >
            <Location size="16" />
          </span>

          {/** Input */}
          <input
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`w-full h-full outline-0 border-0 bg-transparent text-[15px] text-black-2 -mt-0.5 ${inputClassName}`}
            placeholder={!error ? placeholder : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            maxLength={maxLength}
          />
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
