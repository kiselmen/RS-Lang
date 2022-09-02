import {getWordsByChapterAndPage} from "../../utils/loader";
import { BASE_URL } from "../../interfaces";
import { elementData  } from "../../interfaces";

const sprintState: ISprintState = {
  currentGroup: 0,
  currentPage: 0,
  stepCounter: 0,
  score: 0,
  correctAnswerCount: 0,
  currentContent: [],
  parentNodeInfo: "about",
  userHardWords: [],
  userHardWordsCounter: 0,
  userResult: []
};

/* Контент для первой страницы */
async function getInfo(currentGroup: number, currentPage: number,) {
  // if(!localStorage.getItem("userId")) {
  //   return await getWordsByChapterAndPage(currentGroup, currentPage);
  // }

  return await getWordsByChapterAndPage(currentGroup, currentPage);
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

function myRandom(currentNum: number, limits?: number[]): number {
  let randomNum;
  if(limits) {
    randomNum = getRandomIntInclusive(limits[0], limits[1]);
  } else {
    randomNum = getRandomIntInclusive();  
  }  
  return getRandomIntInclusive(1,3) === 1 ? currentNum : randomNum;
}

/* Сброс стейта при закрытии страницы игры */
async function clearSprintState() {
  sprintState.currentGroup = 0;
  sprintState.currentPage = 0;
  sprintState.stepCounter = 0;
  sprintState.score = 0;
  sprintState.correctAnswerCount = 0;
  sprintState.currentContent = [];
  sprintState.parentNodeInfo = "about";
  sprintState.userHardWords = [];
  sprintState.userHardWordsCounter = 0;
  sprintState.userResult = [];
}

/* Обновление стейта */
async function updateSprintState(pageUpdate: boolean | string, stepCounterUpdate: boolean | string, scoreUpdate: boolean | number, correctAnswerCountUpdate: boolean, currentContent: boolean, isUserHardWordsSection: boolean) {

  if(!isUserHardWordsSection) {
    if(pageUpdate && typeof pageUpdate !== "string") {
      sprintState.currentPage += 1;
    } else if(!pageUpdate){
      sprintState.currentPage -= 1;
    } else if(typeof pageUpdate === "string"){
      sprintState.currentPage += 0;
    }

    if(stepCounterUpdate && typeof stepCounterUpdate !== "string") {
      sprintState.stepCounter += 1;
    } else if(!stepCounterUpdate){
      sprintState.stepCounter -= 1;
    } else if(typeof stepCounterUpdate === "string"){
      sprintState.stepCounter += 0;
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
      sprintState.currentContent = await getInfo(sprintState.currentGroup, sprintState.currentPage );
    }
  }

  if(isUserHardWordsSection) {   

    if(stepCounterUpdate && typeof stepCounterUpdate !== "string") {
      sprintState.userHardWordsCounter += 1;
    } else if(!stepCounterUpdate){
      sprintState.userHardWordsCounter -= 1;
    } else if(typeof stepCounterUpdate === "string"){
      sprintState.userHardWordsCounter += 0;
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
  }  
}

/* Отображение нужной страницы Sprint */
const makeVisibleCurrentSprintPage = async (hiddenEl1: HTMLElement, hiddenEl2: HTMLElement, visibleEl: HTMLElement, displayPropVisibleEl: string) => {
  await changeVisible(hiddenEl1, false);
  await changeVisible(hiddenEl2, false);
  changeVisible(visibleEl, true, displayPropVisibleEl);
};

async function changeVisible(el: HTMLElement, bool: boolean, displayProp = "none") {
  if(bool) {
    el.style.display = displayProp;
  } else {
    el.style.display = displayProp;
  }
}

interface ISprintState {
  currentGroup: number;
  currentPage: number,
  stepCounter: number,
  score: number,
  correctAnswerCount: number,
  currentContent: IContent[],
  parentNodeInfo: string,
  userHardWords: elementData[];
  userHardWordsCounter: number;
  userResult: IAnswerResultObj[];
}

interface IAnswerResultObj {
  id: string;
  answer: boolean;
}

interface IContent {
  [key:string]: string | number;
}

export {sprintState, getInfo, sayTheWord, IContent, myRandom, clearSprintState, makeVisibleCurrentSprintPage,
  updateSprintState, changeVisible};



