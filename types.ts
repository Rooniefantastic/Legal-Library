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

// Helper types for navigation
export interface FlatSectionRef {
  actIndex?: number;
  section?: Section | Article | Rule;
  chapterTitle?: string; // Or Schedule title or Part title
  chapterNumber?: string; // Or Schedule number or Part number
  indexInFlatList?: number;
}
