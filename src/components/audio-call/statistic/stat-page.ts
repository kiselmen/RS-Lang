import Circle from "progressbar.js/circle";
import { BASE_URL, elementData, IWordsElement } from "../../../interfaces";
import { Component } from "../../../utils/component";
import { UIButton } from "../../UI/button";
import { correctWords, wrongWords } from "../main/main-page";
import { progressBarMixin } from "../progressBar";
import { dataAudiocall } from "../main/main-page";
import { getAlluserWords, addWordToUserWords, updateWordInUserWords, updateUserStatistics } from "../../../utils/loader";
import { getTodayInString } from "../../../utils/helper";
import { wordOptional } from "../../../interfaces";
import "./stat-page.scss";

export class AudioCallStatisticPage extends Component {
  private statHeading: Component;
  private statProgressbar: Component;
  private progressbarCount: Component;
  private statTotalCont: Component;
  private statBtnsCont: Component;
  private totalCorrect: Component;
  private totalWrong: Component;
  private correctCont: Component;
  private wrongCont: Component;
  private correctHeading: Component;
  private wrongHeading: Component;
  private btnAgain: UIButton;
  private btnDictionary: UIButton;
  private linkDictionary: Component;
  private linkAgain: Component;
  totalItemHyphen!: Component;
  totalCorrectItem!: Component;
  totalWrongItem!: Component;
  totalItemImg!: Component;
  totalItemEnWord!: Component;
  totalItemRuWord!: Component;
  totalItemBtn!: UIButton;
  bar: Circle;
  totalItem!: Component;
  totalItemAudio!: Component;

  constructor(parentNode: HTMLElement, parameters: string) {
    super(parentNode, "div", ["audiocall-stat", "statistic"]);

    this.statHeading = new Component(this.element, "h3", ["statistic-heading"],"Here is your result");
    this.statProgressbar = new Component(this.element, "div", ["master-progressbar", "statistic-progressbar"]);
    this.statTotalCont = new Component(this.element, "div", ["statistic-total", "total"]);
    this.correctCont = new Component(this.statTotalCont.element, "div", ["total-correct__cont"]);
    this.wrongCont = new Component(this.statTotalCont.element, "div", ["total-wrong__cont"]);
    this.totalCorrect = new Component(this.correctCont.element, "ul", ["total-list", "total-correct"]);
    this.correctHeading = new Component(this.totalCorrect.element, "h4", ["total-heading"], "Correct:");
    this.totalWrong = new Component(this.wrongCont.element, "ul", ["total-list", "total-wrong"]);
    this.wrongHeading = new Component(this.totalWrong.element, "h4", ["total-heading"], "Wrong:");
    this.statBtnsCont = new Component(this.element, "div", ["statistic-btns"]);
    this.btnAgain = new UIButton(this.statBtnsCont.element, ["statistic-btns__again"], "Again");
    this.linkAgain = new Component(this.btnAgain.element, "a", ["statistic-link", "link-again"], "");
    this.btnDictionary = new UIButton(this.statBtnsCont.element, ["statistic-btns__dictionary"], "Dictionary");
    this.linkDictionary = new Component(this.btnDictionary.element, "a", ["statistic-link", "link-dict"], "");
    
    // this.linkAgain.element.setAttribute("href", "#/audiocall");
    this.linkDictionary.element.setAttribute("href", "#/dictionary");
    
    this.statBtnsCont.element.addEventListener("click", (e) => {
      const eventTarget = e.target as HTMLElement;
      const btn = eventTarget.closest(".statistic-link");
      if (!btn) return;
      if ((!this.statBtnsCont.element.contains(btn))) return;

      if (eventTarget.classList.contains("link-again")) {
        if(!parameters) {
          window.location.hash = "#/audiocall";
        }
        location.reload();
      }
    });

    this.progressbarCount = new Component(this.statProgressbar.element, "span", ["master-progressbar__count"],);
    this.bar = progressBarMixin(this.statProgressbar.element);

    (<HTMLElement>document.querySelector(".next")).addEventListener("click", this.updateStat);

    document.addEventListener("keyup", (event) => {
      const isAudiocallMain = document.querySelector(".audiocall-main") as HTMLElement;
      if (isAudiocallMain && isAudiocallMain.style.display === "flex") {
        if (event.code === "Space") {
          this.updateStat();
        }
      }
    });

    this.statTotalCont.element.addEventListener("click", (e) => {
      const eventTarget = e.target as HTMLElement;
      const btn = eventTarget.closest(".total-item__btn");
      if (!btn) return;
      if ((!this.statTotalCont.element.contains(btn))) return;
      (<HTMLAudioElement>btn.querySelector("audio")).play();
    });
  }
  
  createList = (listContainer: HTMLElement, arrayWords: IWordsElement[]) => {
    arrayWords.forEach( (el) => {
      this.totalItem = new Component(listContainer, "li", ["total-item", "total-correct__item"]);
      this.totalItemBtn = new UIButton(this.totalItem.element, ["total-item__btn"], "");
      this.totalItemImg = new Component(this.totalItemBtn.element, "img", ["total-item__img"]);
      this.totalItemImg.element.setAttribute("src", "../../../../public/volume.svg");
      this.totalItemImg.element.setAttribute("alt", "volume");
      this.totalItemAudio = new Component(this.totalItemBtn.element, "audio", ["total-item__audio"]);
      this.totalItemAudio.element.setAttribute("src", BASE_URL + el.audio);
      this.totalItemEnWord = new Component(this.totalItem.element, "span", ["total-item__word", "total-item__en"], el.word);
      this.totalItemHyphen = new Component(this.totalItem.element, "span", [], "-");
      this.totalItemRuWord = new Component(this.totalItem.element, "span", ["total-item__word"], el.wordTranslate);
    });
  };
  
