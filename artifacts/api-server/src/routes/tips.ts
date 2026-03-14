import { Router, type IRouter } from "express";

const router: IRouter = Router();

const healthTips = [
  { id: 1, category: "nutrition", title: "Eat a Rainbow", content: "Include colorful fruits and vegetables in every meal. Different colors provide different phytonutrients and antioxidants your body needs.", icon: "🥗" },
  { id: 2, category: "nutrition", title: "Stay Hydrated", content: "Drink at least 8 glasses (2 liters) of water daily. Proper hydration supports every organ system in your body.", icon: "💧" },
  { id: 3, category: "exercise", title: "Move Every Hour", content: "Take a short 5-minute walk or stretch break every hour during sedentary work. This reduces the risks associated with prolonged sitting.", icon: "🚶" },
  { id: 4, category: "exercise", title: "Strength Training", content: "Include resistance training 2-3 times per week. Building muscle mass improves metabolism, bone density, and overall functional fitness.", icon: "💪" },
  { id: 5, category: "sleep", title: "Consistent Sleep Schedule", content: "Go to bed and wake up at the same time every day, even on weekends. A consistent schedule regulates your body's internal clock.", icon: "😴" },
  { id: 6, category: "sleep", title: "Create a Sleep Sanctuary", content: "Keep your bedroom cool, dark, and quiet. Avoid screens for at least an hour before bed to improve sleep quality.", icon: "🌙" },
  { id: 7, category: "mental_health", title: "Practice Mindfulness", content: "Spend 10 minutes daily in meditation or deep breathing exercises. Regular mindfulness practice reduces stress and improves emotional wellbeing.", icon: "🧘" },
  { id: 8, category: "mental_health", title: "Connect With Others", content: "Maintain strong social connections. Regular meaningful interactions with friends and family are linked to better mental and physical health outcomes.", icon: "🤝" },
  { id: 9, category: "hydration", title: "Morning Hydration Ritual", content: "Start every day with a large glass of water before coffee or breakfast. This kickstarts your metabolism and rehydrates after sleep.", icon: "🌅" },
  { id: 10, category: "prevention", title: "Regular Health Screenings", content: "Schedule annual check-ups and age-appropriate screenings. Early detection is the most powerful tool in preventing serious illness.", icon: "🏥" },
  { id: 11, category: "prevention", title: "Hand Hygiene", content: "Wash hands thoroughly for at least 20 seconds. Proper hand hygiene prevents the spread of 80% of common infectious diseases.", icon: "🧼" },
  { id: 12, category: "exercise", title: "Cardio for Heart Health", content: "Aim for 150 minutes of moderate aerobic activity weekly. Brisk walking, cycling, or swimming strengthens your heart and lungs.", icon: "❤️" },
  { id: 13, category: "nutrition", title: "Limit Processed Foods", content: "Reduce ultra-processed food intake. Cook more meals at home using whole ingredients to control sodium, sugar, and unhealthy fat content.", icon: "🍳" },
  { id: 14, category: "mental_health", title: "Gratitude Practice", content: "Write down 3 things you're grateful for each day. Research shows gratitude journaling significantly improves mood and life satisfaction.", icon: "📓" },
  { id: 15, category: "prevention", title: "Sun Protection", content: "Apply SPF 30+ sunscreen daily, even on cloudy days. UV protection prevents skin cancer and premature aging.", icon: "☀️" },
  { id: 16, category: "hydration", title: "Electrolyte Balance", content: "During intense exercise or hot weather, replace lost electrolytes with coconut water or electrolyte drinks, not just plain water.", icon: "⚡" },
];

router.get("/tips", (_req, res) => {
  res.json(healthTips);
});

export default router;
