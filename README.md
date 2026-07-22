# FinSight AI

An AI-powered portfolio risk and financial literacy dashboard that turns
portfolio data into approachable, beginner-friendly insights.

## Checkpoint 1

- Responsive portfolio dashboard
- Sample holdings and portfolio allocation
- Add and remove holdings
- Automatically recalculated portfolio totals and allocation chart
- Mock risk, diversification, performance, and AI insight cards
- Educational-only disclaimer

## Checkpoint 2

- Saves portfolio holdings in the browser with `localStorage`
- Keeps added and removed holdings after the page refreshes
- Adds an optional company or fund name field when creating a holding
- Shows a validation message when the form is incomplete
- Adds a reset button to restore the sample portfolio

## Checkpoint 3

- Adds editing for existing portfolio holdings
- Lets users update ticker, company or fund name, and amount invested
- Reuses the portfolio form for both adding and editing holdings
- Keeps edited holdings saved in browser storage after refresh
- Completes the basic portfolio CRUD flow: create, read, update, and delete

This version still uses mock data. Authentication, database storage, live market
data, calculated risk metrics, and grounded AI responses will be added in later
checkpoints.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Tech stack

- React
- TypeScript
- Vite
- CSS

## Disclaimer

FinSight AI is an educational project and does not provide financial advice.
