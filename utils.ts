import { Act, FlatSectionRef, Section } from './types';

/**
 * Flattens an Act into a linear list of sections for easy Next/Prev navigation
 */
export const flattenActSections = (act: Act, actIndex: number): FlatSectionRef[] => {
  let flatList: FlatSectionRef[] = [];
  let currentIndex = 0;

  // Handle Acts with Chapters
  if (act.chapters && act.chapters.length > 0) {
    act.chapters.forEach(chapter => {
      chapter.sections.forEach(section => {
        flatList.push({
          actIndex,
          section,
          chapterTitle: `Chapter ${chapter.chapter_number} - ${chapter.chapter_title || ''}`,
          chapterNumber: chapter.chapter_number,
          indexInFlatList: currentIndex++
        });
      });
    });
  }

  // Handle Acts with Schedules
  if (act.schedules && act.schedules.length > 0) {
    act.schedules.forEach(schedule => {
      schedule.sections.forEach(section => {
        flatList.push({
          actIndex,
          section,
          chapterTitle: schedule.schedule_number,
          chapterNumber: '',
          indexInFlatList: currentIndex++
        });
      });
    });
  }

  // Handle Acts without structures (direct sections)
  if (act.sections && act.sections.length > 0) {
    act.sections.forEach(section => {
      flatList.push({
        actIndex,
        section,
        chapterTitle: 'Sections',
        chapterNumber: '',
        indexInFlatList: currentIndex++
      });
    });
  }

  return flatList;
};

/**
 * Encodes text for URL hash to avoid issues with special characters
 */
export const encodeId = (str: string) => encodeURIComponent(str.replace(/\s+/g, '-').toLowerCase());

