import {Component} from "../../utils/component";
import { UIButton } from "../UI/button";

class SprintGamePage extends Component {
  gamePageControlsBtnsContainer;
  toSprintIntroPageBtn;
  soundToggleBtn;
  toFullScreenBtn;
  countersContainer;
  timer;
  points;
  gameCardContainer;
  gameSignalsContainer;
  gameSignalOne;
  gameSignalTwo;
  gameSignalThree;
  pronounceWordBtn;
  wordInEngContainer;
  wordInEng;
  wordInRuContainer;
  wordInRu;
  answersBtnsContainer;
  answerFalseBtn;
  answerTrueBtn;
  audioPlayer;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["sprint-game__wrap"]);
    this.element.style.display = "none";

    this.gamePageControlsBtnsContainer = new Component(this.element, "div", ["sprintControlsBtns-container"]);
    this.soundToggleBtn = new Component(this.gamePageControlsBtnsContainer.element, "div", ["sprintSoundToggle-btn"]);
    this.toFullScreenBtn = new Component(this.gamePageControlsBtnsContainer.element, "div", ["sprintToFullScreen-btn"]);
    this.toSprintIntroPageBtn = new Component(this.gamePageControlsBtnsContainer.element, "div", ["toSprintIntroPage-btn"]);

    this.countersContainer = new Component(this.element, "div", ["sprintCounters-container"]);
    this.timer = new Component(this.countersContainer.element, "div", ["sprint-timer"], "60");
    this.points = new Component(this.countersContainer.element, "div", ["sprint-points"], "0");

    this.gameCardContainer = new Component(this.element, "div", ["sprintGameCard-container"]);

    this.gameSignalsContainer = new Component(this.element, "div", ["sprintGameCardSignals-container"]);
    this.gameSignalOne = new Component(this.gameSignalsContainer.element, "div", ["sprintGameCardSignalOne", "sprintGameCardSignal"]);
    this.gameSignalTwo = new Component(this.gameSignalsContainer.element, "div", ["sprintGameCardSignalTwo", "sprintGameCardSignal"]);
    this.gameSignalThree = new Component(this.gameSignalsContainer.element, "div", ["sprintGameCardSignalThree", "sprintGameCardSignal"]);

    this.gameSignalOne.element.innerHTML = "<svg class='signalLamp1-img signal-lamp' focusable='false' viewBox='0 0 24 24' aria-hidden='true'><path d='M3.55 18.54l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8zM11 22.45h2V19.5h-2v2.95zM4 10.5H1v2h3v-2zm11-4.19V1.5H9v4.81C7.21 7.35 6 9.28 6 11.5c0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.22-1.21-4.15-3-5.19zm5 4.19v2h3v-2h-3zm-2.76 7.66l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4z'></path></svg>";
    this.gameSignalTwo.element.innerHTML = "<svg class='signalLamp2-img signal-lamp' focusable='false' viewBox='0 0 24 24' aria-hidden='true'><path d='M3.55 18.54l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8zM11 22.45h2V19.5h-2v2.95zM4 10.5H1v2h3v-2zm11-4.19V1.5H9v4.81C7.21 7.35 6 9.28 6 11.5c0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.22-1.21-4.15-3-5.19zm5 4.19v2h3v-2h-3zm-2.76 7.66l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4z'></path></svg>";
    this.gameSignalThree.element.innerHTML = "<svg class='signalLamp3-img signal-lamp' focusable='false' viewBox='0 0 24 24' aria-hidden='true'><path d='M3.55 18.54l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8zM11 22.45h2V19.5h-2v2.95zM4 10.5H1v2h3v-2zm11-4.19V1.5H9v4.81C7.21 7.35 6 9.28 6 11.5c0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.22-1.21-4.15-3-5.19zm5 4.19v2h3v-2h-3zm-2.76 7.66l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4z'></path></svg>";

    this.pronounceWordBtn = new Component(this.element, "div", ["sprintPronounceWord-btn"]);
    this.pronounceWordBtn.element.innerHTML = "<svg class='MuiSvgIcon-root' focusable='false' viewBox='0 0 24 24' aria-hidden='true'><path d='M7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42zm12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42zM18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2v-5zm-6 11c.14 0 .27-.01.4-.04.65-.14 1.18-.58 1.44-1.18.1-.24.15-.5.15-.78h-4c.01 1.1.9 2 2.01 2z'></path></svg>";

    this.wordInEngContainer = new Component(this.element, "div", ["sprintWordInEng-container"]);
    this.wordInEng = new Component(this.wordInEngContainer.element, "p", ["sprintWordInEng"], "satisfy");

    this.wordInRuContainer = new Component(this.element, "div", ["sprintWordInRu-container"]);
    this.wordInRu = new Component(this.wordInRuContainer.element, "p", ["sprintWordInRu"], "эмоция");

    this.answersBtnsContainer = new Component(this.element, "div", ["sprintAnswersBtns-container"]);
    this.answerFalseBtn = new UIButton(this.answersBtnsContainer.element, ["sprintAnswerFalse-btn"], "Не верно");
    this.answerTrueBtn = new UIButton(this.answersBtnsContainer.element, ["sprintAnswerTrue-btn"], "Верно");

    this.audioPlayer = new Component(this.element, "audio", ["sprintAudioPlayer"]);
    this.audioPlayer.element.style.cssText = "display: none; visibility: hidden";
    // (this.audioPlayer.element as HTMLAudioElement).volume = 0;
  }


}

export default SprintGamePage;