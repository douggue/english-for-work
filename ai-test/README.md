# AI model test: Opus 5.5 vs Haiku 5.5

Runs the app's AI features on both models with the same inputs, then writes a side-by-side report.

**What it tests**
1. **Practice interviews:** 4 jobs (warehouse, restaurant, store, security). The interviewer asks 6 questions, the learner gives scripted beginner answers, then the model writes feedback in Spanish.
2. **Listen and retell:** grades 3 learner retells (good / partial / wrong).
3. **Practice for this job:** reads a real-looking job posting and a scam posting, explains them in Spanish, and writes interview questions.

**Run it** (Node 20+):
```bash
npm install
export ANTHROPIC_API_KEY=sk-ant-...      # from console.anthropic.com
npm test                                 # both models, ~1-2 min, costs well under $1
npm test -- --models claude-haiku-5-5    # one model only
```
Open `results/report.html`. Rate each answer 1-5 **before** looking at the cost table.

**What to look for**
- Interviewer: short, natural, simple English? Follows the questions? Answers the learner's question sensibly?
- Feedback: natural Spanish (tú)? Picks the most important fixes? Corrections correct?
- Retell: are the scores fair? Does "wrong" (Ana is sick) get a low score?
- Posting: does it flag the scam as **high** risk? Are the facts right (pay, schedule)?

Speech-to-text and voice costs are **not** included; they're tested separately.
