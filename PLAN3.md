# WorkVoz — Plan v3 (decisions so far)

> Updates PLAN2.md with everything decided in planning (October 2026).
> For Claude: read this first, then `content/style-guide.md`.

---

## 1. Product in one line
An Android app (iOS later) that teaches Spanish speakers in the US the English of **their job**, with free lessons and paid AI practice. Portuguese comes second.

## 2. Structure
- **Lo básico** (free, offline, no AI): 8 short units — numbers, time & days, money, dates & forms (US month-first dates), alphabet, US measurements (lbs, feet, °F), directions/colors/sizes, 20 key work verbs. A quick check at the start lets learners skip it. See `content/basics/README.md`.
- **Core** (all jobs): 8 units — first day, "can you repeat?", schedule, basic safety, asking for help, injuries & emergencies, talking with your supervisor, getting the job (interview).
- **7 job packs** (4 units each to start): Warehouse · Restaurant/Kitchen · Construction · Cleaning · Landscaping · Security guard · Store associate.
- Every pack has a **Tools unit** and ends with a **"Moving up"** unit (lead, promotion, raise, certifications).
- Total at launch: **44 units** (8 basics + 8 Core + 28 job-pack units) ≈ 205 lessons.
- Out of scope for now: Home health aide, Haitian Creole.

## 3. Teaching method
Needs analysis · task-based learning · chunks (phrases, not grammar) · listening first · Spanish explanations · spaced repetition (FSRS) · shadowing · intelligibility-focused pronunciation · CEFR A1–A2 can-do goals.

**Lesson (~5 min):** situation → listen first → 3–5 key phrases (audio normal/slow + phonetic + Spanish) → tip → practice → shadow → mini task → wrap-up.
**Unit:** 4 lessons + AI role-play + can-do statement.

## 4. Content rules (see `content/style-guide.md`)
- Spanish: neutral Latin American, **tú**.
- Phonetic spelling for Spanish readers (e.g. *Watch out!* → **uách áut**, *Got it?* → **gárit**).
- Safety phrases: checked against OSHA wording + approved by someone who did the job.
- Content drafted by AI, **reviewed by people** (native US English, native Latin American Spanish, job-experienced reviewer), tested with 5–10 learners. Owner is recruiting reviewers.
- Drafts written: Core Unit 1 (`content/core/unit-01-tu-primer-dia.md`), Core Unit 2 (`content/core/unit-02-puede-repetir.md`), Basics B1 numbers (`content/basics/b1-numeros.md`).

## 5. Features in the first version
| Feature | Free | Pro |
|---|---|---|
| Lo básico + all Core + all 7 job packs (lessons) | ✅ | ✅ |
| Daily review (spaced repetition), offline | ✅ | ✅ |
| Tools picture dictionary per job | ✅ | ✅ |
| AI practice interview (by job) | 1 try | ✅ |
| **Practice for this job** — screenshot/link of a posting → requirements in Spanish, key words, scam check, tailored interview | 1 try | ✅ |
| **Listen & retell** — hear a ≤4-line story (headphones), answer, then write it in your own words (like Amazon's test) | 2 stories | ✅ |
| **Mi trabajo** — describe your job in your own words → personal phrases, situations, role-plays; "practice a conversation I need to have soon" | 1 try | ✅ |
| AI role-plays in units | a few/month | ✅ |
| Big-companies section (hiring steps, practice) | steps only | ✅ |

- Pro: **$4.99/month** + yearly plan [price TBD], with a fair-use limit on AI sessions.
- AI-generated content is labeled "Creada con IA"; the AI must never invent safety rules.
- Big companies: original practice only, no logos, "not affiliated" wording, no real test questions.
- Job listings API: **version 2**. O*NET used now for content research.

## 6. Money target
$4,000/month ≈ **950 Pro subscribers** (~$4.24 each after Google's 15%) → roughly 20k–45k active users at 2–5% conversion.

## 7. Tech stack
React Native + Expo (TypeScript) · SQLite on device · FSRS review · Supabase (auth, DB, storage, edge functions) · Claude API via server · cloud speech-to-text (provider chosen by accent test) + on-device for shadowing · AI voices for lesson audio (generated once) · RevenueCat + Google Play Billing · Sentry.

**AI model:** test **Claude Opus 5.5 vs Claude Haiku 5.5** before choosing — test harness ready in `ai-test/` (needs an `ANTHROPIC_API_KEY`). Owner will run it later.

## 8. Business setup
- **Google Play organization account (LLC)** → no 12-tester/14-day rule.
- Owner is creating the LLC. Next: **D-U-N-S number** (slow, start early), business email + simple website with privacy policy, business bank account, Play Console ($25).

## 9. Mockup
10 screens: https://claude.ai/artifact/5VsBL8vA1dxB7skj3K6VtC
Job picker · Home · Lesson · Interview · Results · Subscription · Listen & retell · Practice for this job · Tools · Mi trabajo.

## 10. Open items
- App name: **WorkVoz** (Play Store title: "WorkVoz: Inglés para trabajar"). Web search found no product with this name; still check the .com domain and USPTO before registering.
- Yearly price.
- Run the AI model test; pick a speech-to-text provider.
- Get reviewer feedback on Core 1–2 and B1, then write the rest: Basics B2–B8, Core 3–8, job packs and tools lists.
- ~~Save the project to GitHub~~ → github.com/douggue/english-for-work
