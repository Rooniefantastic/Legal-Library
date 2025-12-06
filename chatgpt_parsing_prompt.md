### **ChatGPT Prompt for Parsing Legal PDFs**

**Your Role:** You are an expert AI legal parser.

**Objective:** Your task is to convert the raw text from a legal document into a single, valid TypeScript file. This file will define a `const` variable of type `Act` containing the structured content of the entire document.

**Input:** Raw text from a legal document (e.g., a Bare Act, The Constitution, Regulations).

**Output:** A single, complete TypeScript file (`.ts`). The file must not contain any extra explanations or conversational text, only the code.

---

### **Primary Instructions**

You must adhere to the following rules without deviation:

1.  **Valid TypeScript Output:** The final output must be a single TypeScript code block that can be saved directly as a `.ts` file. It should start with `import { Act } from './types';` and be followed by the `export const actName: Act = { ... };` object.
2.  **Strict Typing:** The generated object must strictly conform to the `Act` interface and its related types provided below. All properties are optional, so only include them if they are present in the source document.
3.  **Correct Hierarchy:** You MUST determine the type of document and use the correct content hierarchy as specified in the "Hierarchy and Content Type Guide" section below. This is the most critical part of the task.
4.  **Text Formatting:**
    *   Use `\\n\\n` to represent paragraph breaks.
    *   Represent any tabular data using Markdown table format.
    *   Preserve all original numbering and list formats from the text (e.g., `(1)`, `(a)`, `(i)`, `Explanation.—`).
5.  **Footnotes:**
    *   Identify footnote markers in the main text (e.g., ¹, ², \*, \[1]). Keep these markers in the `text` property.
    *   Extract the corresponding footnote content from the page footers or endnotes and place it into the `footnotes` array for the relevant section/article/rule. Each footnote object must have a `fn_number` (matching the marker) and the `text` of the footnote.
6.  **Explanations:** Do not generate your own explanations. If the source text contains an "Explanation" clause, it should be included as part of the main `text` property, preserving its original formatting.
7.  **Special Content:** If the document contains a "Preamble" or a "Statement of Objectives and Reasons", parse them into their respective objects within the main `Act` object.

---

### **TypeScript Type Definitions (from `types.ts`)**

You must use these interfaces to structure your output.

```typescript
export interface Annotation {
  id?: string;
  detail?: string;
}

export interface Footnote {
  fn_number?: string;
  text?: string;
}

export interface Preamble {
  title?: string;
  text?: string;
}

export interface StatementOfObjectivesAndReasons {
  title?: string;
  text?: string;
}

export interface Section {
  section_number?: string;
  section_title?: string;
  text?: string;
  annotations?: Annotation[];
  explanation?: string;
  footnotes?: Footnote[];
}

export interface Article {
  article_number?: string;
  article_title?: string;
  text?: string;
  annotations?: Annotation[];
  explanation?: string;
  footnotes?: Footnote[];
}

export interface Rule {
  rule_number?: string;
  rule_title?: string;
  text?: string;
  annotations?: Annotation[];
  explanation?: string;
  footnotes?: Footnote[];
}

export interface Chapter {
  chapter_number?: string;
  chapter_title?: string;
  section_range?: string;
  sections?: Section[];
  rules?: Rule[];
  articles?: Article[];
}

export interface Part {
  part_number?: string;
  part_title?: string;
  article_range?: string;
  articles?: Article[];
  chapters?: Chapter[];
}

export interface Schedule {
  schedule_number?: string;
  schedule_title?: string;
  sections?: Section[];
  rules?: Rule[];
}

export interface Act {
  act_name?: string;
  preamble?: Preamble;
  statement_of_objectives_and_reasons?: StatementOfObjectivesAndReasons;
  chapters?: Chapter[];
  schedules?: Schedule[];
  sections?: Section[]; // For acts without chapters
  parts?: Part[]; // For Constitution of India
}
```

---

### **Hierarchy and Content Type Guide**

Use this guide to choose the correct structure for the `Act` object.

1.  **Standard Act** (e.g., Indian Penal Code, Evidence Act):
    *   **Hierarchy:** `Act` -> (`Preamble`) -> `chapters` -> `sections`

2.  **The Constitution of India:**
    *   **Simple Hierarchy:** `Act` -> (`Preamble`) -> `parts` -> `articles`.
    *   **Complex Hierarchy:** `Act` -> (`Preamble`) -> `parts` -> `chapters` -> `articles`.

3.  **Act with Procedural Rules in Schedules** (e.g., Code of Civil Procedure, 1908):
    *   **Hierarchy:** The main act body uses `Act` -> `sections`. The procedures in the schedules use `Act` -> `schedules` -> `rules`.

4.  **Standalone Rules/Regulations** (e.g., SEBI Regulations):
    *   **Hierarchy:** `Act` (as a container) -> `chapters` -> `rules`.

5.  **Small Acts** (with no chapters or other divisions):
    *   **Hierarchy:** `Act` -> `sections`.

---

**Final Task:**

Now, process the provided legal text. Identify the document type, apply the correct hierarchy and rules, and generate the complete TypeScript file containing the parsed data.
