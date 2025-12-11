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

    const index =
      caretIndex ?? input.selectionStart ?? input.value.length;

    const textBeforeCaret = input.value.slice(0, index);
    const textWidth = measureTextWidth(textBeforeCaret, font);

    const x =
      inputRect.left -
      formRect.left +
      paddingLeft +
      textWidth;

    const cursorHeight = 22;
    const y =
      inputRect.top -
      formRect.top +
      (inputRect.height - cursorHeight) / 2;

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

    cursor.classList.remove("instant");
    cursor.classList.remove("paused");
    cursor.classList.add("visible");

    moveCursor(e.currentTarget);
  };

  // ✅ MOUSE CLICK → INSTANT jump
  const moveCursorToClickPosition = (
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    const input = e.currentTarget;

    requestAnimationFrame(() => {
      const cursor = document.getElementById("fake-cursor");
      if (!cursor) return;

      const caretIndex =
        input.selectionStart ?? input.value.length;

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

    const input = e.currentTarget;
    const caretIndex =
      input.selectionStart ?? input.value.length;

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
  };
};
