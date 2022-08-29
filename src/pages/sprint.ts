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

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["sprint"]);
    this.sprintIntroCard = new SprintIntro(this.element);
    this.sprintGamePage = new SprintGamePage(this.element);
    this.sprintResultsPage = new SprintResultesPage(this.element);



    //** Sprint intro page **//

    [this.sprintIntroCard.cardBtn1, this.sprintIntroCard.cardBtn2, this.sprintIntroCard.cardBtn3, this.sprintIntroCard.cardBtn4, this.sprintIntroCard.cardBtn5, this.sprintIntroCard.cardBtn6].forEach((btn) => {
      btn.element.addEventListener("click", async() => {
        makeVisibleCurrentSprintPage(this.sprintIntroCard.element, this.sprintResultsPage.element, this.sprintGamePage.element, "flex");

        this.timer = new Timer(this.sprintGamePage.timer.element);
        this.timer.specialFunc = showResults;
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

      updateScore(false);
      this.sprintGamePage.clearLamp();
    });



    /* Прослушивание кнопок выбора ответа */
    [this.sprintGamePage.answerFalseBtn.element, this.sprintGamePage.answerTrueBtn.element].forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const currentBtn = e.target as HTMLButtonElement;


        if(sprintState.stepCounter === 19 && sprintState.currentPage < 30) {
          updateSprintState(true, 0, false, false,
            await getInfo(sprintState.currentGroup, sprintState.currentPage ));


        } else if(sprintState.stepCounter === 19 && sprintState.currentPage === 30) {
          makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintIntroCard.element, this.sprintResultsPage.element, "block");
          this.timer?.timerStop();
          clearSprintState();
          updateSignalLampState();
        }


        if(currentBtn.innerText === "ВЕРНО" && this.sprintGamePage.wordInRu.element.innerText ===  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
          updateSprintState(false, true, true, true);
          updateScore(true);

          updateGameCardContent();
          updateSignalLampState();
          makeAnswerVoise(true);
          userResponseProcessing(sprintState.currentContent[sprintState.stepCounter].word.toString(), sprintState.currentContent[sprintState.stepCounter].transcription.toString(), sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString(), sprintState.currentContent[sprintState.stepCounter].audio.toString(), true);

        } else if (currentBtn.innerText === "ВЕРНО" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
          updateSprintState(false, true, false, false);
          updateGameCardContent();
          updateSignalLampState();
          makeAnswerVoise(false);
          userResponseProcessing(sprintState.currentContent[sprintState.stepCounter].word.toString(), sprintState.currentContent[sprintState.stepCounter].transcription.toString(), sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString(), sprintState.currentContent[sprintState.stepCounter].audio.toString(), false);
        }

        if(currentBtn.innerText === "НЕ ВЕРНО" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
          updateSprintState(false, true, true, true);

          updateScore(true);

          updateGameCardContent();
          updateSignalLampState();
          makeAnswerVoise(true);
          userResponseProcessing(sprintState.currentContent[sprintState.stepCounter].word.toString(), sprintState.currentContent[sprintState.stepCounter].transcription.toString(), sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString(), sprintState.currentContent[sprintState.stepCounter].audio.toString(), true);

        } else if (currentBtn.innerText === "НЕ ВЕРНО" && this.sprintGamePage.wordInRu.element.innerText ===  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
          updateSprintState(false, true, false, false);
          updateGameCardContent();
          updateSignalLampState();
          makeAnswerVoise(false);
          userResponseProcessing(sprintState.currentContent[sprintState.stepCounter].word.toString(), sprintState.currentContent[sprintState.stepCounter].transcription.toString(), sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString(), sprintState.currentContent[sprintState.stepCounter].audio.toString(), false);
        }
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

    //* Вспомогательные *//

    /* Для таймера */
    const showResults = () => {
      makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintIntroCard.element, this.sprintResultsPage.element, "block");
      this.timer?.timerStop();
      clearSprintState();
      updateScore(true);
    };

    /* Для обработки ответа пользователя и вывода резултата Sprint */
    const userResponseProcessing = (wordInEng: string, wordInEngTranscription: string, wordInRu: string, wordVoiceLink: string, boolean: boolean) => {
      this.sprintResultsPage.result = new SprintResult(this.sprintResultsPage.results.element, wordInEng, wordInEngTranscription, wordInRu, wordVoiceLink, boolean);

      this.sprintResultsPage.result.specialFunc =  () => sayTheWord(this.sprintGamePage.audioPlayer.element as HTMLAudioElement,
        wordVoiceLink);
    };

    /* Для обнорвления контента карточки игры (следующее слово) */
    const updateGameCardContent = () => {
      this.sprintGamePage.wordInEng.element.innerText =  sprintState.currentContent[sprintState.stepCounter].word.toString();
      this.sprintGamePage.wordInRu.element.innerText =  sprintState.currentContent[myRandom(sprintState.stepCounter)].wordTranslate.toString();
    };

    /* Для обнорвления счета */

    const updateScore = (bool: boolean) => {
      if(bool) {
        this.sprintGamePage.points.element.innerText = sprintState.score.toString();
      } else
        this.sprintGamePage.points.element.innerText = "0";
    };

    /* Для обновления сигнальных ламп */

    const updateSignalLampState = () => {
      const signalLamps = [this.sprintGamePage.gameSignalOne.element, this.sprintGamePage.gameSignalTwo.element, this.sprintGamePage.gameSignalThree.element];

      signalLamps.forEach(lamp => lamp.classList.toggle("activate", false));

      for(let i = 1; i <= sprintState.correctAnswerCount; i += 1) {
        signalLamps[i-1].classList.toggle("activate", true);


      }
    };

    /* Для озвучки  правильных и неправильных ответов */

