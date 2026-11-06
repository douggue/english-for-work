# WorkVoz — Plan v3 (decisions so far)

> Updates PLAN2.md with everything decided in planning (October 2026).
> For Claude: read this first, then `content/style-guide.md`.

---

## 1. Product in one line
An Android app (iOS later) that teaches Spanish speakers in the US the English of **their job**, with free lessons and paid AI practice. Portuguese comes second.

## 2. Structure
- **Lo básico** (free, offline, no AI): 8 short units — numbers, time & days, money, dates & forms (US month-first dates), alphabet, US measurements (lbs, feet, °F), directions/colors/sizes, 20 key work verbs. A quick check at the start lets learners skip it. See `content/basics/README.md`.
- **Core** (all jobs): 8 units — first day, "can you repeat?", schedule, basic safety, asking for help, injuries & emergencies, talking with your supervisor, getting the job (interview).
- **8 job packs**: Warehouse · Restaurant/Kitchen · Construction · Cleaning · Landscaping · Security guard · Store associate · **Healthcare (home health aide / caregiver + CNA)**.
- Each pack is built from a **job map** (see §2b) and grows to ~30–50 situations (≈12–15 units).
- Every pack has a **Tools unit** and ends with a **"Moving up"** unit (lead, promotion, raise, certifications).
- Size: 8 Basics + 8 Core units, plus the job packs (size set by each job map; roughly 100–120 units in total).
- Out of scope for now: Haitian Creole; medical assistant / phlebotomist (need higher English).

## 2b. Lesson engine (how we cover "everything about a job")
**Job map** — every job is mapped across the same 10 communication areas: (1) getting the job, (2) first days, (3) tasks & tools, (4) instructions, (5) safety ⚠️, (6) problems & asking for help, (7) customers / the public, (8) coworkers, (9) supervisor & HR, (10) moving up. Each area is filled with real situations from O*NET task lists, real job postings, and what users type in *Mi trabajo*. The map shows coverage gaps, so completeness is measurable.

**Content as data** — writers create building blocks, not finished lessons: situations, phrases (English · phonetic · Spanish · audio · tags: job, area, level, safety, frequency), short dialogues, tools/words. Phrases shared across jobs are written once and reused.

**Engine** — assembles each lesson from the blocks using the 8-step lesson template and **generates the exercises automatically** (listen & pick, word tiles, gap fill, shadowing, mini task). Adapts per learner: placement check, FSRS review per phrase (safety phrases more often), extra practice on weak spots, AI role-play per situation, *Mi trabajo* fills gaps.

**Healthcare pack rules** — focus on communicating and reporting (caring for the patient, body & health words, reporting changes to the nurse/family, fall prevention, hand hygiene, emergencies, patient privacy/HIPAA, talking with families). Never gives medical advice. Level A2 (starts after the Core). CNA exam content varies by state: teach vocabulary and situations, no exam-prep promise. **The whole pack is reviewed by a nurse or CNA**, not only the safety phrases.

## 3. Teaching method
Needs analysis · task-based learning · chunks (phrases, not grammar) · listening first · Spanish explanations · spaced repetition (FSRS) · shadowing · intelligibility-focused pronunciation · CEFR A1–A2 can-do goals.

**Lesson (~5 min):** situation → listen first → 3–5 key phrases (audio normal/slow + phonetic + Spanish) → tip → practice → shadow → mini task → wrap-up.
**Unit:** 4 lessons + AI role-play + can-do statement.

