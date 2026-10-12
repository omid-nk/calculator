# Modern Calculator

A sleek, responsive calculator built with **Next.js**, **React**, and **Tailwind CSS**. Featuring a soft neumorphic-inspired design, intuitive controls, and keyboard support for a smooth user experience.

## Features

- **Modern UI** — A clean interface with soft gradients, subtle shadows, and a neumorphic-inspired design.
- **Responsive Layout** — Adapts to different screen sizes.
- **Keyboard Support** — Perform calculations using your keyboard, including numeric keypad input.
- **Internationalized Input** — Supports English, Persian, and Arabic numerals.
- **Basic Arithmetic** — Addition, subtraction, multiplication, and division.
- **Repeated Calculations** — Press equals repeatedly to apply the last operation again.
- **Input Validation** — Handles division by zero and invalid calculation results.
- **Formatted Numbers** — Adds thousands separators for improved readability.
- **Interactive Sound Effects** — Provides audio feedback for button interactions.
- **Digit Limit** — Restricts input length to keep the display manageable.

## Tech Stack

- [Next.js](https://nextjs.org/) — React framework
- [React](https://react.dev/) — UI library
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling
- [React Icons](https://react-icons.github.io/react-icons/) — Icon components

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and npm installed.

### Installation

Clone the repository:

```bash
git clone https://github.com/omid-nk/modern-calculator.git
```

Navigate to the project directory:

```bash
cd modern-calculator
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Keyboard Shortcuts

| Key                  | Action                    |
| -------------------- | ------------------------- |
| `0–9`                | Enter numbers             |
| `+`                  | Addition                  |
| `-`                  | Subtraction               |
| `*` or `X`           | Multiplication            |
| `/`                  | Division                  |
| `.` or `,`           | Decimal point             |
| `Enter` or `=`       | Calculate                 |
| `Backspace`          | Delete the last character |
| `Escape` or `Delete` | Clear the calculator      |
| `C`                  | Clear the calculator      |

## Project Structure

```text
modern-calculator/
├── public/
│   └── click.mp3
├── src/
│   └── app/
│       ├── page.jsx
│       ├── layout.jsx
│       └── globals.css
├── package.json
└── README.md
```

_The structure above is illustrative and may vary depending on your project setup._

## Customization

- **Sound Effects:** Replace `public/click.mp3` with your preferred audio file.
- **Appearance:** Customize the gradients, shadows, spacing, and colors using Tailwind CSS.
- **Input Limits:** Adjust `MAX_DIGITS` to change the maximum number of entered digits.

## License

This project is open source. Add a license file if you intend to distribute it for reuse.

---

Built with Next.js and React.
