import "../styles/sprint.scss";
import { Component } from "../utils/component";
import SprintIntro from "../components/sprint/intro-page";
import SprintGamePage from "../components/sprint/game-page";
import {SprintResultesPage} from "../components/sprint/sprint-results-page";
import Timer from "../components/sprint/timer";
import {sprintState, getInfo, sayTheWord} from "../components/sprint/sprint-helpers";
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
        this.sprintIntroCard.element.style.display = "none";
        this.sprintGamePage.element.style.display = "flex";
        this.timer = new Timer(this.sprintGamePage.timer.element);
        this.timer.timerRun();

        sprintState.currentGroup = +btn.element.innerText;

        sprintState.currentContent = await getInfo(sprintState.currentGroup, sprintState.currentPage );

        this.sprintGamePage.wordInEng.element.innerText =  sprintState.currentContent[sprintState.counter].word.toString();
        this.sprintGamePage.wordInRu.element.innerText =  sprintState.currentContent[sprintState.counter].wordTranslate.toString();
      });
    });

    //** Sprint game page **//

    /* Кнопка включения и отключения звука */
    this.sprintGamePage.soundToggleBtn.element.addEventListener("click", () => {
      this.sprintGamePage.soundToggleBtn.element.classList.toggle("active");
      console.log( (this.sprintGamePage.audioPlayer.element as HTMLAudioElement).volume);

      if(this.sprintGamePage.soundToggleBtn.element.className === "sprintSoundToggle-btn") {
        (this.sprintGamePage.audioPlayer.element as HTMLAudioElement).volume = 0;
      } else {
        (this.sprintGamePage.audioPlayer.element as HTMLAudioElement).volume = 1;
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
      // console.log(sprintState.currentContent[sprintState.counter].audioMeanin);
      console.log(this.sprintGamePage.audioPlayer.element);

      sayTheWord(this.sprintGamePage.audioPlayer.element as HTMLAudioElement, sprintState.currentContent[sprintState.counter].audio.toString());
    });

    /* Отображение страниц при переключении между страницами */
    this.sprintGamePage.toSprintIntroPageBtn.element.addEventListener("click", () => {
      this.sprintIntroCard.element.style.display = "flex";
      this.sprintGamePage.element.style.display = "none";
    });

    /* Остановка таймера при закрытии страницы игры нажатием на крестик */
    this.sprintGamePage.toSprintIntroPageBtn.element.addEventListener("click", () => {
      this.timer?.timerStop();
    });

  }
}