## 4. Content rules (see `content/style-guide.md`)
- Spanish: neutral Latin American, **tú**.
- Phonetic spelling for Spanish readers (e.g. *Watch out!* → **uách áut**, *Got it?* → **gárit**).
- Safety phrases: checked against OSHA wording + approved by someone who did the job.
- **Content is written and self-reviewed by Claude** (owner's decision). Human checks are limited to: (1) **safety phrases** in `content/SAFETY-REVIEW.md`, read by someone who has done the job before launch, and (2) a **beta with 10–20 real users** with an in-app "report a problem" button.
- Drafts written: Core Unit 1 (`content/core/unit-01-tu-primer-dia.md`), Core Unit 2 (`content/core/unit-02-puede-repetir.md`), **all 8 Basics units** (`content/basics/b1`–`b8`).

## 5. Features (one app — everything below ships together; new features come later as updates)
| Feature | Free | Pro |
|---|---|---|
| Lo básico + all Core + all 8 job packs (lessons) | ✅ | ✅ |
| Daily review (spaced repetition), offline | ✅ | ✅ |
| Tools picture dictionary per job | ✅ | ✅ |
| AI practice interview (by job) | 1 try | ✅ |
| **Practice for this job** — screenshot/link of a posting → requirements in Spanish, key words, scam check, tailored interview | 1 try | ✅ |
| **Listen & retell** — hear a ≤4-line story (headphones), answer, then write it in your own words (like Amazon's test) | 2 stories | ✅ |
| **Mi trabajo** — describe your job in your own words → personal phrases, situations, role-plays; "practice a conversation I need to have soon" | 1 try | ✅ |
| AI role-plays in units | a few/month | ✅ |
| Big-companies section (hiring steps, practice) | steps only | ✅ |
| **Mi currículum** — tell your experience in Spanish (voice/text) → simple one-page US resume in English, each line explained in Spanish → PDF → practice interview based on the resume. Never invents experience; contact details stay on the phone and are not sent to the AI. | 1 try | ✅ |
| **Phrase of the day**: daily notification (local, works offline) + one-tap share to WhatsApp as an image/short video | ✅ | ✅ |
| **Invite a friend**: when the friend starts using the app, both get 1 week of Pro | ✅ | ✅ |
| **Learn without opening the app**: home-screen widget (a word from the learner's review list + audio, changes every few hours) and optional lock-screen word notifications (1–3/day, off by default, never during the learner's shift hours). iPhone version (later) gets a true lock-screen widget. | ✅ | ✅ |

- Pro: **$4.99/month** + yearly plan [price TBD], with a fair-use limit on AI sessions.
- AI-generated content is labeled "Creada con IA"; the AI must never invent safety rules.
- Big companies: original practice only, no logos, "not affiliated" wording, no real test questions.
- Job listings API: future idea. O*NET used now for content research.

**Growth notes:** WhatsApp sharing and invites are the main free marketing channel next to short videos. Referral rewards are granted through RevenueCat promotional access; limit rewards per account to prevent abuse.

**Future ideas** (discussed, not planned yet): quick-help speaking buttons, camera "¿Qué dice esto?" explainer, commute audio mode, live listening, lock-screen wallpaper with the daily phrase, know-your-rights section, progress certificate, **WorkVoz for companies** (staffing agencies/employers).

## 6. Money target
$4,000/month ≈ **950 Pro subscribers** (~$4.24 each after Google's 15%) → roughly 20k–45k active users at 2–5% conversion.

## 7. Tech stack
React Native + Expo (TypeScript) · SQLite on device · FSRS review · Supabase (auth, DB, storage, edge functions) · Claude API via server · cloud speech-to-text (provider chosen by accent test) + on-device for shadowing · AI voices for lesson audio (generated once) · RevenueCat + Google Play Billing · Sentry.

**AI model:** test **Claude Opus 5.5 vs Claude Haiku 5.5** before choosing — test harness ready in `ai-test/` (needs an `ANTHROPIC_API_KEY`). Owner will run it later.

## 8. Business setup
- **Google Play organization account (LLC)** → no 12-tester/14-day rule.
- Owner is creating the LLC. Next: **D-U-N-S number** (slow, start early), business email + simple website with privacy policy, business bank account, Play Console ($25).

## 9. Mockup
15 screens: https://claude.ai/artifact/5VsBL8vA1dxB7skj3K6VtC
Job picker · Basics check · Home · Lesson · Interview · Results · Subscription · Listen & retell · Practice for this job · Tools · Mi trabajo · Phrase of the day + invite · Lock screen · Widget & settings · Mi currículum.

## 10. Open items
- App name: **WorkVoz** (Play Store title: "WorkVoz: Inglés para trabajar"). Web search found no product with this name; still check the .com domain and USPTO before registering.
- Yearly price.
- Run the AI model test; pick a speech-to-text provider.
- Next: Warehouse job map (example), content data format + checker, then Core 3–8, then job packs and tools lists.
- Healthcare pack: find a nurse or CNA to review the whole pack before launch.
- ~~Save the project to GitHub~~ → github.com/douggue/english-for-work
