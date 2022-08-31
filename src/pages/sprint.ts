import "../styles/sprint.scss";
import { Component } from "../utils/component";
import SprintIntro from "../components/sprint/intro-page";
import SprintGamePage from "../components/sprint/game-page";
import {SprintResultesPage, SprintResult} from "../components/sprint/sprint-results-page";
import Timer from "../components/sprint/timer";
import {sprintState, getInfo, sayTheWord, myRandom, clearSprintState, makeVisibleCurrentSprintPage, updateSprintState, changeVisible} from "../components/sprint/sprint-helpers";
// import { BASE_URL } from "../interfaces";

export class Sprint extends Component {
  private sprintIntroCard;
  private sprintGamePage;
  private sprintResultsPage;
  private timer: Timer | undefined;
  parameters: string | undefined;

  constructor(parentNode: HTMLElement, parameters: string) {
    super(parentNode, "div", ["sprint"]);

    if(parameters) {
      this.parameters = parameters;      
    }

    this.sprintIntroCard = new SprintIntro(this.element);
    this.sprintGamePage = new SprintGamePage(this.element);
    this.sprintResultsPage = new SprintResultesPage(this.element);

    //** Sprint intro page **//

    [this.sprintIntroCard.cardBtn1, this.sprintIntroCard.cardBtn2, this.sprintIntroCard.cardBtn3, this.sprintIntroCard.cardBtn4, this.sprintIntroCard.cardBtn5, this.sprintIntroCard.cardBtn6].forEach((btn) => {
      btn.element.addEventListener("click", async() => {
        sprintState.currentGroup = +btn.element.innerText - 1;
        this.prepareGame();
      });
    });

    //** Sprint game page **//

    this.startFromDictionary();

    /* Кнопка включения и отключения звука */
    this.sprintGamePage.soundToggleBtn.element.addEventListener("click", () => {
      this.sprintGamePage.soundToggleBtn.element.classList.toggle("active");

      if(this.sprintGamePage.soundToggleBtn.element.className === "sprintSoundToggle-btn") {
        (this.sprintGamePage.audioPlayer.element as HTMLAudioElement).volume = 1;
      } else {
        (this.sprintGamePage.audioPlayer.element as HTMLAudioElement).volume = 0;
      }
    });

    /* Кнопка full-screen */
    this.sprintGamePage.toFullScreenBtn.element.addEventListener("click", () => {
      const el = document.documentElement,
        rfs = el.requestFullscreen;

      if(typeof rfs!="undefined" && rfs){
        rfs.call(el);
      }
      if(document.fullscreenElement !== null) {
        document.exitFullscreen();
      }
    });

    /* Кнопка озвучки слова */
    this.sprintGamePage.pronounceWordBtn.element.addEventListener("click", () => {
      sayTheWord(this.sprintGamePage.audioPlayer.element as HTMLAudioElement, sprintState.currentContent[sprintState.stepCounter].audio.toString());
    });

    /* Закрытие страницы игры нажатием на Х */
    this.sprintGamePage.toSprintIntroPageBtn.element.addEventListener("click", () => {
      makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintResultsPage.element, this.sprintIntroCard.element, "flex");
      clearSprintState();
      this.timer?.timerStop();
      this.updateScore(false);
      this.sprintGamePage.clearLamp();
    });

