import { forwardRef, InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, ...props },
  ref
) {
  return (
    <div className="field">
      <input ref={ref} className={cn("input", error ? "input-error" : "", className)} {...props} />
      {error ? <p className="error-text">{error}</p> : null}
    </div>
  );
});
