import "../styles/sprint.scss";
import { Component } from "../utils/component";
import SprintIntro from "../components/sprint/intro-page";
import SprintGamePage from "../components/sprint/game-page";
import {SprintResultesPage, SprintResult} from "../components/sprint/sprint-results-page";
import Timer from "../components/sprint/timer";
import {sprintState, getInfo, sayTheWord, myRandom, clearSprintState, makeVisibleCurrentSprintPage, updateSprintState} from "../components/sprint/sprint-helpers";
// import { BASE_URL } from "../interfaces";

export class Sprint extends Component {
  private sprintIntroCard;
  private sprintGamePage;
  private sprintResultsPage;
  private timer: Timer | undefined;

  constructor(parentNode: HTMLElement, parameters: string) {
    super(parentNode, "div", ["sprint"]);
    console.log(parameters);
    
    this.sprintIntroCard = new SprintIntro(this.element);
    this.sprintGamePage = new SprintGamePage(this.element);
    this.sprintResultsPage = new SprintResultesPage(this.element);

    //** Sprint intro page **//

    [this.sprintIntroCard.cardBtn1, this.sprintIntroCard.cardBtn2, this.sprintIntroCard.cardBtn3, this.sprintIntroCard.cardBtn4, this.sprintIntroCard.cardBtn5, this.sprintIntroCard.cardBtn6].forEach((btn) => {
      btn.element.addEventListener("click", async() => {
        makeVisibleCurrentSprintPage(this.sprintIntroCard.element, this.sprintResultsPage.element, this.sprintGamePage.element, "flex");

        this.timer = new Timer(this.sprintGamePage.timer.element);
        this.timer.specialFunc = this.showResults;
        this.timer.timerRun();

        sprintState.currentGroup = +btn.element.innerText;

        sprintState.currentContent = await getInfo(sprintState.currentGroup, sprintState.currentPage );

        this.sprintGamePage.wordInEng.element.innerText =  sprintState.currentContent[sprintState.stepCounter].word.toString();
        this.sprintGamePage.wordInRu.element.innerText =  sprintState.currentContent[myRandom(sprintState.stepCounter)].wordTranslate.toString();
      });
    });

    //** Sprint game page **//

    /* Кнопка включения и отключения звука */
    this.sprintGamePage.soundToggleBtn.element.addEventListener("click", () => {
      this.onOffVolume();
    });

    /* Кнопка full-screen */
    this.sprintGamePage.toFullScreenBtn.element.addEventListener("click", () => {
      this.getFullScreen();
    });

    /* Кнопка озвучки слова */
    this.sprintGamePage.pronounceWordBtn.element.addEventListener("click", () => {
      this.getWordVoice();
    });

    /* Закрытие страницы игры нажатием на Х */
    this.sprintGamePage.toSprintIntroPageBtn.element.addEventListener("click", () => {
      this.closeGame();
    });

    /* Прослушивание кнопок выбора ответа */
    [this.sprintGamePage.answerFalseBtn.element, this.sprintGamePage.answerTrueBtn.element].forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const currentBtn = e.target as HTMLButtonElement;
        this.listenAnswerBtns(currentBtn);
      });
    });

    document.addEventListener("keydown", (event) => {
      const isSprintMain = document.querySelector(".sprint-game__wrap") as HTMLElement;
      if (isSprintMain && isSprintMain.style.display === "flex") {
        if (event.code === "KeyM") {
          this.onOffVolume();
        }
        if (event.code === "KeyF") {
          this.getFullScreen();
        }
        if (event.key === "Shift") {
          this.getWordVoice();
        }
        if (event.key === "Escape") {
          this.closeGame();
        }
        if (event.key === "ArrowLeft") {
          const leftBtn = document.querySelector(".sprintAnswerFalse-btn") as HTMLElement;
          this.listenAnswerBtns(leftBtn);
        }
        if (event.key === "ArrowRight") {
          const rightBtn = document.querySelector(".sprintAnswerTrue-btn") as HTMLElement;
          this.listenAnswerBtns(rightBtn);
        }
      }
    });

    //** Sprint Results page **//

    /* Закрытие страницы Результатов нажатием на крестик */
    this.sprintResultsPage.toSprintGamePageBtn.element.onclick = () => {
      makeVisibleCurrentSprintPage(this.sprintResultsPage.element, this.sprintGamePage.element, this.sprintIntroCard.element, "flex");
      clearSprintState();
      this.sprintResultsPage.clearResults();
      this.sprintGamePage.clearLamp();
    };
  }
  
  
  /* Для озвучки  правильных и неправильных ответов */
  makeAnswerVoise = (soundLinkToBool: boolean) => {
    const player = this.sprintGamePage.audioPlayer.element as HTMLAudioElement;

    if(soundLinkToBool) {
      player.setAttribute("src", "./public/sprint-music/true.mp3");
    } else {
      player.setAttribute("src", "./public/sprint-music/false.mp3");
    }
    player.play();
  };

  /* Для обновления сигнальных ламп */
  updateSignalLampState = () => {
    const signalLamps = [this.sprintGamePage.gameSignalOne.element, this.sprintGamePage.gameSignalTwo.element, this.sprintGamePage.gameSignalThree.element];

    signalLamps.forEach(lamp => lamp.classList.toggle("activate", false));

    for(let i = 1; i <= sprintState.correctAnswerCount; i += 1) {
      signalLamps[i-1].classList.toggle("activate", true);
    }
  };

  /* Для обнорвления контента карточки игры (следующее слово) */
  updateGameCardContent = () => {
    this.sprintGamePage.wordInEng.element.innerText =  sprintState.currentContent[sprintState.stepCounter].word.toString();
    this.sprintGamePage.wordInRu.element.innerText =  sprintState.currentContent[myRandom(sprintState.stepCounter)].wordTranslate.toString();
  };

  /* Для обработки ответа пользователя и вывода резултата Sprint */
  userResponseProcessing = (wordInEng: string, wordInEngTranscription: string, wordInRu: string, wordVoiceLink: string, boolean: boolean) => {
    this.sprintResultsPage.result = new SprintResult(this.sprintResultsPage.results.element, wordInEng, wordInEngTranscription, wordInRu, wordVoiceLink, boolean);

    this.sprintResultsPage.result.specialFunc =  () => sayTheWord(this.sprintGamePage.audioPlayer.element as HTMLAudioElement,
      wordVoiceLink);
  };

  /* Для таймера */
  showResults = () => {
    makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintIntroCard.element, this.sprintResultsPage.element, "block");
    this.timer?.timerStop();
    clearSprintState();
    this.updateScore(true);
  };
  
  /* Для обнорвления счета */
  updateScore = (bool:boolean) => {
    if(bool) {
      this.sprintGamePage.points.element.innerText = sprintState.score.toString();
    } else
      this.sprintGamePage.points.element.innerText = "0";
  };
  
  onOffVolume = () => {
    this.sprintGamePage.soundToggleBtn.element.classList.toggle("active");

    if(this.sprintGamePage.soundToggleBtn.element.className === "sprintSoundToggle-btn") {
      (this.sprintGamePage.audioPlayer.element as HTMLAudioElement).volume = 1;
    } else {
      (this.sprintGamePage.audioPlayer.element as HTMLAudioElement).volume = 0;
    }
  };

  getFullScreen = () => {
    const el = document.documentElement,
      rfs = el.requestFullscreen;

    if(typeof rfs!="undefined" && rfs){
      rfs.call(el);
    }
    if(document.fullscreenElement !== null) {
      document.exitFullscreen();
    }
  };

  getWordVoice = () => {
    sayTheWord(this.sprintGamePage.audioPlayer.element as HTMLAudioElement, sprintState.currentContent[sprintState.stepCounter].audio.toString());
  };

  closeGame =() => {
    makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintResultsPage.element, this.sprintIntroCard.element, "flex");
    clearSprintState();
    this.timer?.timerStop();
    this.updateScore(false);
    this.sprintGamePage.clearLamp();
  };

  listenAnswerBtns = async (event: HTMLElement) => {
    if(sprintState.stepCounter === 19 && sprintState.currentPage < 30) {
      updateSprintState(true, 0, false, false,
        await getInfo(sprintState.currentGroup, sprintState.currentPage ));

    } else if(sprintState.stepCounter === 19 && sprintState.currentPage === 30) {
      makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintIntroCard.element, this.sprintResultsPage.element, "block");
      this.timer?.timerStop();
      clearSprintState();
      this.updateSignalLampState();
    }

    if(event.innerText === "CORRECT" && this.sprintGamePage.wordInRu.element.innerText ===  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
      updateSprintState(false, true, true, true);
      this.updateScore(true);
      this.updateGameCardContent();
      this.updateSignalLampState();
      this.makeAnswerVoise(true);
      this.userResponseProcessing(sprintState.currentContent[sprintState.stepCounter].word.toString(), sprintState.currentContent[sprintState.stepCounter].transcription.toString(), sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString(), sprintState.currentContent[sprintState.stepCounter].audio.toString(), true);
      
    } else if (event.innerText === "CORRECT" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
      updateSprintState(false, true, false, false);
      this.updateGameCardContent();
      this.updateSignalLampState();
      this.makeAnswerVoise(false);
      this.userResponseProcessing(sprintState.currentContent[sprintState.stepCounter].word.toString(), sprintState.currentContent[sprintState.stepCounter].transcription.toString(), sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString(), sprintState.currentContent[sprintState.stepCounter].audio.toString(), false);
    }

    if(event.innerText === "INCORRECT" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
      updateSprintState(false, true, true, true);
      this.updateScore(true);
      this.updateGameCardContent();
      this.updateSignalLampState();
      this.makeAnswerVoise(true);
      this.userResponseProcessing(sprintState.currentContent[sprintState.stepCounter].word.toString(), sprintState.currentContent[sprintState.stepCounter].transcription.toString(), sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString(), sprintState.currentContent[sprintState.stepCounter].audio.toString(), true);

    } else if (event.innerText === "INCORRECT" && this.sprintGamePage.wordInRu.element.innerText ===  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
      updateSprintState(false, true, false, false);
      this.updateGameCardContent();
      this.updateSignalLampState();
      this.makeAnswerVoise(false);
      this.userResponseProcessing(sprintState.currentContent[sprintState.stepCounter].word.toString(), sprintState.currentContent[sprintState.stepCounter].transcription.toString(), sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString(), sprintState.currentContent[sprintState.stepCounter].audio.toString(), false);
    }
  };
}