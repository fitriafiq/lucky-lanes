# 🎰 Lucky Lanes

🎮 **[Play the Live Game Here!](https://luckylanes.fitriafiq.com)**

**Lucky Lanes** is a turn-based racing game where 4 suits (Hearts, Spades, Clubs, Diamonds) race to the finish line on a 6-space track. Players draw cards to advance their randomly assigned suits, use special "Fate's Choice" action cards to sabotage opponents or boost themselves, and dodge hidden penalty cards scattered on the track. 

Built with **Nuxt 3**, **Vue 3**, **Tailwind CSS**, and **Nuxt UI**.

---

## 🚀 Features
- **Suit Racing Mechanics:** Draw from a standard 52-card deck. The suit drawn advances by 1 space.
- **Fate's Choice Events:** Drawing a Face Card (J, Q, K) triggers strategic actions (Sprint Forward, Sabotage, Seismic Wave, Play It Safe).
- **Hidden Penalties:** 4 hidden penalty cards are placed on the track. Landing on one reveals it—if it matches the racer's suit, they are bumped back 1 space!
- **AI Opponents:** Play against an automated "Computer Sabotager" that randomly picks opponents to sabotage if it draws a Fate's Choice card.
- **Dynamic UI:** A premium, dark-mode-first 3-column game layout with real-time race logs, interactive track grid, and slide-over panels for abilities.

---

## 🛠 Tech Stack
- **Framework:** [Nuxt 3](https://nuxt.com/)
- **UI Components:** [@nuxt/ui](https://ui.nuxt.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Nuxt Icon](https://nuxt.com/modules/icon) (Phosphor Icons)
- **Package Manager:** `pnpm`

---

## 📦 Setup & Installation

Ensure you have `pnpm` installed, then run the following:

```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server
pnpm dev
```

The game will be available at [http://localhost:3000](http://localhost:3000).

---

## 🎮 How to Play
1. **Setup Phase:** Enter your player name and select a suit. Any unselected suit is automatically assigned to the "Computer Sabotager".
2. **The Race:** The game switches to the 3-column track view. Click **DRAW** to pull a card from the deck.
3. **Movement:** The racer matching the drawn card's suit moves forward 1 space.
4. **Face Cards:** If a Jack, Queen, or King is drawn, the drawing player gets a **Fate's Choice** event. Choose an action (move forward, push someone back, push everyone back, or do nothing). The Computer chooses randomly.
5. **Penalties:** 4 random penalty cards are hidden on the track. If a racer lands on a space with a penalty card matching their suit, the penalty triggers and they move backward.
6. **Winning:** The first suit to cross the `FINISH` line wins!

---

## 🏗 Project Structure

```text
lucky-lanes/
├── composables/
│   └── useGame.ts         # Core game logic, state management, and actions
├── pages/
│   └── index.vue          # Main game interface (Setup Phase & Gameplay Phase grids)
├── shared/
│   ├── constants.ts       # Centralized arrays and runtime variables (e.g., ROULETTE_OPTIONS)
│   ├── interfaces.ts      # TypeScript interfaces (Player, Card)
│   └── types/             # Distinct TS type definitions (Suit, PlayerType, RouletteEffect)
├── app.vue                # Nuxt entry layout wrapping NuxtPage
└── nuxt.config.ts         # Nuxt configuration, including auto-imports for the `shared/` directory
```

---

## 🚀 Production Build

To build the application for production:

```bash
pnpm build
```

To locally preview the generated production build:

```bash
pnpm preview
```
