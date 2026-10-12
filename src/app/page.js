"use client";

import { useCallback, useEffect, useState } from "react";
import { IoBackspaceOutline } from "react-icons/io5";

const MAX_DIGITS = 16;

// Normalize calculation results to avoid common floating-point artifacts.
function formatResult(value) {
  if (!Number.isFinite(value)) return "Error";

  return String(Number(value.toPrecision(15)));
}

// Keep arithmetic in one place so button and keyboard input share the same behavior.
function calculate(first, second, operator) {
  const a = Number(first);
  const b = Number(second);

  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return "Error";
  }

  let result;

  switch (operator) {
    case "+":
      result = a + b;
      break;

    case "-":
      result = a - b;
      break;

    case "x":
      result = a * b;
      break;

    case "÷":
      if (b === 0) return "Error";
      result = a / b;
      break;

    default:
      return "Error";
  }

  return formatResult(result);
}

// Add thousands separators for display without changing the stored value.
function formatDisplay(value) {
  if (value === null || value === "Error") return value;

  const [integerPart, decimalPart] = value.split(".");

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
}

export default function Page() {
  const [display, setDisplay] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [secondValue, setSecondValue] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false);

  // Preserve the last operation so pressing equals again repeats it.
  const [repeatOperator, setRepeatOperator] = useState(null);
  const [repeatOperand, setRepeatOperand] = useState(null);

  // Handle all calculator input through a single entry point.
  const handleButtonClick = useCallback(
    (value) => {
      const audio = new Audio("/click.mp3");
      audio.play().catch(() => {});

      if (value.type === "number") {
        const label = value.label;

        // Start a new entry after a result or a calculation error.
        if (isCalculated || display === "Error") {
          setDisplay(label === "." ? "0." : label);
          setPreviousValue(null);
          setOperator(null);
          setSecondValue(null);
          setIsCalculated(false);
          setRepeatOperator(null);
          setRepeatOperand(null);
          return;
        }

        // Allow only one decimal point per number.
        if (label === ".") {
          if (display === null) {
            setDisplay("0.");
          } else if (!display.includes(".")) {
            setDisplay(`${display}.`);
          }

          return;
        }

        // Limit the number of entered digits to keep the display manageable.
        const digitCount = (display ?? "").replace(/\D/g, "").length;

        if (digitCount >= MAX_DIGITS) return;

        setDisplay(display === null ? label : display + label);
        return;
      }

      if (value.type === "clear") {
        // Reset the current expression and any pending repeated operation.
        setDisplay(null);
        setPreviousValue(null);
        setOperator(null);
        setSecondValue(null);
        setIsCalculated(false);
        setRepeatOperator(null);
        setRepeatOperand(null);
        return;
      }

      if (value.type === "backspace") {
        if (display === "Error") {
          setDisplay(null);
          setPreviousValue(null);
          setOperator(null);
          setSecondValue(null);
          setIsCalculated(false);
          setRepeatOperator(null);
          setRepeatOperand(null);
          return;
        }

        // Editing a result starts a fresh expression.
        if (isCalculated) {
          setPreviousValue(null);
          setOperator(null);
          setSecondValue(null);
          setIsCalculated(false);
          setRepeatOperator(null);
          setRepeatOperand(null);
        }

        if (display !== null) {
          setDisplay(display.slice(0, -1) || null);
        }

        return;
      }

      if (value.type === "operator") {
        if (display === "Error") return;

        // Use the displayed result as the first operand of the next operation.
        if (isCalculated && display !== null) {
          setPreviousValue(display);
          setOperator(value.label);
          setSecondValue(null);
          setDisplay(null);
          setIsCalculated(false);
          setRepeatOperator(null);
          setRepeatOperand(null);
          return;
        }

        // Allow the operator to be changed before entering the second operand.
        if (display === null) {
          if (previousValue !== null) {
            setOperator(value.label);
          }

          return;
        }

        // Evaluate pending operations immediately, using left-to-right chaining.
        if (previousValue !== null && operator !== null) {
          const result = calculate(previousValue, display, operator);

          if (result === "Error") {
            setDisplay("Error");
            setPreviousValue(null);
            setOperator(null);
            setSecondValue(null);
            setIsCalculated(true);
            setRepeatOperator(null);
            setRepeatOperand(null);
            return;
          }

          setPreviousValue(result);
          setDisplay(null);
          setOperator(value.label);
          setSecondValue(null);
          setRepeatOperator(null);
          setRepeatOperand(null);
          return;
        }

        setPreviousValue(display);
        setOperator(value.label);
        setSecondValue(null);
        setDisplay(null);
        setRepeatOperator(null);
        setRepeatOperand(null);
        return;
      }

      if (value.type === "equals") {
        // Repeat the previous operation when equals is pressed again.
        if (isCalculated) {
          if (
            display === null ||
            repeatOperator === null ||
            repeatOperand === null ||
            display === "Error"
          ) {
            return;
          }

          const result = calculate(display, repeatOperand, repeatOperator);

          setSecondValue(repeatOperand);
          setDisplay(result);
          setIsCalculated(true);
          return;
        }

        // Ignore equals until both operands and an operator are available.
        if (display === null || previousValue === null || operator === null) {
          return;
        }

        const result = calculate(previousValue, display, operator);

        setSecondValue(display);
        setRepeatOperator(operator);
        setRepeatOperand(display);
        setDisplay(result);
        setIsCalculated(true);
      }
    },
    [
      display,
      previousValue,
      operator,
      isCalculated,
      repeatOperator,
      repeatOperand,
    ],
  );

  useEffect(() => {
    function handleKeyDown(event) {
      // Leave browser and OS shortcuts untouched.
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      let button = null;

      // Normalize Persian and Arabic numerals to standard digits.
      const normalizeDigit = (key) => {
        const digits = {
          "۰": "0",
          "۱": "1",
          "۲": "2",
          "۳": "3",
          "۴": "4",
          "۵": "5",
          "۶": "6",
          "۷": "7",
          "۸": "8",
          "۹": "9",
          "٠": "0",
          "١": "1",
          "٢": "2",
          "٣": "3",
          "٤": "4",
          "٥": "5",
          "٦": "6",
          "٧": "7",
          "٨": "8",
          "٩": "9",
        };

        return digits[key] ?? key;
      };

      const digit = normalizeDigit(event.key);

      // Map physical keyboard input to the same actions used by the buttons.
      if (/^[0-9]$/.test(digit)) {
        button = { label: digit, type: "number" };
      } else if (
        event.key === "." ||
        event.key === "," ||
        event.code === "NumpadDecimal"
      ) {
        button = { label: ".", type: "number" };
      } else if (event.key === "+" || event.code === "NumpadAdd") {
        button = { label: "+", type: "operator" };
      } else if (event.key === "-" || event.code === "NumpadSubtract") {
        button = { label: "-", type: "operator" };
      } else if (
        event.key === "*" ||
        event.code === "NumpadMultiply" ||
        event.code === "KeyX"
      ) {
        button = { label: "x", type: "operator" };
      } else if (event.key === "/" || event.code === "NumpadDivide") {
        button = { label: "÷", type: "operator" };
      } else if (event.key === "Enter" || event.key === "=") {
        button = { label: "=", type: "equals" };
      } else if (event.key === "Backspace") {
        button = { label: "Backspace", type: "backspace" };
      } else if (
        event.key === "Escape" ||
        event.key === "Delete" ||
        event.key.toLowerCase() === "c"
      ) {
        button = { label: "C", type: "clear" };
      }

      if (button) {
        event.preventDefault();
        handleButtonClick(button);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleButtonClick]);

  const buttons = [
    { label: "7", type: "number" },
    { label: "8", type: "number" },
    { label: "9", type: "number" },
    { label: "÷", type: "operator" },
    { label: "4", type: "number" },
    { label: "5", type: "number" },
    { label: "6", type: "number" },
    { label: "x", type: "operator" },
    { label: "1", type: "number" },
    { label: "2", type: "number" },
    { label: "3", type: "number" },
    { label: "-", type: "operator" },
    {
      label: <IoBackspaceOutline className="text-2xl" />,
      type: "backspace",
    },
    { label: "0", type: "number" },
    { label: ".", type: "number" },
    { label: "+", type: "operator" },
    { label: "C", type: "clear" },
    { label: "=", type: "equals" },
  ];

  return (
    <main className="flex w-xs flex-col gap-3 rounded-4xl bg-stone-100 bg-linear-to-br from-[#f3e9e8] via-[#d8c9c9] to-[#aa9b9f] p-4 shadow-lg shadow-stone-900/10 select-none sm:w-sm">
      {/* Display */}
      <section
        aria-live="polite"
        aria-atomic="true"
        className="flex h-26 min-w-0 flex-col items-end justify-end gap-2 overflow-hidden rounded-3xl bg-zinc-100 p-4 font-bold text-zinc-900 shadow-md shadow-zinc-900/10"
      >
        <div className="flex max-w-full flex-wrap justify-end gap-1 text-xs font-normal text-zinc-400">
          {previousValue !== null && <span>{previousValue}</span>}
          {operator && <span>{operator}</span>}
          {secondValue !== null && <span>{secondValue}</span>}
          {isCalculated && <span>=</span>}
        </div>

        {display !== null && (
          <p
            className="w-full truncate text-right leading-tight tabular-nums"
            style={{
              // Scale the text down as the displayed value gets longer.
              fontSize: `clamp(12px, ${Math.min(
                24,
                240 / Math.max(display.length, 1),
              )}px, 24px)`,
            }}
          >
            {formatDisplay(display)}
          </p>
        )}
      </section>

      {/* Buttons */}
      <section className="grid grid-cols-4 grid-rows-5 gap-0.5 rounded-3xl border border-white/50 bg-linear-to-br from-[#fdf7f9]/80 via-[#f5e8ec]/75 to-[#e8d5dc]/85 p-3 shadow-md shadow-zinc-900/10">
        {buttons.map((btn, index) => (
          <button
            key={`${btn.type}-${index}`}
            type="button"
            aria-label={
              btn.type === "backspace"
                ? "Backspace"
                : btn.type === "clear"
                  ? "Clear"
                  : btn.type === "equals"
                    ? "Calculate"
                    : String(btn.label)
            }
            onClick={() => handleButtonClick(btn)}
            className={`m-1 flex min-h-11 min-w-0 cursor-pointer items-center justify-center rounded-xl border border-white/70 bg-linear-to-br from-white/90 via-[#fff7fa]/85 to-[#f3dfe6]/80 p-2 text-lg font-bold text-zinc-600 shadow-[0_2px_5px_rgba(190,130,150,0.12),inset_0_1px_2px_rgba(255,255,255,0.9)] backdrop-blur-sm transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 active:translate-y-0.5 active:shadow-inner sm:min-h-16 sm:min-w-0 ${
              btn.type === "equals" ? "col-span-3 bg-rose-300 text-white" : ""
            }`}
          >
            {btn.label}
          </button>
        ))}
      </section>
    </main>
  );
}
