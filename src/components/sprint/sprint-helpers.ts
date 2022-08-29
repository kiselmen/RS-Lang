import {getWordsByChapterAndPage} from "../../utils/loader";
import { BASE_URL } from "../../interfaces";


const sprintState: ISprintState = {
  currentGroup: 0,
  currentPage: 0,
  stepCounter: 0,
  score: 0,
  correctAnswerCount: 0,
  currentContent: [],

  parentNodeInfo: {"about": 0},

};

/* Контент для первой страницы */
async function getInfo(currentGroup: number, currentPage: number,) {
  if(!localStorage.getItem("userId")) {
    return await getWordsByChapterAndPage(currentPage, currentGroup);
  }
}
/* Озвучка слова */
function sayTheWord(player: HTMLAudioElement, link: string) {
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

function myRandom(currentNum: number): number {
  const randomNum = getRandomIntInclusive();
  return getRandomIntInclusive(1,3) === 1 ? currentNum : randomNum;
}

/* Сброс стейта при закрытии страницы игры */
function clearSprintState() {
  sprintState.currentGroup = 0;
  sprintState.currentPage = 0;
  sprintState.stepCounter = 0;
  sprintState.score = 0;
  sprintState.correctAnswerCount = 0;
  sprintState.currentContent = [];

  sprintState.parentNodeInfo = {};

}

/* Обновление стейта */
function updateSprintState(pageUpdate: boolean, stepCounterUpdate: boolean | number, scoreUpdate: boolean | number, correctAnswerCountUpdate: boolean, currentContent?: []) {
  if(pageUpdate) {
    sprintState.currentPage += 1;
  }
  if(typeof stepCounterUpdate === "boolean" && stepCounterUpdate) {
    sprintState.stepCounter += 1;
  }
  if(typeof stepCounterUpdate === "number") {
    sprintState.stepCounter = stepCounterUpdate;
  }
  if(typeof scoreUpdate === "boolean" && scoreUpdate) {
    switch(sprintState.correctAnswerCount) {
    case 0:
      sprintState.score += 5;
      break;
    case 1:
      sprintState.score += 10;
      break;
    case 2:
      sprintState.score += 15;
      break;
    case 3:
      sprintState.score += 20;
      break;
    }
  }
  if(typeof scoreUpdate === "number") {
    sprintState.score = scoreUpdate;
  }

  if(correctAnswerCountUpdate && sprintState.correctAnswerCount < 3) {
    sprintState.correctAnswerCount += 1;
  } else if(correctAnswerCountUpdate && sprintState.correctAnswerCount === 3) {
    sprintState.correctAnswerCount += 0;
  } else if(!correctAnswerCountUpdate) {
    sprintState.correctAnswerCount = 0;

  }
  if(currentContent) {
    sprintState.currentContent = currentContent;
  }
}


/* Отображение нужной страницы Sprint */
const makeVisibleCurrentSprintPage = (hiddenEl1: HTMLElement, hiddenEl2: HTMLElement, visibleEl: HTMLElement, displayPropVisibleEl: string) => {
  hiddenEl1.style.display = "none";
  hiddenEl2.style.display = "none";
  visibleEl.style.display = displayPropVisibleEl;
};

interface ISprintState {
  currentGroup: number;
  currentPage: number,
  stepCounter: number,
  score: number,
  correctAnswerCount: number,
  currentContent: IContent[],
  parentNodeInfo: {[key: string]: number | null}

}

interface IContent {
  [key:string]: string | number;
}

export {sprintState, getInfo, sayTheWord, IContent, myRandom, clearSprintState, makeVisibleCurrentSprintPage, updateSprintState};



