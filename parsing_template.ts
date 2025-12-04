import { Act } from './types';

/**
 * --- INSTRUCTIONS FOR AI PARSER ---
 * 
 * Objective: Convert raw legal text (from PDF/OCR) into the structured TypeScript format defined below.
 * 
 * Rules:
 * 1. Output must be a valid TypeScript object of type 'Act'.
 * 2. Maintain exact hierarchy: Act -> Chapters -> Sections OR Act -> Sections (if no chapters).
 * 3. Text Formatting:
 *    - Use '\n\n' for paragraph breaks.
 *    - Use Markdown for tables (e.g., | Col1 | Col2 |).
 *    - Preserve original numbering (e.g., "(1)", "(a)", "Explanation.—").
 * 4. Annotations:
 *    - If the text contains footnote markers (e.g., ¹, *, or [1]), keep them in the 'text'.
 *    - Extract the corresponding footnote text into the 'annotations' array.
 * 5. Explanations:
 *    - If the user provides a summary/explanation, put it in the 'explanation' field.
 *    - If the Act text has an "Explanation" clause inline, keep it in the 'text' field.
 * 
 * Below is the template structure to follow:
 */

export const PARSED_ACT_TEMPLATE: Act = {
  // exact name of the act including year
  act_name: "The Example Act, 2024", 

  // OPTION A: For acts divided into chapters
  chapters: [
    {
      chapter_number: "I", // Roman (I, II) or Arabic (1, 2) as per original text
      chapter_title: "Preliminary",
      section_range: "1-2", // Optional: Range of sections in this chapter
      sections: [
        {
          section_number: "1",
          section_title: "Short title, extent and commencement",
          // Note the use of \n\n for new lines between sub-sections
          text: "(1) This Act may be called the Example Act, 2024.\n\n(2) It extends to the whole of India.\n\n(3) It shall come into force on such date¹ as the Central Government may notify.",
          // Footnotes found in the page footer or endnotes
          annotations: [
            { 
              id: "1", 
              detail: "Notification No. S.O. 123(E), dated 1st January 2024." 
            }
          ],
          // Simplified summary (optional)
          explanation: "This section defines the name of the law and where it applies."
        },
        {
          section_number: "2",
          section_title: "Definitions",
          text: "In this Act, unless the context otherwise requires,—\n(a) 'Public Servant' means any person falling under the description...\n(b) 'Government' means the Central Government."
        }
      ]
    },
    {
      chapter_number: "II",
      chapter_title: "Offences and Penalties",
      section_range: "3-5",
      sections: [
        {
          section_number: "3",
          section_title: "Punishment for theft",
          text: "Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both."
        }
      ]
    }
  ],

  // OPTION B: For acts with Schedules (usually at the end)
  schedules: [
    {
      schedule_number: "First Schedule",
      schedule_title: "Classification of Offences",
      sections: [
        {
          section_number: "1", // If schedule entries aren't numbered, use sequential ID
          section_title: "Cognizable Offences",
          // Use Markdown table format for tabular data
          text: "| Offence | Punishment | Cognizable? |\n|---|---|---|\n| Theft | 3 Years | Yes |\n| Murder | Death/Life | Yes |"
        }
      ]
    }
  ]

  // OPTION C: For small acts with NO chapters (Do not use if 'chapters' is present)
  /*
  sections: [
    {
      section_number: "1",
      section_title: "Short Title",
      text: "This Act may be called the Small Act, 2024."
    }
  ]
  */
};