    /* Прослушивание кнопок выбора ответа */
    [this.sprintGamePage.answerFalseBtn.element, this.sprintGamePage.answerTrueBtn.element].forEach(async (btn) => {
      btn.addEventListener("click", async (e) => {
        const currentBtn = e.target as HTMLButtonElement;  

        if(currentBtn.innerText === "CORRECT" && this.sprintGamePage.wordInRu.element.innerText ===  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {          
          await this.responseProcessing(true);          
        } else if (currentBtn.innerText === "CORRECT" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {          
          await this.responseProcessing(false);          
        }

        if(currentBtn.innerText === "INCORRECT" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {        
          await this.responseProcessing(true);          
        } else if (currentBtn.innerText === "INCORRECT" && this.sprintGamePage.wordInRu.element.innerText ===  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {          
          await this.responseProcessing(false);          
        }
        console.log(sprintState);
      });   
    });

    //** Sprint Results page **//

    /* Закрытие страницы Результатов нажатием на крестик */
    this.sprintResultsPage.toSprintGamePageBtn.element.onclick = () => {
      makeVisibleCurrentSprintPage(this.sprintResultsPage.element, this.sprintGamePage.element, this.sprintIntroCard.element, "flex");
      clearSprintState();
      this.sprintResultsPage.clearResults();
      this.sprintGamePage.clearLamp();
    };

    document.querySelectorAll(".nav-link").forEach(el => {
      el.addEventListener("click", () => {
        if(el.innerHTML !== "Sprint") {
          changeVisible(this.sprintIntroCard.element, false);
          changeVisible(this.sprintGamePage.element, false);
          changeVisible(this.sprintResultsPage.element, false);
        }
      });
    });
  }

  //* Вспомогательные *//

  /* Запуск Sprint из Dictionary */
  startFromDictionary = async () => {
    if(this.parameters) {
      sprintState.currentGroup = +localStorage.chapter;
      sprintState.currentPage = +localStorage.page;
      await this.prepareGame();
    } else {
      makeVisibleCurrentSprintPage(this.sprintResultsPage.element, this.sprintGamePage.element, this.sprintIntroCard.element, "flex");
    }
  };

  /* Обработка ответов пользователя */
  responseProcessing = async (bool: boolean) => {    
    if(bool) {
      await this.userResponseProcessing(sprintState.currentContent[sprintState.stepCounter].word.toString(), sprintState.currentContent[sprintState.stepCounter].transcription.toString(), sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString(), sprintState.currentContent[sprintState.stepCounter].audio.toString(), true);

      await updateSprintState("none", true, true, true, false);      
      await this.updateScore(true);   
      await this.updateSignalLampState();
      this.makeAnswerVoise(true);  
      
      if(sprintState.stepCounter === 20) {
        await this.checkLimit();
      }
      await this.updateGameCardContent();
      
    } else {
      await this.userResponseProcessing(sprintState.currentContent[sprintState.stepCounter].word.toString(), sprintState.currentContent[sprintState.stepCounter].transcription.toString(), sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString(), sprintState.currentContent[sprintState.stepCounter].audio.toString(), false);
      
      await updateSprintState("none", true, true, false, false);      
      await this.updateSignalLampState();
      this.makeAnswerVoise(false);

      if(sprintState.stepCounter === 20) {
        await this.checkLimit();
      }
      await this.updateGameCardContent();     
    }
  };

  /* Для обработки ответа пользователя и вывода резултата Sprint */
  userResponseProcessing = async (wordInEng: string, wordInEngTranscription: string, wordInRu: string, wordVoiceLink: string, boolean: boolean) => {
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

  /* Для обнорвления контента карточки игры (следующее слово) */
  updateGameCardContent = async () => {
    try {
      this.sprintGamePage.wordInEng.element.innerText =  sprintState.currentContent[sprintState.stepCounter].word.toString();
      this.sprintGamePage.wordInRu.element.innerText =  sprintState.currentContent[myRandom(sprintState.stepCounter)].wordTranslate.toString();
    }
    catch (e){
      console.error((e as Error).message);
    } 
  };

  /* Для обнорвления счета */
  updateScore = async (bool: boolean) => {
    if(bool) {
      this.sprintGamePage.points.element.innerText = sprintState.score.toString();
    } else
      this.sprintGamePage.points.element.innerText = "0";
  };

  /* Для обновления сигнальных ламп */
  updateSignalLampState = async () => {
    const signalLamps = [this.sprintGamePage.gameSignalOne.element, this.sprintGamePage.gameSignalTwo.element, this.sprintGamePage.gameSignalThree.element];
    signalLamps.forEach(lamp => lamp.classList.toggle("activate", false));
    for(let i = 1; i <= sprintState.correctAnswerCount; i += 1) {
      signalLamps[i-1].classList.toggle("activate", true);
    }
  };

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

  /* Подготовка к игре */
  prepareGame = async () => {
    sprintState.currentContent = await getInfo(sprintState.currentGroup, sprintState.currentPage );
    await makeVisibleCurrentSprintPage(this.sprintIntroCard.element, this.sprintResultsPage.element, this.sprintGamePage.element, "flex");
    await this.updateGameCardContent();
    this.timer = new Timer(this.sprintGamePage.timer.element);
    this.timer.specialFunc = this.showResults;
    this.timer.timerRun();
  };

  /*  Проверка окончания страницы или окночания слов */

  checkLimit = async () => {
    if(!this.parameters) {
      if(sprintState.stepCounter === 20 && sprintState.currentPage < 29) {                
        await updateSprintState(true, "none", false, false,
          true);    
        sprintState.stepCounter = 0;    
      } else if(sprintState.stepCounter === 20 && sprintState.currentPage === 29) {
        await makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintIntroCard.element, this.sprintResultsPage.element, "block");
        this.timer?.timerStop();
        await clearSprintState();
        await this.updateSignalLampState();
      }
    }

    if(this.parameters) {
      if(sprintState.stepCounter === 20 && sprintState.currentPage < 29 && sprintState.currentPage !== 0) {            
        await updateSprintState(false, "none", false, false,
          await getInfo(sprintState.currentGroup, sprintState.currentPage ));
        sprintState.stepCounter = 0;
      } else if(sprintState.stepCounter === 20 && sprintState.currentPage === 0) {
        await makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintIntroCard.element, this.sprintResultsPage.element, "block");
        this.timer?.timerStop();
        await clearSprintState();
        await this.updateSignalLampState();
      }
    }
  };  
}