import bank01 from "../../Ngân Hàng Câu Hỏi/Chuong 01.json";
import bank02 from "../../Ngân Hàng Câu Hỏi/Chuong 02.json";
import bank03 from "../../Ngân Hàng Câu Hỏi/Chuong 03.json";
import bank04 from "../../Ngân Hàng Câu Hỏi/Chuong 04.json";
import bank05 from "../../Ngân Hàng Câu Hỏi/Chuong 05.json";
import bank06 from "../../Ngân Hàng Câu Hỏi/Chuong 06.json";
import bank07 from "../../Ngân Hàng Câu Hỏi/Chuong 07.json";
import theory01 from "../../Ôn Tập Lý Thuyết/Chuong 01.json";
import theory02 from "../../Ôn Tập Lý Thuyết/Chuong 02.json";
import theory03 from "../../Ôn Tập Lý Thuyết/Chuong 03.json";
import theory04 from "../../Ôn Tập Lý Thuyết/Chuong 04.json";
import theory05 from "../../Ôn Tập Lý Thuyết/Chuong 05.json";
import theory06 from "../../Ôn Tập Lý Thuyết/Chuong 06.json";
import theory07 from "../../Ôn Tập Lý Thuyết/Chuong 07.json";
import type { RawQuestion, SourceId } from "../types/quiz";

export interface RawChapter {
  id: string;
  title: string;
  questions: RawQuestion[];
}

export interface RawSource {
  id: SourceId;
  label: string;
  folder: string;
  description: string;
  chapters: RawChapter[];
}

const toRaw = (questions: unknown): RawQuestion[] => questions as RawQuestion[];

function formatQuestionTotal(total: number): string {
  return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function countChapterQuestions(chapters: RawChapter[]): number {
  return chapters.reduce((sum, chapter) => sum + chapter.questions.length, 0);
}

const bankChapters: RawChapter[] = [
  { id: "01", title: "Chương 1", questions: toRaw(bank01) },
  { id: "02", title: "Chương 2", questions: toRaw(bank02) },
  { id: "03", title: "Chương 3", questions: toRaw(bank03) },
  { id: "04", title: "Chương 4", questions: toRaw(bank04) },
  { id: "05", title: "Chương 5", questions: toRaw(bank05) },
  { id: "06", title: "Chương 6", questions: toRaw(bank06) },
  { id: "07", title: "Chương 7", questions: toRaw(bank07) }
];

const theoryChapters: RawChapter[] = [
  { id: "01", title: "Chương 1", questions: toRaw(theory01) },
  { id: "02", title: "Chương 2", questions: toRaw(theory02) },
  { id: "03", title: "Chương 3", questions: toRaw(theory03) },
  { id: "04", title: "Chương 4", questions: toRaw(theory04) },
  { id: "05", title: "Chương 5", questions: toRaw(theory05) },
  { id: "06", title: "Chương 6", questions: toRaw(theory06) },
  { id: "07", title: "Chương 7", questions: toRaw(theory07) }
];

export const rawSources: RawSource[] = [
  {
    id: "question-bank",
    label: "Ngân hàng câu hỏi",
    folder: "Ngân Hàng Câu Hỏi",
    description: `${formatQuestionTotal(countChapterQuestions(bankChapters))} câu trọng tâm theo 7 chương, sát dạng ngân hàng đề.`,
    chapters: bankChapters
  },
  {
    id: "theory-review",
    label: "Ôn tập lý thuyết",
    folder: "Ôn Tập Lý Thuyết",
    description: `${formatQuestionTotal(countChapterQuestions(theoryChapters))} câu lý thuyết mở rộng để ghi nhớ keyword và mặt chữ.`,
    chapters: theoryChapters
  }
];
