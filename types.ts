export interface Annotation {
  id: string;
  detail: string;
}

export interface Section {
  section_number: string;
  section_title?: string;
  text: string;
  annotations?: Annotation[];
  explanation?: string;
}

export interface Chapter {
  chapter_number: string;
  chapter_title?: string;
  section_range?: string;
  sections: Section[];
}

export interface Schedule {
  schedule_number: string;
  schedule_title?: string;
  sections: Section[];
}

export interface Act {
  act_name: string;
  chapters?: Chapter[];
  schedules?: Schedule[];
  sections?: Section[]; // For acts without chapters
}

// Helper types for navigation
export interface FlatSectionRef {
  actIndex: number;
  section: Section;
  chapterTitle?: string; // Or Schedule title
  chapterNumber?: string;
  indexInFlatList: number;
}
