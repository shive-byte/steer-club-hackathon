# Build Your Plate 🍛 — 60-Second Indian Meal Check by Steer

An interactive, doctor-led nutrition check tailored for everyday Indian meals. Users configure their thali in seconds, review macro breakdowns (calories, protein, carbs, fat, fibre) mapped to ICMR-NIN nutritional standards, receive clinical suggestions, and book a consultation with Steer health professionals.

---

### 📱 Target Device & Browser
- **Devices**: Mobile-first design (smartphones & tablets on iOS & Android), fully responsive across desktop browsers.
- **Browsers**: Modern evergreen browsers — Chrome, Safari, Firefox, Edge, and mobile in-app webviews (WhatsApp, Instagram).

### 🚦 Completion Status
- **Status**: **Complete & Production-Ready**
  - Interactive Thali builder & nutrition breakdown engine functional.
  - Doctor-led insights & daily target calculators active.
  - Booking flow & WhatsApp direct connect integrated.
  - Serverless API endpoints & Neon PostgreSQL persistence implemented for both plate interactions and consultations.
  - SSR and client bundles build cleanly with zero errors.

### ⚡ Trigger
- **User Entry Points**:
  - Direct campaign landing via social media / ad creatives (standalone challenge dialog hook).
  - Web search / direct referral seeking quick Indian thali calorie and protein checks.
  - WhatsApp health check links and clinical outreach promotions.

### 💎 Value Delivered
- **For Users**: Instant, culturally relevant nutritional clarity for everyday Indian food (rotis, dal, sabzi, curd, paneer, non-veg) with zero calorie-counting fatigue and practical doctor tips.
- **For Steer Health**: Contextual lead generation — users arrive at consultation bookings with their dietary habits and macro profile already logged, making initial clinical consultations highly personalized and high-converting.

### ⏩ Next Step
1. **Configure Database**: Add your Neon PostgreSQL connection string to `.env` (`DATABASE_URL=...`).
2. **Start Dev Server**: Run `npm run dev` and open `http://localhost:8080`.
3. **Deploy**: Deploy to Cloudflare Workers / Nitro hosting via `npm run build`.
