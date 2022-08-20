import {Component} from "../component";

class SprintGamePage extends Component{
  gamePageControlsBtnsContainer;
  toSprintIntroPageBtn;
  soundToggleBtn;
  toFullScreenBtn;
  countersContainer;
  timer;
  points;
  gameCardContainer;
  gameSignalsContainer;
  gameSignalOneContainer;
  pronounceWordBtn;
  wordInEngContainer;
  wordInEng;
  wordInRuContainer;
  wordInRu;
  answersBtnsContainer;
  answerBtnFalse;
  answerBtnTrue;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["sprint-game__wrap"]);

    this.gamePageControlsBtnsContainer = new Component(this.element, "div", ["sprintControlsBtns-container"]);
    this.soundToggleBtn = new Component(this.gamePageControlsBtnsContainer.element, "div", ["sprintSoundToggle-btn"]);
    this.toFullScreenBtn = new Component(this.gamePageControlsBtnsContainer.element, "div", ["sprintToFullScreen-btn"]);
    this.toSprintIntroPageBtn = new Component(this.gamePageControlsBtnsContainer.element, "div", ["toSprintIntroPage-btn"]);

    this.countersContainer = new Component(this.element, "div", ["sprintCounters-container"]);
    this.timer = new Component(this.countersContainer.element, "div", ["sprint-timer"], "60");
    this.points = new Component(this.countersContainer.element, "div", ["sprint-points"], "0");

    this.gameCardContainer = new Component(this.element, "div", ["sprintGameCard-container"]);
    this.gameSignalsContainer = new Component(this.element, "div", ["sprintGameCardSignals-container"]);
    this.gameSignalOneContainer = new Component(this.element, "div", ["sprintGameCardSignals-container"]);

    this.pronounceWordBtn = new Component(this.element, "div", ["sprintPronounceWord-btn"]);

    this.wordInEngContainer = new Component(this.element, "div", ["sprintWordInEng-container"]);
    this.wordInEng = new Component(this.wordInEngContainer.element, "p", ["sprintWordInEng"], "");

    this.wordInRuContainer = new Component(this.element, "div", ["sprintWordInRu-container"]);
    this.wordInRu = new Component(this.wordInEngContainer.element, "p", ["sprintWordInRu"], "");

    this.answersBtnsContainer = new Component(this.element, "div", ["sprintAnswersBtns-container"]);
    this.answerBtnFalse = new Component(this.answersBtnsContainer.element, "button", ["sprintAnswerFalse-btn"], "Не верно");
    this.answerBtnTrue = new Component(this.answersBtnsContainer.element, "button", ["sprintAnswerTrue-btn"], "Верно");
  }

  private startSprint() {
    return null;
  }

}

export default SprintGamePage;