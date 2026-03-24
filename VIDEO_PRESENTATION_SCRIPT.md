# Worley Transition Pathfinder - Video Presentation Script

**Duration:** 3 minutes | **Format:** Screen walkthrough with voiceover

---

## [0:00 - 0:30] THE PROBLEM

> The energy sector is under enormous pressure. Companies operating aging refineries, offshore platforms, and processing plants face a critical question — what do we do with these assets? Do we retrofit them, repurpose them, or decommission entirely?
>
> Today, answering that question takes **2 to 4 weeks** of manual consultant work — gathering engineering data, modelling financial scenarios, assessing regulatory constraints, and comparing pathways side by side across seven or more dimensions.
>
> That timeline is too slow. Markets shift, carbon regulations tighten, and capital windows close. Decision-makers need a faster way to explore their options — without sacrificing analytical rigour.

---

## [0:30 - 1:00] THE SOLUTION

> Introducing the **Worley Transition Pathfinder** — an AI-powered scenario explorer that compresses weeks of analysis into seconds.
>
> Users describe a single industrial asset, and the platform generates a comprehensive comparison of **four distinct transition pathways**: Optimize with Carbon Capture, Repurpose to Green Hydrogen, Repurpose to Biofuels, and Full Decommission.
>
> Each pathway is analysed across seven dimensions — engineering feasibility, financial outlook, emissions trajectory, regulatory considerations, key risks, stranded capital exposure, and social impact — complete with CAPEX ranges, confidence levels, timelines, and actionable next steps.
>
> The result is not a replacement for engineering judgement. It is a rapid-fire first pass that lets consultants and executives explore options in real time, then dive deeper where it matters.

---

## [1:00 - 2:15] ON-SCREEN WALKTHROUGH

### Screen 1: Asset Intake *(show input form)*

> The journey begins here. Users enter their asset details — name, type, and location are required. Optional fields like capacity, emissions, and remaining design life sharpen the analysis.
>
> For users with existing documentation, there is a **drag-and-drop document upload** that accepts PDFs, Excel, Word, and CSV files. The system extracts text client-side and uses AI to auto-populate the form — no manual re-entry.
>
> For a quick demo, a **Sample Data** button fills in a realistic refinery profile in one click.

### Screen 2: Analysis in Progress *(show processing animation)*

> After clicking "Generate Scenarios", a three-step progress animation runs while the AI processes the request — typically **15 to 25 seconds**. Behind the scenes, the platform calls OpenAI's GPT model with a carefully engineered prompt that enforces Worley's analytical framework.

### Screen 3: Results Dashboard — Scenario Results Tab *(show results page)*

> The results page opens on the **Scenario Results** tab. At the top, a speed banner shows the analysis completed in seconds versus weeks of traditional work.
>
> Below that, a **Decision Flow Diagram** maps the strategic decision tree. Then four **Pathway Cards** present each option at a glance — CAPEX range, emissions reduction percentage, timeline, regulatory complexity, and confidence level — all colour-coded by pathway.
>
> Scrolling down, **Visual Charts** compare pathways through a CAPEX bar chart, an emissions radar overlay, and progress bars. An **ESG Summary** scores environmental, social, and governance impact.
>
> The **Comparison Matrix** lays all seven dimensions side by side in a responsive table. A **Recommendation Panel** provides the AI's overall assessment with appropriate caveats, followed by **Next Steps** — four to five concrete actions per pathway for the next zero to six months. Finally, **Precedent Studies** reference comparable real-world transitions for context.

### Screen 3: Results Dashboard — What-If Analysis Tab *(click second tab)*

> Switching to the **What-If Analysis** tab unlocks real-time sensitivity testing. On the left, **five assumption sliders** let users adjust carbon price, CAPEX budget factor, emissions reduction target, remaining asset life, and discount rate.
>
> On the right, three visualisations update instantly. A **horizontal bar chart** shows each pathway's weighted attractiveness score from zero to one hundred. **Ranking cards** display position changes with green and red delta arrows versus baseline. And a **five-axis radar chart** breaks down how each pathway scores on emissions, cost efficiency, confidence, regulatory readiness, and social acceptability.
>
> Drag the carbon price to 180 dollars per tonne — and watch high-emissions-reduction pathways climb. Tighten the budget factor to 0.5 — expensive options drop. This turns static analysis into dynamic exploration.

### Action Bar *(show export options)*

> At the bottom, users can **export the full report as PDF** for printing or **download raw JSON** for downstream tools, and start a fresh assessment anytime.

---

## [2:15 - 2:50] TECHNICAL HIGHLIGHTS

> Under the hood, the platform is built with **Next.js 16** and **React 19** on the App Router, styled with **Tailwind CSS v4** using Worley's brand palette. Charts are rendered with **Recharts**. Document parsing runs entirely client-side using **pdfjs-dist**, **mammoth**, and **xlsx** — no files leave the browser.
>
> The sensitivity scoring engine is a **pure-function module** with zero React dependencies, making it fully unit-testable. The full test suite includes **305 passing tests** covering scoring logic, component rendering, accessibility, and user interactions.
>
> All AI-generated content is labelled with an **"AI generated" badge** and framed as indicative — requiring consultant validation before client delivery.

---

## [2:50 - 3:00] CONCLUSION

> The Worley Transition Pathfinder turns a month-long analytical exercise into a guided, interactive experience that runs in under thirty seconds. It does not replace expert judgement — it **accelerates it**, giving decision-makers the confidence to act faster in a rapidly changing energy landscape.
>
> Built for Worley. Powered by AI. Designed for the decisions that matter.
