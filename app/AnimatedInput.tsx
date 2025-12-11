import { UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type AnimatedInputProps = {
  id: string;
  label: string;
  type?: string;
  register: UseFormRegisterReturn;
  error?: string;

  moveFakeCursor: (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
    fromMouse: boolean
  ) => void;

  moveCursorToClickPosition: (
    e: React.MouseEvent<HTMLInputElement>
  ) => void;

  pauseCursor: (e: React.FormEvent<HTMLInputElement>) => void;
  resumeCursor: () => void;
};

export default function AnimatedInput({
  id,
  label,
  type = "text",
  register,
  error,
  moveFakeCursor,
  pauseCursor,
  resumeCursor,
  moveCursorToClickPosition,
}: AnimatedInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="w-full mb-2">
      <div className="relative">
        <input
  id={id}
  type={inputType}
  {...register}
  placeholder=" "

  // 🔥 LIVE VALIDATION TRIGGER
  onChange={(e) => {
    register.onChange(e); // ← React Hook Form validation
    pauseCursor(e);       // ← your cursor effect
  }}

  // Cursor logic
  onFocus={(e) => moveFakeCursor(e, false)}
  onMouseDown={moveCursorToClickPosition}
  onKeyUp={(e) => moveFakeCursor(e, false)}
  onBlur={resumeCursor}

  className="
    peer w-full h-12 px-5 pr-12
    font-[poppins] font-medium
    border border-[#999]
    rounded-lg outline-none caret-transparent
    text-[18px]
    focus:border-[#018FFF]
  "
/>

        {/* ✅ FLOATING LABEL */}
        <label
          htmlFor={id}
          className="
            absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1
            text-gray-400 text-[18px]
            transition-all duration-900 cursor-text

            peer-focus:top-0
            peer-focus:text-[14px]
            peer-focus:text-[#018FFF]

            peer-not-placeholder-shown:top-0
            peer-not-placeholder-shown:text-[14px]
          "
        >
          {label}
        </label>

        {/* ✅ PASSWORD EYE TOGGLE */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        )}
      </div>

      {/* ✅ Error space never collapses */}
      <p className="text-red-500 text-sm mt-1 ml-1 min-h-[20px]">
        {error || " "}
      </p>
    </div>
  );
}
