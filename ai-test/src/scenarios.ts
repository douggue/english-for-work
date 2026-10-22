// Test data. Learner answers imitate speech-to-text output from beginner
// Spanish-speaking learners, including their typical mistakes.

export interface InterviewScenario {
  id: string;
  job: string;
  // The app gives the interviewer a fixed question list per job, so scripted
  // answers line up with the questions.
  questions: string[];
  learnerAnswers: string[];
}

export const interviews: InterviewScenario[] = [
  {
    id: "warehouse",
    job: "Warehouse Associate, night shift, large fulfillment center",
    questions: [
      "Tell me about yourself.",
      "Do you have warehouse experience?",
      "Can you lift 50 pounds?",
      "Are you available nights and weekends?",
      "Why do you want to work here?",
      "Do you have any questions for us?",
    ],
    learnerAnswers: [
      "My name is Carlos, I am from Guatemala, I live here five years. I am hard worker.",
      "Yes, I have two years experience in warehouse, I use the scanner and the pallet jack.",
      "Yes I can lift fifty pound, no problem.",
      "Yes I am available in the night and in the weekend.",
      "Because I need work and I like work in team, and the company is good.",
      "Eh... how much is the pay for hour?",
    ],
  },
  {
    id: "restaurant",
    job: "Line Cook, busy family restaurant",
    questions: [
      "Tell me a little about yourself.",
      "Have you worked in a kitchen before?",
      "What stations have you worked?",
      "How do you handle a busy rush?",
      "When can you start?",
      "Do you have any questions?",
    ],
    learnerAnswers: [
      "I am Rosa. I like cook since I am small. I work in restaurant before.",
      "Yes, three years I work in kitchen in Houston, in a mexican restaurant.",
      "I work the grill and the prep, and some time the fryer.",
      "When is busy I work fast but careful, I follow the tickets.",
      "I can start the next monday.",
      "No, I don't have question. Thank you very much.",
    ],
  },
  {
    id: "store",
    job: "Store Associate, big-box retail store",
    questions: [
      "Why do you want to work in retail?",
      "Do you have customer service experience?",
      "What would you do if a customer is angry?",
      "Can you work weekends and holidays?",
      "Do you speak any other languages?",
      "Do you have any questions for me?",
    ],
    learnerAnswers: [
      "I like help the people and I like the store environment.",
      "Yes, I was cashier one year in a supermarket.",
      "I am calm, I listen the customer and I call my manager if I need.",
      "Yes, I can work weekend and holiday, is not problem.",
      "Yes, I speak spanish, is my first language, and english a little.",
      "What is the schedule for the training?",
    ],
  },
  {
    id: "security",
    job: "Security Officer, office building, evening shift",
    questions: [
      "Do you have a guard card?",
      "Have you worked in security before?",
      "What would you do if you see someone suspicious?",
      "Are you comfortable writing incident reports?",
      "Can you stand for long periods?",
      "Do you have any questions?",
    ],
    learnerAnswers: [
      "Yes, I have the guard card, I take the class last year.",
      "No, before I work in construction, but I am responsible person.",
      "I watch the person, I use the radio and call my supervisor or the police.",
      "I can write but my english is not perfect, I am learning.",
      "Yes I can stand all the shift.",
      "When is the start day?",
    ],
  },
];

// "Listen and retell" — the learner heard this story, then typed it back.
export const story =
  "Ana works at a big warehouse. She starts at six in the morning. One day her bus was late, so she called her supervisor before her shift. He said, \"Thanks for calling. Be safe.\"";

export const retells: { id: string; text: string }[] = [
  {
    id: "good",
    text: "Ana work in a warehouse. She start at 6 in the morning. One day the bus is late so she call her supervisor before the shift. The supervisor say thanks for call and be safe.",
  },
  {
    id: "partial",
    text: "Ana is in a warehouse. The bus is late. She call the boss.",
  },
  {
    id: "wrong",
    text: "Ana is sick and she don't go to work. Her supervisor is angry.",
  },
];

// Job postings (as pasted text; the app will also accept screenshots).
export const postings: { id: string; text: string }[] = [
  {
    id: "real",
    text: `Warehouse Associate - Night Shift
$19.50/hr + $1.50 night differential. Full-time, 4x10 hour shifts, Sun-Wed 6:00 PM - 4:30 AM.
Responsibilities: pick, pack and ship customer orders using a handheld scanner; load and unload trucks; keep work area clean and safe.
Requirements: 18+; able to lift up to 50 lbs; stand and walk for 10 hours; comfortable in a fast-paced environment. No experience needed - paid training provided.
Benefits: health, dental, vision from day one; 401(k).`,
  },
  {
    id: "scam",
    text: `URGENT HIRING!!! Warehouse work from home - packing envelopes. Earn $3,000/week no experience!!
To start, pay a $150 registration fee for your starter kit. Send payment by Zelle or gift card and your Social Security number and bank login so we can set up direct deposit today. Reply fast, only 5 spots left!`,
  },
];
