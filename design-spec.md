# Design Specification: Backyard Finance Inspired Solana DeFi UI

## 1. Overview & Aesthetics
The design mirrors the aesthetic of [Backyard Finance](https://app.backyard.finance/vaults): an editorial, organic, vintage-banking and modern financial aesthetic. Rather than typical harsh neon crypto themes or standard dark modes, it features warm, textured canvas parchment tones, forest green botanical accents, delicate borders, elegant serif typography for titles, and clean tabular sans-serif/monospace for numbers.

---

## 2. Color Palette (Exact Hex Values)

| Role | Color Name | Hex Code | Description |
| :--- | :--- | :--- | :--- |
| **Canvas / Background** | Warm Parchment Sand | `#F0EFE9` | Primary page background tone |
| **Card Surface** | Soft Ivory / Cream | `#F8F7F2` | Card and modal container background |
| **Secondary Surface** | Oatmeal Muted Tint | `#E7E6DF` | Input backgrounds, tag badges, card footers |
| **Primary Border** | Muted Sandstone | `#DBD9CE` | Subtle card dividers, table borders, pills |
| **Border Subtle** | Faint Taupe | `#E8E7DF` | Inner item dividers and sub-borders |
| **Primary Accent** | Deep Botanical Pine | `#2E5627` | Primary CTAs, active buttons, health factors |
| **Primary Hover** | Dark Spruce | `#24451F` | Hover state for primary action buttons |
| **Secondary Accent** | Sage Meadow | `#DFEAD7` | Active navigation pill, APY pill highlights |
| **Secondary Accent Text** | Forest Moss | `#2D5424` | Text inside sage badges |
| **Text Primary** | Deep Charcoal Ink | `#1D221C` | Headings, high emphasis text, vault names |
| **Text Secondary** | Muted Stone Moss | `#676B61` | Secondary labels, descriptions, subtitles |
| **Text Tertiary / Muted** | Faint Stone | `#92968B` | Table headers, placeholders, helper notes |
| **Positive / Yield** | Verdant Green | `#2E8B3A` | Returns, positive yield, healthy loan ratio |
| **Warning / Risk** | Ochre Amber | `#C67D0A` | Medium health factor, slippage warnings |
| **Danger / Liquidation** | Russet Crimson | `#B9382F` | Critical health factor, errors, cancel |

---

## 3. Typography & Fonts

1. **Serif (Headings & Display)**:
   - Primary: `Instrument Serif`, `DM Serif Display`, `Georgia`, or `Newsreader` (font-serif)
   - Usage: App brand mark, Vault display names (`JupUSD`, `Syntropia USDC`), Modal titles (`Deposit / Withdraw`), section headers (`Additional Info`).
   - Style: Italicized or medium weight serif, giving a high-end Swiss/editorial finance feeling.

2. **Sans-Serif (Interface & Controls)**:
   - Primary: `DM Sans`, `Inter`, system-ui (font-sans)
   - Usage: Navigation links, button labels, descriptions, dropdowns, table cells.

3. **Monospace / Tabular (Numeric Data & Financial Metrics)**:
   - Primary: `DM Mono`, `ui-monospace`, `font-mono`
   - Usage: APY percentages (`16.35%`), TVL amounts (`$13,121,175.72`), wallet balances, token amounts.

---

## 4. Spacing & Border Radius

- **Border Radii**:
  - Main Cards: `rounded-2xl` to `rounded-3xl` (`1.25rem` to `1.5rem` / `20px` - `24px`)
  - Sub-cards / Input groups: `rounded-xl` (`0.75rem` / `12px`)
  - Floating Navigation Pill: `rounded-full` (`9999px`)
  - Buttons: `rounded-xl` (`12px`) or `rounded-full` (`9999px` for pills)
  - Asset Icons & Avatars: `rounded-full`
- **Spacing Scale**:
  - Container padding: `p-6` to `p-10` on desktop, `p-4` on mobile
  - Grid gutters: `gap-6` between cards and columns
  - Card internal padding: `p-6` to `p-8`

---

## 5. Navigation & Layout Structure

1. **Floating Pill Header**:
   - Fixed or sticky at the top with slight backdrop blur (`backdrop-blur-md bg-[#F0EFE9]/90`).
   - Left: Brand pill `[Logo icon] Nexus Vault` (`rounded-full border border-[#DBD9CE] bg-[#F8F7F2] px-4 py-2`).
   - Center: Nav pill with tabs:
     - `Vaults` (Active: `bg-[#DFEAD7] text-[#2D5424] font-medium rounded-full px-4 py-1.5`)
     - `Lend & Borrow` (`text-[#676B61] hover:text-[#1D221C] px-3 py-1.5`)
     - `Swap` (`text-[#676B61] hover:text-[#1D221C] px-3 py-1.5`)
     - `Portfolio` (`text-[#676B61] hover:text-[#1D221C] px-3 py-1.5`)
   - Right: Network badge (`Devnet` pill with pulsating dot) + Solana Wallet Connect button (`rounded-full border border-[#DBD9CE] bg-[#F8F7F2] text-[#1D221C] hover:bg-[#E7E6DF]`).

2. **Footer**:
   - Editorial vintage engraving toile watermark border, branding, links, Twitter/X, Discord, Solana Devnet status.

---

## 6. Page Structure: Vaults List (`/vaults`)

1. **Hero / Stat Cards**:
   - Total Platform TVL, User Total Deposits, Estimated 24h/Annual Yield.
   - Featured Vault Cards Carousel/Grid (e.g., Syntropia USDC, JupUSD, Raydium SOL-USDC, Kamino USDG) with vintage watermark etching effect, big serif name, APY + sparkle pill, and direct "+ Add to strategy" or "Deposit" button.
2. **Search & Filter Bar**:
   - Integrated search input with magnifying glass (`bg-transparent border border-[#DBD9CE] rounded-full`).
   - Filter dropdowns: All Protocols (Kamino, Syntropia, Jupiter, Orca), All Assets (USDC, SOL, USDG, PYUSD), Sort by APY / TVL.
3. **Vaults Table**:
   - Columns: `Vault` (icon + bold serif name + ticker), `Protocol` (protocol tag), `TVL` (value + coin stack icon), `APY` (percentage + green sparkle badge), `Action` (`+ Add to strategy` button).
   - Rows have hover effects with subtle border and row highlight.

---

## 7. Page Structure: Vault Detail (`/vaults/[id]`)

1. **Breadcrumbs / Back Button**: Link back to `/vaults`.
2. **Two-Column Layout (2/3 Left, 1/3 Right)**:
   - **Left Column**:
     - **Header Card**: Vault icon, Large serif Title (`Syntropia USDC`), tags (`Syntropia`, `Solana Devnet`, `Audited`), description paragraph, quick stats: `TVL`, `My Position`, `APY`.
     - **Performance Chart Card**:
       - Segment tabs: `Overview`, `Your position`.
       - Metric switchers: `APY`, `TVL`, `Asset price`.
       - Timeframe pills: `1W`, `1M`, `3M`, `ALL`.
       - Large current APY display (`16.35%`).
       - Area / Line chart using Recharts with smooth stroke `#2E5627`, area gradient, and dashed average reference line (`Avg 16.46%`).
     - **Strategy Allocation Breakdown**:
       - Visual progress bar / multi-segment bar showing capital allocation (e.g., Hyperliquid hedged quote, Kamino Lend, Jupiter AMM).
       - Protocol breakdown cards.
   - **Right Column (Deposit & Withdraw Panel)**:
     - Tabs: `Deposit` (active with bottom underline in serif font), `Withdraw`, `Claim`.
     - Strategy / Vault sub-preset selector.
     - Amount Input: Large font, token selector pill (`USDC ∨`), balance indicator (`Bal: 1,250.00`), quick percentage buttons (`25%`, `50%`, `75%`, `100% / MAX`).
     - Summary Rows: `Total deposited`, `Est. Annual return` (in green).
     - Primary Button: Full-width deep pine green button (`bg-[#2E5627] hover:bg-[#24451F] text-white py-3.5 rounded-xl font-medium`).
     - Expandable accordion: `Fees + slippage ⓘ`.
     - **Additional Info Card**: Performance fee (`0.00%`), Cooldown period (`Instant`), Contract Address on Devnet.

---

## 8. Page Structure: Lend & Borrow (`/lend`)
- Supply Markets & Borrow Markets side-by-side or tabbed tables.
- Visual **Health Factor Indicator** gauge (Safe > 1.5, Moderate 1.1-1.5, High Risk < 1.1).
- Quick modal/drawer for Supply, Borrow, Repay, and Withdraw with real-time health factor impact preview.

---

## 9. Page Structure: Swap (`/swap`)
- Clean, focused swap card matching Backyard styling.
- From token (balance, MAX, token selector) -> Swap flip button -> To token (estimated output).
- Slippage tolerance picker (0.1%, 0.5%, 1.0%, Custom).
- Route display (e.g. Best route via Nexus Router / Jupiter).
- Swap button with state handling (Enter Amount -> Confirm Swap -> Processing -> Success Toast).

---

## 10. Page Structure: Portfolio (`/portfolio`)
- Net Worth summary, Total Deposited, Total Borrowed, Net APY, Claimable Rewards.
- Active Positions table with real-time withdraw/claim buttons.
- Transaction history log.
