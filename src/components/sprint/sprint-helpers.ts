import {getWordsByChapterAndPage} from "../../utils/loader";
import { BASE_URL } from "../../interfaces";


const sprintState: ISprintState = {
  currentGroup: 0,
  currentPage: 0,
  counter: 0,
  score: 0,
  currentContent: [],
};

/* Контент для первой страницы */
async function getInfo(currentGroup: number, currentPage: number,) {
  if(localStorage.getItem("userId")) {
    return await getWordsByChapterAndPage(currentPage, currentGroup);
  }
}
/* Озвучка слова */
async function sayTheWord(player: HTMLAudioElement, link: string) {
  player.setAttribute("src", BASE_URL + link);
  player.play();
}
/* Рандомное число из диапазона */
function getRandomIntInclusive(min = 0, max = 19) {
  let myMin = min;
  let myMax = max;
  myMin = Math.ceil(myMin);
  myMax = Math.floor(myMax);
  return Math.floor(Math.random() * (myMax - myMin + 1)) + myMin;
}
/* Сброс стейта при закрытии страницы игры */
function clearSprintState() {
  sprintState.currentGroup = 0;
  sprintState.currentPage = 0;
  sprintState.score = 0;
  sprintState.currentContent = [];
}

interface ISprintState {
  currentGroup: number;
  currentPage: number,
  counter: number,
  currentContent: IContent[],
  score: number,
}

interface IContent {
  [key:string]: string | number;
}

export {sprintState, getInfo, sayTheWord, IContent, getRandomIntInclusive, clearSprintState};



