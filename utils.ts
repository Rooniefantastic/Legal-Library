import { Act, Article, FlatSectionRef, Rule, Section } from './types';

/**
 * Flattens an Act into a linear list of sections for easy Next/Prev navigation
 */
export const flattenActSections = (act: Act, actIndex: number): FlatSectionRef[] => {
  let flatList: FlatSectionRef[] = [];
  let currentIndex = 0;

  // Add Preamble if it exists
  if (act.preamble) {
    flatList.push({
      actIndex,
      section: {
        section_number: 'preamble',
        section_title: act.preamble.title || 'Preamble',
        text: act.preamble.text || '',
      },
      chapterTitle: 'Introduction',
      chapterNumber: 'Intro',
      indexInFlatList: currentIndex++,
    });
  }

  // Add Statement of Objectives and Reasons if it exists
  if (act.statement_of_objectives_and_reasons) {
    flatList.push({
      actIndex,
      section: {
        section_number: 'statement-of-objectives',
        section_title: act.statement_of_objectives_and_reasons.title || 'Statement of Objectives and Reasons',
        text: act.statement_of_objectives_and_reasons.text || '',
      },
      chapterTitle: 'Introduction',
      chapterNumber: 'Intro',
      indexInFlatList: currentIndex++,
    });
  }

  // Handle Constitution-style Acts with Parts
  if (act.parts && act.parts.length > 0) {
    act.parts.forEach(part => {
      if (part.articles && part.articles.length > 0) {
        part.articles.forEach(article => {
          flatList.push({
            actIndex,
            section: article,
            chapterTitle: part.part_title || '',
            chapterNumber: part.part_number,
            indexInFlatList: currentIndex++,
          });
        });
      }
      if (part.chapters && part.chapters.length > 0) {
        part.chapters.forEach(chapter => {
          if (chapter.articles && chapter.articles.length > 0) {
            chapter.articles.forEach(article => {
              flatList.push({
                actIndex,
                section: article,
                chapterTitle: chapter.chapter_title || '',
                chapterNumber: chapter.chapter_number,
                indexInFlatList: currentIndex++,
              });
            });
          }
        });
      }
    });
  }

  // Handle standard Acts with Chapters -> Sections or Rules
  if (act.chapters && act.chapters.length > 0) {
    act.chapters.forEach(chapter => {
      if (chapter.sections && chapter.sections.length > 0) {
        chapter.sections.forEach(section => {
          flatList.push({
            actIndex,
            section,
            chapterTitle: chapter.chapter_title || '',
            chapterNumber: chapter.chapter_number,
            indexInFlatList: currentIndex++,
          });
        });
      }
      if (chapter.rules && chapter.rules.length > 0) {
        chapter.rules.forEach(rule => {
          flatList.push({
            actIndex,
            section: rule,
            chapterTitle: chapter.chapter_title || '',
            chapterNumber: chapter.chapter_number,
            indexInFlatList: currentIndex++,
          });
        });
      }
    });
  }

  // Handle Acts with Schedules -> Sections or Rules
  if (act.schedules && act.schedules.length > 0) {
    act.schedules.forEach(schedule => {
      const scheduleTitle = schedule.schedule_title || '';
      if (schedule.sections && schedule.sections.length > 0) {
        schedule.sections.forEach(section => {
          flatList.push({
            actIndex,
            section,
            chapterTitle: scheduleTitle,
            chapterNumber: schedule.schedule_number,
            indexInFlatList: currentIndex++,
          });
        });
      }
      if (schedule.rules && schedule.rules.length > 0) {
        schedule.rules.forEach(rule => {
          flatList.push({
            actIndex,
            section: rule,
            chapterTitle: scheduleTitle,
            chapterNumber: schedule.schedule_number,
            indexInFlatList: currentIndex++,
          });
        });
      }
    });
  }

  // Handle Acts with only a flat list of sections
  if (act.sections && act.sections.length > 0) {
    act.sections.forEach(section => {
      flatList.push({
        actIndex,
        section,
        chapterTitle: 'Sections',
        chapterNumber: '',
        indexInFlatList: currentIndex++,
      });
    });
  }

  return flatList;
};

/**
 * Encodes text for URL hash to avoid issues with special characters
 */
export const encodeId = (str: string) => encodeURIComponent(str.replace(/\s+/g, '-').toLowerCase());
