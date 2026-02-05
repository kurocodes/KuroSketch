import { useEffect, useRef } from "react";

export default function TextEditor({
  x,
  y,
  onSubmit,
  onCancel,
}: {
  x: number;
  y: number;
  onSubmit: (text: string) => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  useEffect(() => {
    console.log("TEXT EDITOR MOUNTED");
    return () => console.log("TEXT EDITOR UNMOUNTED");
  }, []);

  return (
    <textarea
      ref={ref}
      style={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 100,
        font: "16px sans-serif",
        padding: 4,
        background: "transparent",
        border: "1px dashed #888",
        outline: "none",
        resize: "none",
        color: "inherit",
      }}
      rows={1}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const value = e.currentTarget.value.trim();
          if (value) {
            onSubmit(value);
          } else {
            onCancel();
          }
        }

        if (e.key === "Escape") {
          onCancel();
        }
      }}
    />
  );
}
