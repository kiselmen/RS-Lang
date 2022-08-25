import {getWordsByChapterAndPage} from "../../utils/loader";
import { BASE_URL } from "../../interfaces";


const sprintState: ISprintState = {
  currentGroup: 0,
  currentPage: 0,
  counter: 0,
  currentContent: [],
};

async function getInfo(currentGroup: number, currentPage: number,) {
  if(localStorage.getItem("userId")) {
    return await getWordsByChapterAndPage(currentPage, currentGroup);
  }
}

async function sayTheWord(player: HTMLAudioElement, link: string) {
  player.setAttribute("src", BASE_URL + link);
  player.play();
}

interface ISprintState {
  currentGroup: number;
  currentPage: number,
  counter: number,
  currentContent: IContent[],
}

interface IContent {
  [key:string]: string | number;
}

export {sprintState, getInfo, sayTheWord, IContent};



