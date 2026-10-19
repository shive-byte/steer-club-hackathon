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
3. **Deploy to GitHub Pages**: Push changes to `main`. Enable **Settings > Pages > Build and deployment: Source -> GitHub Actions** on GitHub. The `.github/workflows/deploy-gh-pages.yml` workflow will automatically build and publish the site.
4. **Deploy SSR (Cloudflare Workers / Nitro)**: Run `npm run build` to output the full Cloudflare worker bundle.


---

### 📚 Calculation Sources & Methodology
The personalized nutritional estimates and recommended daily intake reference targets in [foods.ts](file:///d:/steer%20hackathon/steer-src/src/lib/foods.ts) are computed using the following established scientific guidelines:

1. **Basal Metabolic Rate (BMR) & Daily Calorie Estimation**:
   - **Mifflin-St Jeor Equation**: Recognized as one of the most reliable predictive equations for resting metabolic rate in clinical settings:
     $$\text{BMR (men)} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age} + 5$$
     $$\text{BMR (women)} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age} - 161$$
   - Total daily energy expenditure (TDEE) is calculated by multiplying BMR by physical activity factors ($1.2$ sedentary to $1.9$ highly active).
   - *Source*: Mifflin, M. D., et al. (1990). *"A new predictive equation for resting energy expenditure in healthy individuals."* The American Journal of Clinical Nutrition, 51(2), 241-247.

2. **Recommended Dietary Allowances (RDA) for Indians (Protein & Fibre)**:
   - **Protein Requirements**: Calibrated at **$\sim 0.83 \text{ g/kg body weight/day}$** as per the revised ICMR-NIN nutritional norms for Indian adults.
   - **Dietary Fibre**: Set at a guideline of **$\sim 30 \text{ g per } 2000 \text{ kcal}$** to support glycemic control and cardiovascular health.
   - *Source*: **ICMR-NIN (2020)**. *"Nutrient Requirements for Indians — Recommended Dietary Allowances (RDA) and Estimated Average Requirements (EAR)"*, National Institute of Nutrition, Indian Council of Medical Research.

3. **Food Composition & Portion Estimates**:
   - Macronutrient profiles (calories, protein, carbs, fat, and dietary fibre) for common Indian meal items (rotis, parathas, dal, paneer sabzi, curd, chicken curry) are adapted from:
     - **IFCT 2017**: Longvah, T., et al. *"Indian Food Composition Tables"*, National Institute of Nutrition (ICMR).

