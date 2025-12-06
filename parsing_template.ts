import { Act } from './types';

/**
 * --- INSTRUCTIONS FOR AI PARSER ---
 *
 * Objective: Convert raw legal text (from PDF/OCR) into the structured TypeScript format defined below.
 *
 * Rules:
 * 1.  **Output must be a valid TypeScript object of type 'Act'.**
 * 2.  **Maintain the correct hierarchy based on the document type.** See the guide below.
 * 3.  **Text Formatting:**
 *     - Use '\n\n' for paragraph breaks.
 *     - Use Markdown for tables (e.g., | Col1 | Col2 |).
 *     - Preserve original numbering (e.g., "(1)", "(a)", "Explanation.—").
 * 4.  **Footnotes:**
 *     - If the text contains footnote markers (e.g., ¹, *, or [1]), keep them in the 'text' property.
 *     - Extract the corresponding footnote text into the 'footnotes' array. Each footnote should have a 'fn_number' (matching the marker) and the 'text' of the footnote.
 * 5.  **Explanations:**
 *     - If the user provides a simplified summary/explanation, put it in the 'explanation' field.
 *     - If the Act text has an "Explanation" clause inline, keep it within the 'text' property.
 * 6.  **Special Content:**
 *     - If the document has a "Preamble" or a "Statement of Objectives and Reasons", parse them into their respective objects.
 *
 * --- HIERARCHY AND CONTENT TYPE GUIDE ---
 *
 * Use the correct combination of content types based on the document being parsed.
 *
 * 1.  **Standard Act (e.g., Indian Penal Code):**
 *     - Hierarchy: `Act` -> (`Preamble`) -> `chapters` -> `sections`
 *
 * 2.  **The Constitution of India:**
 *     - Simple Hierarchy: `Act` -> (`Preamble`) -> `parts` -> `articles`.
 *     - Complex Hierarchy: `Act` -> (`Preamble`) -> `parts` -> `chapters` -> `articles`.
 *
 * 3.  **Acts with Procedural Rules in Schedules (e.g., Code of Civil Procedure):**
 *     - Hierarchy: `Act` -> `sections` AND `schedules` -> `rules`.
 *
 * 4.  **Standalone Rules/Regulations (e.g., SEBI Regulations):**
 *     - Hierarchy: `Act` -> `chapters` -> `rules`.
 *
 * 5.  **Very Small Acts (with no chapters):**
 *     - Hierarchy: `Act` -> `sections`.
 *
 * --- TEMPLATES ---
 */

export const PARSED_ACT_TEMPLATE: Act = {
    act_name: "The Example Act, 2024",

    // --- TEMPLATE 0: Special Content (Optional) ---
    preamble: {
        title: "Preamble",
        text: "An Act to consolidate and amend the law relating to... WHEREAS it is expedient to..."
    },
    statement_of_objectives_and_reasons: {
        title: "Statement of Objectives and Reasons",
        text: "The bill seeks to achieve the following objectives..."
    },

    // --- TEMPLATE 1: Standard Act (e.g., Indian Penal Code) ---
    chapters: [
        {
            chapter_number: "I",
            chapter_title: "Preliminary",
            sections: [
                {
                    section_number: "1",
                    section_title: "Short title, extent and commencement",
                    text: "(1) This Act may be called the Example Act, 2024.\n\n(2) It extends to the whole of India.\n\n(3) It shall come into force on such date¹ as the Central Government may notify.",
                    footnotes: [{ fn_number: "1", text: "Came into force on 1st Jan 2024, see G.N. No. 123." }],
                    explanation: "This section defines the name of the law, its geographical reach, and when it becomes effective."
                }
            ]
        }
    ],

    // --- TEMPLATE 2A: The Constitution of India (Simple Part) ---
    /*
    parts: [
        {
            part_number: "I",
            part_title: "THE UNION AND ITS TERRITORY",
            articles: [
                {
                    article_number: "1",
                    article_title: "Name and territory of the Union",
                    text: "(1) India, that is Bharat, shall be a Union of States.\n\n(2) The States and the territories thereof shall be as specified in the First Schedule.¹",
                    footnotes: [{
                        fn_number: "1",
                        text: "Substituted by the Constitution (Seventh Amendment) Act, 1956, s. 2."
                    }]
                }
            ]
        }
    ],
    */

    // --- TEMPLATE 2B: The Constitution of India (Part with Chapters) ---
    /*
    parts: [
        {
            part_number: "V",
            part_title: "THE UNION",
            chapters: [
                {
                    chapter_number: "I",
                    chapter_title: "THE EXECUTIVE",
                    articles: [
                        {
                            article_number: "52",
                            article_title: "The President of India",
                            text: "There shall be a President of India."
                        },
                        {
                            article_number: "53",
                            article_title: "Executive power of the Union",
                            text: "(1) The executive power of the Union shall be vested in the President..."
                        }
                    ]
                }
            ]
        }
    ]
    */
};
