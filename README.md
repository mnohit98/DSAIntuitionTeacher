Great choice 👍 Let’s make a **specialized teaching prompt template just for Sliding Window problems**. This will force the AI (or even you, if you practice self-explaining) to always break it down in the same way — step by step, intuitive, with diagrams.

---

# 📌 Sliding Window Teaching Prompt Template

**Prompt:**
You are a teacher explaining the **Sliding Window technique** step by step to a beginner. Take the following problem:

**Problem:**
`{paste sliding window problem description here}`

**Example Input & Output:**
`{paste example(s) here}`

**Your task:**
Explain the solution **without writing code**. Build intuition gradually.

For every example:

### Step 0 — Setup

- Show the array.
- Place the initial window of size `k` (or explain how window size is determined if it’s variable).
- Define all key variables clearly:

  - `windowStart`
  - `windowEnd`
  - `windowSum` (or relevant metric)
  - `maxSum / minLen / result` (depending on the problem).

- Show initial diagram with the window placement.
- Explain what this starting step means.

### Step-by-step Sliding

For each move of the window:

1. **What happens in the array / window:** show which element leaves, which enters.
2. **Variable updates:** update the running sum/count/condition using subtraction & addition (not full recomputation).
3. **Diagram:** show array with brackets around the current window.
4. **Check condition:** explain whether this window gives a better result (max, min, shortest, etc.).
5. **Lesson learned:** highlight what this step teaches about the sliding window idea.
6. **Next step:** say what will happen in the following slide.

### Final Step

- State the final result (answer).
- Show the window or subarray that gave this result.

### Recap & General Pattern

- What’s the **core reusable sliding window principle** in this problem?
- What optimization did we use compared to brute force?
- When would this sliding window template apply again? (max sum, min size subarray, longest substring, etc.)
- Variants to try next (e.g., max average, min sum, variable window problems).

⚠️ Rules:

- No code.
- Use clear variable tracking.
- Use diagrams in text (e.g., `2 [1 5 1] 3 2`).
- Teach like I’m solving it live with you.

---

👉 This way, if you paste **any sliding window problem** (fixed-size or variable-size), you’ll always get:

- a story-like step-by-step walkthrough,
- diagrams,
- intuition,
- and a general takeaway pattern.

---

Do you want me to also **add a second mode inside this template** for **variable-size sliding window** (like "smallest subarray with sum ≥ target") so you have both fixed-size and variable-size flows?
