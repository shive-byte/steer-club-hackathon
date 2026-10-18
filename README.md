# Build Your Plate 🍛 — 60-Second Indian Meal Check by Steer

An interactive, doctor-led nutrition check designed for Indian meals. Users build their everyday thali in seconds, see estimated calories, macronutrients (protein, carbs, fat), and dietary fibre based on **ICMR-NIN** data, and can request a personalized clinical consultation with Steer's doctors and nutritionists.

---

## ✨ Features

- **🍛 Interactive Thali Builder**: Tap to add rotis, rice, dals, paneer, sabzis, curd, and non-veg items with portion-accurate estimates.
- **🌿 Doctor-Led Insights**: Instant feedback highlighting meal wins ("What's working") and practical, realistic swaps ("Easy next steps").
- **📊 Daily Needs Calculator**: Personalized daily calorie, protein, and fibre reference targets using the Mifflin-St Jeor and ICMR-NIN equations.
- **🩺 Clinical Consultation Booking**: Users can request a free 15-minute consultation with Steer doctors & nutritionists. Their plate analysis is automatically attached so the clinical team is prepared before calling.
- **💬 Direct WhatsApp Connect**: One-click action to chat with Steer Health with pre-formatted thali stats.
- **🗄️ Neon Serverless PostgreSQL Integration**:
  - `plate_interactions`: Automatically records meal sessions, portion counts, macros, and clinical insights.
  - `consultations`: Stores user contact details, preferred call times, health goals, and a foreign-key link to their plate interaction.

---

## 🛠️ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (Full-stack React with SSR & Server Functions)
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Radix UI, Sonner (Toasts)
- **Database**: [Neon](https://neon.tech) Serverless PostgreSQL (`@neondatabase/serverless`)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- `npm`

### 1. Clone the repository

```sh
git clone <repository-url>
cd steer-src
```

### 2. Environment Configuration

Create a `.env` file in the project root (you can copy `.env.example`):

```sh
cp .env.example .env
```

Configure your environment variables in `.env`:

```env
# Neon PostgreSQL Connection String
DATABASE_URL=postgresql://neondb_owner:<password>@<host>/neondb?sslmode=require&channel_binding=require

# WhatsApp Support Number (e.g., +919876543210)
VITE_WHATSAPP_NUMBER=+919876543210
WHATSAPP_NUMBER=+919876543210
```

### 3. Install Dependencies

> [!NOTE]
> Use `--legacy-peer-deps` due to React 19 / TanStack Start peer resolution in npm v10:

```sh
npm install --legacy-peer-deps
```

### 4. Run Locally

```sh
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📦 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server with local API middleware |
| `npm run build` | Builds client and SSR bundles for production |
| `npm run preview` | Previews the production build locally |
| `npm run test` | Runs the Vitest test suite |
| `npm run lint` | Runs ESLint |
| `npm run format` | Formats files with Prettier |

---

## 🗄️ Database Schema

The app connects to a **Neon PostgreSQL** database with the following structure:

### `plate_interactions`
| Column | Type | Description |
| --- | --- | --- |
| `id` | `UUID` | Primary key (`gen_random_uuid()`) |
| `selected_items` | `JSONB` | Food item quantities (e.g. `{ roti: 2, dal: 1 }`) |
| `total_kcal` | `NUMERIC(7,1)` | Estimated total calories |
| `protein` | `NUMERIC(7,1)` | Protein in grams |
| `carbs` | `NUMERIC(7,1)` | Carbohydrates in grams |
| `fat` | `NUMERIC(7,1)` | Fat in grams |
| `fibre` | `NUMERIC(7,1)` | Dietary fibre in grams |
| `item_count` | `INT` | Total number of portions |
| `insights` | `JSONB` | Generated wins and suggestions |
| `profile` | `JSONB` | Optional user profile (age, weight, height, sex) |
| `created_at` | `TIMESTAMPTZ` | Timestamp when plate was calculated |

### `consultations`
| Column | Type | Description |
| --- | --- | --- |
| `id` | `UUID` | Primary key (`gen_random_uuid()`) |
| `interaction_id` | `UUID` | Foreign key referencing `plate_interactions(id)` |
| `name` | `VARCHAR(255)` | User's full name |
| `phone` | `VARCHAR(50)` | Mobile / WhatsApp number |
| `email` | `VARCHAR(255)` | Optional email address |
| `health_goal` | `VARCHAR(100)` | Selected health goal (Weight Loss, Diabetes, PCOS, etc.) |
| `preferred_time` | `VARCHAR(100)` | Preferred consultation time slot |
| `notes` | `TEXT` | Notes or questions for the doctor |
| `plate_summary` | `JSONB` | Snapshot of calories, protein, and food items |
| `created_at` | `TIMESTAMPTZ` | Submission timestamp |

---

## 🔒 Security & Privacy

- All database queries use parameterized SQL templates via `@neondatabase/serverless` to prevent SQL injection.
- Database credentials and secrets are kept server-side in `.env` (ignored by git).
- Cross-Site Request Forgery (CSRF) protection is enabled for all server actions.
