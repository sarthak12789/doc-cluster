"use client";

import { useRef } from "react";

export const useFakeCursor = () => {
  const blinkTimeout = useRef<NodeJS.Timeout | null>(null);

  const measureTextWidth = (text: string, font: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    ctx.font = font;
    return ctx.measureText(text).width;
  };

  // ------------------------
  // Helper: get visible text for measurement
  // For password inputs we measure mask characters (•) repeated to the caret index
  // This keeps caret placement matching the masked display.
  // ------------------------
  const getDisplayTextForMeasurement = (
    input: HTMLInputElement,
    textBeforeCaret: string
  ) => {
    // If input is masked (password), measure mask symbols instead of actual chars.
    if (input.type === "password") {
      // Most browsers use a bullet-like glyph. Use '•' as a reasonable approximation.
      // If you want, make this configurable or try to read -webkit-text-security.
      const maskChar = "•";
      return maskChar.repeat(textBeforeCaret.length);
    }

    // Normal input: measure actual text before caret
    return textBeforeCaret;
  };

  // ✅ Core absolute positioning (DIAGONAL SAFE)
  const moveCursor = (input: HTMLInputElement, caretIndex?: number) => {
    const cursor = document.getElementById("fake-cursor");
    if (!cursor) return;

    const form = input.form ?? input.closest("form");
    if (!form) return;

    const formRect = form.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();
    const styles = window.getComputedStyle(input);
    const font = styles.font;
    const paddingLeft = parseFloat(styles.paddingLeft || "0");

    const index = caretIndex ?? input.selectionStart ?? input.value.length;

    const textBeforeCaret = input.value.slice(0, index);

    // ⚠ Use visible string for measurement (handles password masking)
    const displayText = getDisplayTextForMeasurement(input, textBeforeCaret);
    const textWidth = measureTextWidth(displayText, font);

    const x = inputRect.left - formRect.left + paddingLeft + textWidth;

    const cursorHeight = 22;
    const y =
      inputRect.top - formRect.top + (inputRect.height - cursorHeight) / 2;

    // apply left/top for pixel perfect placement
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  };

  // ✅ FOCUS & ARROW KEYS → smooth ONLY
  const moveFakeCursor = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
    fromMouse: boolean
  ) => {
    const cursor = document.getElementById("fake-cursor");
    if (!cursor) return;

    if (fromMouse) return; // clicks handled separately
const isArrowKey =
    "key" in e &&
    ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key);
  if (isArrowKey) {
    // 🚀 Arrow keys = instant move
    cursor.classList.add("instant");
  } else {
    // 🎯 Focus = smooth move
    cursor.classList.remove("instant");
  }
    cursor.classList.remove("paused");
    cursor.classList.add("visible");

    moveCursor(e.currentTarget);
  };

  // ✅ MOUSE CLICK → INSTANT jump
  const moveCursorToClickPosition = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.currentTarget;

    requestAnimationFrame(() => {
      const cursor = document.getElementById("fake-cursor");
      if (!cursor) return;

      const caretIndex = input.selectionStart ?? input.value.length;

      cursor.classList.add("instant");
      cursor.classList.remove("paused");
      cursor.classList.add("visible");

      moveCursor(input, caretIndex);

      setTimeout(() => {
        cursor.classList.remove("instant");
      }, 50);
    });
  };

  // ✅ TYPING → instant realtime + pause blink
  const pauseCursor = (e: React.FormEvent<HTMLInputElement>) => {
    const cursor = document.getElementById("fake-cursor");
    if (!cursor) return;

    const input = e.currentTarget as HTMLInputElement;
    const caretIndex = input.selectionStart ?? input.value.length;

    cursor.classList.add("paused");
    cursor.classList.add("instant");
    cursor.classList.add("visible");

    moveCursor(input, caretIndex);

    if (blinkTimeout.current) {
      clearTimeout(blinkTimeout.current);
    }

    blinkTimeout.current = setTimeout(() => {
      cursor.classList.remove("paused");
      cursor.classList.remove("instant");
    }, 600);
  };

  // Helper you can call after toggling show/hide password to resync cursor
  const syncCursorToInput = (input: HTMLInputElement | null) => {
    if (!input) return;
    // ensure caret is up-to-date then move
    requestAnimationFrame(() => {
      moveCursor(input, input.selectionStart ?? input.value.length);
    });
  };

  // ✅ BLUR → resume blink (optionally hide)
  const resumeCursor = () => {
    const cursor = document.getElementById("fake-cursor");
    if (!cursor) return;

    cursor.classList.remove("paused");
    cursor.classList.remove("instant");
  };

  return {
    moveFakeCursor,
    moveCursorToClickPosition,
    pauseCursor,
    resumeCursor,
    // new helper: call this from your component after toggling password visibility
    syncCursorToInput,
  };
};
