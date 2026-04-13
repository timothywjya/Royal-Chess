# ♔ Royal Chess

A premium chess game built with **Next.js 15**, featuring an intelligent AI opponent with 5 difficulty levels.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Chess Logic | chess.js |
| Animation | CSS + Tailwind |
| Fonts | Google Fonts (Cinzel + Crimson Pro) |
| Deployment | Vercel |

## Features

- ♟ **5 Difficulty Levels**: Easy → Medium → Hard → Extreme → Insane
- 🤖 **AI Engine**: Minimax + Alpha-Beta Pruning with Piece-Square Tables
- ♻ **Full Chess Rules**: Castling, en passant, pawn promotion, stalemate, draw
- 📊 **Evaluation Bar**: Real-time position assessment
- 📜 **Move History**: Full algebraic notation (SAN)
- ♙ **Captured Pieces**: With material advantage count
- 🔄 **Board Flip**: Play from either side
- ↩ **Undo Move**: Take back your last move
- 👥 **2-Player Mode**: Local multiplayer (PvP)
- 📱 **Responsive**: Works on mobile and desktop

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/royal-chess.git
cd royal-chess

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Click **Deploy** — Vercel auto-detects Next.js

No environment variables needed. Works out of the box!

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout, fonts, metadata
│   ├── page.tsx          # Home page entry
│   └── globals.css       # Global styles
├── components/chess/
│   ├── ChessGame.tsx     # Main layout component
│   ├── ChessBoard.tsx    # 8×8 board renderer
│   ├── ChessSquare.tsx   # Individual square
│   ├── DifficultySelector.tsx
│   ├── GameStatus.tsx    # Status + eval bar
│   ├── MoveHistory.tsx   # SAN move list
│   ├── CapturedPieces.tsx
│   └── GameControls.tsx  # New game, undo, flip
├── hooks/
│   └── useGameStore.ts   # Zustand game state
├── lib/
│   ├── chessEngine.ts    # Minimax AI engine
│   └── constants.ts      # Piece tables, config
└── types/
    └── chess.ts          # TypeScript interfaces
```

## AI Difficulty Details

| Level | Depth | Description |
|-------|-------|-------------|
| Easy | 1 ply | Random moves 40% of the time |
| Medium | 2 ply | Occasional random moves (15%) |
| Hard | 3 ply | Pure minimax |
| Extreme | 4 ply | Minimax + move ordering |
| Insane | 5 ply | Full alpha-beta, strongest |