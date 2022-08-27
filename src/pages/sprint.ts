import "../styles/sprint.scss";
import { Component } from "../utils/component";
import SprintIntro from "../components/sprint/intro-page";
import SprintGamePage from "../components/sprint/game-page";
import {SprintResultesPage, SprintResult} from "../components/sprint/sprint-results-page";
import Timer from "../components/sprint/timer";
import {sprintState, getInfo, sayTheWord, myRandom, clearSprintState, makeVisibleCurrentSprintPage} from "../components/sprint/sprint-helpers";
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

        this.sprintGamePage.wordInEng.element.innerText =  sprintState.currentContent[sprintState.counter].word.toString();
        this.sprintGamePage.wordInRu.element.innerText =  sprintState.currentContent[myRandom(sprintState.counter)].wordTranslate.toString();
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
      sayTheWord(this.sprintGamePage.audioPlayer.element as HTMLAudioElement, sprintState.currentContent[sprintState.counter].audio.toString());
    });

    /* Закрытие страницы игры нажатием на Х */
    this.sprintGamePage.toSprintIntroPageBtn.element.addEventListener("click", () => {
      makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintResultsPage.element, this.sprintIntroCard.element, "flex");
      clearSprintState();
      this.timer?.timerStop();
    });

    // /* Остановка таймера при закрытии страницы игры нажатием на крестик */
    // this.sprintGamePage.toSprintIntroPageBtn.element.addEventListener("click", () => {
    //   this.timer?.timerStop();
    // });

    /* Прослушивание кнопок выбора ответа */
    [this.sprintGamePage.answerFalseBtn.element, this.sprintGamePage.answerTrueBtn.element].forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const currentBtn = e.target as HTMLButtonElement;

        // console.log(currentBtn.innerText);
        // console.log(this.sprintGamePage.wordInRu.element.innerText);
        // console.log(sprintState.currentContent[sprintState.counter].wordTranslate.toString());
        // console.log(sprintState.counter);
        // console.log(sprintState.currentContent);

        if(sprintState.counter === 19 && sprintState.currentPage < 30) {
          sprintState.counter = 0;
          sprintState.currentPage += 1;
          sprintState.currentContent = await getInfo(sprintState.currentGroup, sprintState.currentPage );
        } else if(sprintState.counter === 19 && sprintState.currentPage === 30) {
          makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintIntroCard.element, this.sprintResultsPage.element, "block");
          this.timer?.timerStop();
          clearSprintState();
        }

        if(currentBtn.innerText === "ВЕРНО" && this.sprintGamePage.wordInRu.element.innerText ===  sprintState.currentContent[sprintState.counter].wordTranslate.toString()) {
          sprintState.score += 10;
          sprintState.counter += 1;
          this.sprintGamePage.points.element.innerText = sprintState.score.toString();

          this.sprintGamePage.wordInEng.element.innerText =  sprintState.currentContent[sprintState.counter].word.toString();
          this.sprintGamePage.wordInRu.element.innerText =  sprintState.currentContent[myRandom(sprintState.counter)].wordTranslate.toString();

          userResponseProcessing(sprintState.currentContent[sprintState.counter].word.toString(), sprintState.currentContent[sprintState.counter].transcription.toString(), sprintState.currentContent[sprintState.counter].wordTranslate.toString(), sprintState.currentContent[sprintState.counter].audio.toString(), true);


        } else if (currentBtn.innerText === "ВЕРНО" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.currentContent[sprintState.counter].wordTranslate.toString()) {
          sprintState.counter += 1;
          this.sprintGamePage.wordInEng.element.innerText =  sprintState.currentContent[sprintState.counter].word.toString();
          this.sprintGamePage.wordInRu.element.innerText =  sprintState.currentContent[myRandom(sprintState.counter)].wordTranslate.toString();

          userResponseProcessing(sprintState.currentContent[sprintState.counter].word.toString(), sprintState.currentContent[sprintState.counter].transcription.toString(), sprintState.currentContent[sprintState.counter].wordTranslate.toString(), sprintState.currentContent[sprintState.counter].audio.toString(), false);
        }

        if(currentBtn.innerText === "НЕ ВЕРНО" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.currentContent[sprintState.counter].wordTranslate.toString()) {
          sprintState.score += 10;
          sprintState.counter += 1;
          this.sprintGamePage.points.element.innerText = sprintState.score.toString();

          this.sprintGamePage.wordInEng.element.innerText =  sprintState.currentContent[sprintState.counter].word.toString();
          this.sprintGamePage.wordInRu.element.innerText =  sprintState.currentContent[myRandom(sprintState.counter)].wordTranslate.toString();

          userResponseProcessing(sprintState.currentContent[sprintState.counter].word.toString(), sprintState.currentContent[sprintState.counter].transcription.toString(), sprintState.currentContent[sprintState.counter].wordTranslate.toString(), sprintState.currentContent[sprintState.counter].audio.toString(), true);

        } else if (currentBtn.innerText === "НЕ ВЕРНО" && this.sprintGamePage.wordInRu.element.innerText ===  sprintState.currentContent[sprintState.counter].wordTranslate.toString()) {
          sprintState.counter += 1;
          this.sprintGamePage.wordInEng.element.innerText =  sprintState.currentContent[sprintState.counter].word.toString();
          this.sprintGamePage.wordInRu.element.innerText =  sprintState.currentContent[myRandom(sprintState.counter)].wordTranslate.toString();

          userResponseProcessing(sprintState.currentContent[sprintState.counter].word.toString(), sprintState.currentContent[sprintState.counter].transcription.toString(), sprintState.currentContent[sprintState.counter].wordTranslate.toString(), sprintState.currentContent[sprintState.counter].audio.toString(), false);
        }
      });

    });

    //** Sprint Results page **//

    /* Закрытие страницы Результатов нажатием на крестик */
    this.sprintResultsPage.toSprintGamePageBtn.element.onclick = () => {
      makeVisibleCurrentSprintPage(this.sprintResultsPage.element, this.sprintGamePage.element, this.sprintIntroCard.element, "flex");
      clearSprintState();
      this.sprintResultsPage.clearResults();
    };

    //* Вспомогательные *//

    /* Вспомогательная ф-я для таймера */
    const showResults = () => {
      makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintIntroCard.element, this.sprintResultsPage.element, "block");
      this.timer?.timerStop();
      clearSprintState();
      updateScore();
    };

    /* Вспомогательная ф-я обработки ответа пользователя и вывода резултата Sprint */
    const userResponseProcessing = (wordInEng: string, wordInEngTranscription: string, wordInRu: string, wordVoiceLink: string, boolean: boolean) => {
      this.sprintResultsPage.result = new SprintResult(this.sprintResultsPage.results.element, wordInEng, wordInEngTranscription, wordInRu, wordVoiceLink, boolean);

      this.sprintResultsPage.result.specialFunc =  () => sayTheWord(this.sprintGamePage.audioPlayer.element as HTMLAudioElement,
        wordVoiceLink);
    };

    const updateScore = () => this.sprintGamePage.points.element.innerText = sprintState.score.toString();
  }
}