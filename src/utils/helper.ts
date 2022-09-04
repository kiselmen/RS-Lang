import { elementData } from "../interfaces/index";

export function getTodayInString(): string {
  const currDay = new Date();
  const day = String(currDay.getFullYear()) + "-" + String(currDay.getMonth()) + "-" + String(currDay.getDate());
  return day;
}

export function createNewDayStata(){
  const day = getTodayInString();
  return {
    day: day,
    newWords: "0",
    totalQuestions: "0",
    correctAnswers: "0",
  } as elementData;
}