  updateStat = () => {
    if (correctWords.length + wrongWords.length === 10) {
      const animateVal = localStorage.getItem("progressbarVal") as string;
      (<HTMLElement>document.querySelector(".audiocall-main")).style.display = "none";
      this.element.style.display = "flex";
      this.bar.animate(+animateVal);
      this.createList(this.totalCorrect.element, correctWords);
      this.createList(this.totalWrong.element, wrongWords);

      if (localStorage.getItem("token")) {
        const audioCallStorage = localStorage.getItem("audiocall") as string;
        const audiocallStat = JSON.parse(audioCallStorage);
        audiocallStat.maxSeria = dataAudiocall.maxSeries;
        audiocallStat.currSeria = dataAudiocall.series;
        let newWordInThisGame = 0;
        let lernedWords = 0;
        
        getAlluserWords().then( userWords => {
          correctWords.forEach(correctWord => {
            const isInUserWords = userWords.filter( (userWord: elementData) => String(userWord.wordId) === String(correctWord.id));
            if (isInUserWords.length) {
              const optional = isInUserWords[0].optional;
              if (optional.isNew === true) {
                optional.isNew = false;
                newWordInThisGame++;
              } 
              optional.totalAttempts++;
              optional.correctAnswers++;
              optional.games.audiocall.totalAttempts++;
              optional.games.audiocall.correctAnswers++;
              if (isInUserWords[0].difficulty === "normal") {
                if (optional.games.sprint.correctAnswers + optional.games.sprint.correctAnswers >= 3) {
                  isInUserWords[0].difficulty = "study";
                  optional.learnDate = getTodayInString();
                  optional.learned = "yes";
                  lernedWords++;
                }
              } else if (isInUserWords[0].difficulty === "hard") {
                if (optional.games.sprint.correctAnswers + optional.games.sprint.correctAnswers >= 5) {
                  isInUserWords[0].difficulty = "study";
                  optional.learnDate = getTodayInString();
                  optional.learned = "yes";
                  lernedWords++;
                }
              }
              const _word = { id: correctWord.id } as elementData;
              updateWordInUserWords(_word as elementData, isInUserWords[0].difficulty, optional as wordOptional);
            } else {
              const difficulty = "normal";
              const optional = {} as wordOptional;
              optional.learned = "no";
              optional.learnDate = "no";
              const audiocall = { totalAttempts: 1, correctAnswers: 1 };
              const sprint = { totalAttempts: 0, correctAnswers: 0 };
              const games = { sprint: sprint, audiocall: audiocall };
              optional.games = games;
              optional.totalAttempts = 1;
              optional.correctAnswers = 1;
              optional.isNew = false;
              newWordInThisGame++;
              const _word = { id: correctWord.id } as elementData;
              addWordToUserWords(_word as elementData, difficulty, optional as wordOptional);
            }
          });
          wrongWords.forEach(wrongWord => {
            const isInUserWords = userWords.filter( (userWord: elementData) => String(userWord.wordId) === String(wrongWord.id));
            if (isInUserWords.length) {
              const optional = isInUserWords[0].optional;
              if (optional.isNew === true) {
                optional.isNew = false;
                newWordInThisGame++;
              }  
              optional.totalAttempts++;
              // optional.games.audiocall.totalAttempts = 0;
              optional.games.audiocall.correctAnswers = 0;
              if (isInUserWords[0].optional.learned === "yes") {
                isInUserWords[0].difficulty = "normal";
                optional.learnDate = "no";
                optional.learned = "no";
                lernedWords--;
              } else {
                optional.learned = "no";
              }
              const _word = { id: wrongWord.id } as elementData;
              updateWordInUserWords(_word as elementData, isInUserWords[0].difficulty, optional as wordOptional);
            } else {
              const difficulty = "normal";
              const optional = {} as wordOptional;
              optional.learned = "no";
              optional.learnDate = "no";
              const audiocall = { totalAttempts: 1, correctAnswers: 0 };
              const sprint = { totalAttempts: 0, correctAnswers: 0 };
              const games = { sprint: sprint, audiocall: audiocall };
              optional.games = games;
              optional.totalAttempts = 1;
              optional.correctAnswers = 0;
              optional.isNew = false;
              newWordInThisGame++;
              const _word = { id: wrongWord.id } as elementData;
              addWordToUserWords(_word as elementData, difficulty, optional as wordOptional);
            }
          });
          const curDay = audiocallStat.dayStata.filter( (item: elementData) => item.day === getTodayInString());
          curDay[0].correctAnswers = String(Number(curDay[0].correctAnswers) + correctWords.length);
          curDay[0].totalQuestions = String(Number(curDay[0].totalQuestions) + correctWords.length + wrongWords.length);
          curDay[0].newWords = String(Number(curDay[0].newWords) + newWordInThisGame);
          curDay[0].learnedWords = String(Number(curDay[0].learnedWords) + lernedWords);
          localStorage.setItem("audiocall", JSON.stringify(audiocallStat));
          localStorage.setItem("learnedWords", String(Number(localStorage.getItem("learnedWords") as string) + lernedWords));
          updateUserStatistics();
        });
      }
    }
  };

}