"use client";

import Image1 from "@/app/assets/image1.svg";
import Image2 from "@/app/assets/image2.svg";
import Image3 from "@/app/assets/image3.svg";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const slides = [
  {
    image: Image1,
    heading: "All Your Documents, Organized Automatically",
    paragraph:
      "Doc Cluster intelligently groups, tags, and arranges all your documents - so you never waste time searching.",
  },
  {
    image: Image2,
    heading: "Lightning-Fast Search & Smart AI Tools",
    paragraph:
      "Find any file in seconds with powerful search, filters, and AI-based content discovery.",
  },
  {
    image: Image3,
    heading: "Secure, Private & Always Accessible",
    paragraph:
      "Your files are encrypted, synced across devices, and protected with top-grade security.",
  },
];

export default function LeftAuthSection() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [autoAnimate, setAutoAnimate] = useState(false);
  const [action, setAction] = useState<"auto" | "left" | "right">("auto");
  const resumeTimer = useRef<NodeJS.Timeout | null>(null);

  // ✅ AUTO SLIDE
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setAutoAnimate(true);
      setAction("right"); // auto behaves like RIGHT
      setPrevIndex(index);
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, index]);

  // ✅ AUTO RESUME AFTER IDLE
  const startAutoResumeTimer = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);

    resumeTimer.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  // ✅ NEXT (RIGHT CLICK)
  const nextSlide = () => {
    setIsPaused(true);
    setAutoAnimate(true);
    setAction("right");
    setPrevIndex(index);
    setIndex((prev) => (prev + 1) % slides.length);
    startAutoResumeTimer();
  };

  // ✅ PREVIOUS (LEFT CLICK)
  const prevSlide = () => {
    setIsPaused(true);
    setAutoAnimate(true);
    setAction("left");
    setPrevIndex(index);
    setIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
    startAutoResumeTimer();
  };

  return (
    <div className="w-[1028px] min-h-screen bg-[#062B4E] text-white flex flex-col items-center justify-start pt-[88px] px-0 relative">

      <h2 className="font-[Poppins] text-[#BFBFBF] font-semibold text-[32px] mb-10">
        Why Choose Us
      </h2>
<button className="absolute left-14.5 top-10 z-20 cursor-pointer">
          <ChevronLeft size={32} />
        </button>
      {/* ✅ STACKED IMAGE SLIDER */}
      <div className="relative w-full h-[270px] overflow-hidden mb-8 flex items-center justify-center">
      
        {/* Left Arrow */}
        <button onClick={prevSlide} className="absolute left-10 z-20 cursor-pointer">
          <ChevronLeft size={32} />
        </button>

        {/* ✅ OLD IMAGE (ANIMATES OUT) */}
        {autoAnimate && (
          <img
            key={`prev-${prevIndex}`}
            src={slides[prevIndex].image.src}
            alt="prev"
            className={`absolute w-full h-full object-contain z-0 ${
              action === "left"
                ? "slide-out-right  "// ✅ LEFT → OLD slides right + fades
                : "fade-out"        // ✅ RIGHT → OLD only fades
            }`}
          />
        )}

        {/* ✅ NEW IMAGE */}
        <img
          key={`current-${index}`}
          src={slides[index].image.src}
          alt="current"
         className={`absolute w-full h-full object-contain z-10 ${
    action === "right"
      ? "slide-in-right"   // ✅ RIGHT → slides in
      : action === "left"
      ? "fade-in-slow"     // ✅ LEFT → fades in slowly
      : ""                 // ✅ default
  }`}
        />

        {/* Right Arrow */}
        <button onClick={nextSlide} className="absolute right-10 z-20 cursor-pointer">
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Heading */}
      <h3 className="font-[Poppins] font-bold text-[24px] text-[#FFF] leading-[100%] text-center mb-4 max-w-[480px] min-h-[72px]">
        {slides[index].heading}
      </h3>

      {/* Paragraph */}
      <p className="font-[Poppins] font-medium text-[17px] leading-[100%] text-center text-white mx-20">
        {slides[index].paragraph}
      </p>

      {/* Slider Dots */}
      <div className="flex gap-2 mt-11.5">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-12 bg-white" : "w-5 bg-white/50"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
