import { UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState,useRef } from "react";

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
  syncCursorToInput?: (input: HTMLInputElement | null) => void;
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
   syncCursorToInput, 
}: AnimatedInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [lockInput, setLockInput] = useState(false);
  const isPassword = type === "password";
  
  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type;
const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="w-full mb-2">
      <div className="relative">
        <input
  id={id}
  type={inputType}
  {...register}
  ref={(el) => {
            inputRef.current = el;
            register.ref && register.ref(el);
          }}
  placeholder=" "

  // 🔥 LIVE VALIDATION TRIGGER
  onChange={(e) => {
    register.onChange(e); // ← React Hook Form validation
    pauseCursor(e);       // ← your cursor effect
  }}

  // Cursor logic
onFocus={(e) => {
  if (lockInput) return; // block fast double tap

  setLockInput(true);
  setTimeout(() => setLockInput(false), 900); // unlock after animation

  moveFakeCursor(e, false);
}}

  onMouseDown={moveCursorToClickPosition}
  onKeyUp={(e) => moveFakeCursor(e, false)}
  onBlur={resumeCursor}

  className={`
  peer w-full h-12 px-5 pr-12
  font-[poppins] font-medium
  border rounded-lg outline-none
  text-[18px] transition-all duration-900

  caret-transparent 

  ${error ? "border-red-500" : "border-[#999]"}
  ${!error ? "focus:border-[#018FFF]" : "focus:border-red-500"}
`}


/>

        {/* ✅ FLOATING LABEL */}
        <label
          htmlFor={id}
          className={`
  absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1
  text-[18px] text-gray-400
  transition-all duration-900 cursor-text

  peer-focus:top-0
  peer-focus:text-[14px]
  
${!error ? "peer-focus:text-[#018FFF]" : "peer-focus:text-red-500"}
  peer-not-placeholder-shown:top-0
  peer-not-placeholder-shown:text-[14px]
 ${error ? "peer-focus:text-red-500 peer-not-placeholder-shown:text-red-500" : ""}
`}

        >
          {label}
         </label>
      {/*  <label
  htmlFor={id}
  className={`
    absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1
    text-[18px] transition-all duration-900 cursor-text

    peer-focus:top-0
    peer-focus:text-[14px]

    peer-not-placeholder-shown:top-0
    peer-not-placeholder-shown:text-[14px]

    ${error ? "text-red-500" : "text-gray-400"}
    ${!error ? "peer-focus:text-[#018FFF]" : ""}
    ${error ? "peer-focus:text-red-500 peer-not-placeholder-shown:text-red-500" : ""}
  `}
>
  {label}
</label> */}


        {/* ✅ PASSWORD EYE TOGGLE */}
        {isPassword && (
          <button
            type="button"
            onClick={() => {
  setShowPassword(prev => !prev);

  // 🔥 sync cursor after DOM updates input.type
  requestAnimationFrame(() => {
    syncCursorToInput?.(inputRef.current);
  });
}}

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
