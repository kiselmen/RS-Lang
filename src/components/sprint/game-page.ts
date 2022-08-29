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

    this.gameSignalOne.element.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' stroke='#e4f4ff;' version='1.1' id='Layer_1' x='0px' y='0px' viewBox='0 0 80 80' style='enable-background:new 0 0 80 80;' xml:space='preserve' width='40' height='40'> <g>	<path d='M40,77.5C19.322,77.5,2.5,60.678,2.5,40S19.322,2.5,40,2.5S77.5,19.322,77.5,40S60.678,77.5,40,77.5 z'/> <g><path style='fill:#e4f4ff;' d='M40,3c20.402,0,37,16.598,37,37S60.402,77,40,77S3,60.402,3,40S19.598,3,40,3 M40,2 C19.013,2,2,19.013,2,40s17.013,38,38,38s38-17.013,38-38S60.987,2,40,2L40,2z'/> </g> </g><polyline style='fill:none;stroke:#FFFFFF;stroke-width:6;stroke-miterlimit:10;' points='22.357,40.104 34.049,51.797   60.357,25.489 '/></svg>";
    this.gameSignalTwo.element.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' stroke='#e4f4ff;' version='1.1' id='Layer_1' x='0px' y='0px' viewBox='0 0 80 80' style='enable-background:new 0 0 80 80;' xml:space='preserve' width='40' height='40'> <g>	<path d='M40,77.5C19.322,77.5,2.5,60.678,2.5,40S19.322,2.5,40,2.5S77.5,19.322,77.5,40S60.678,77.5,40,77.5 z'/> <g><path style='fill:#e4f4ff;' d='M40,3c20.402,0,37,16.598,37,37S60.402,77,40,77S3,60.402,3,40S19.598,3,40,3 M40,2 C19.013,2,2,19.013,2,40s17.013,38,38,38s38-17.013,38-38S60.987,2,40,2L40,2z'/> </g> </g><polyline style='fill:none;stroke:#FFFFFF;stroke-width:6;stroke-miterlimit:10;' points='22.357,40.104 34.049,51.797   60.357,25.489 '/></svg>";
    this.gameSignalThree.element.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' stroke='#e4f4ff;' version='1.1' id='Layer_1' x='0px' y='0px' viewBox='0 0 80 80' style='enable-background:new 0 0 80 80;' xml:space='preserve' width='40' height='40'> <g>	<path d='M40,77.5C19.322,77.5,2.5,60.678,2.5,40S19.322,2.5,40,2.5S77.5,19.322,77.5,40S60.678,77.5,40,77.5 z'/> <g><path style='fill:#e4f4ff;' d='M40,3c20.402,0,37,16.598,37,37S60.402,77,40,77S3,60.402,3,40S19.598,3,40,3 M40,2 C19.013,2,2,19.013,2,40s17.013,38,38,38s38-17.013,38-38S60.987,2,40,2L40,2z'/> </g> </g><polyline style='fill:none;stroke:#FFFFFF;stroke-width:6;stroke-miterlimit:10;' points='22.357,40.104 34.049,51.797   60.357,25.489 '/></svg>";

    this.pronounceWordBtn = new Component(this.element, "div", ["sprintPronounceWord-btn"]);
    this.pronounceWordBtn.element.innerHTML = "<svg class='MuiSvgIcon-root' focusable='false' viewBox='0 0 24 24' aria-hidden='true'><path d='M7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42zm12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42zM18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2v-5zm-6 11c.14 0 .27-.01.4-.04.65-.14 1.18-.58 1.44-1.18.1-.24.15-.5.15-.78h-4c.01 1.1.9 2 2.01 2z'></path></svg>";

    this.wordInEngContainer = new Component(this.element, "div", ["sprintWordInEng-container"]);
    this.wordInEng = new Component(this.wordInEngContainer.element, "p", ["sprintWordInEng"], "satisfy");

    this.wordInRuContainer = new Component(this.element, "div", ["sprintWordInRu-container"]);
    this.wordInRu = new Component(this.wordInRuContainer.element, "p", ["sprintWordInRu"], "эмоция");

    this.answersBtnsContainer = new Component(this.element, "div", ["sprintAnswersBtns-container"]);
    this.answerFalseBtn = new UIButton(this.answersBtnsContainer.element, ["sprintAnswerFalse-btn"], "Incorrect");
    this.answerTrueBtn = new UIButton(this.answersBtnsContainer.element, ["sprintAnswerTrue-btn"], "Correct");



    this.audioPlayer = new Component(this.element, "audio", ["sprintAudioPlayer"]);
    this.audioPlayer.element.style.cssText = "display: none; visibility: hidden";
    // (this.audioPlayer.element as HTMLAudioElement).volume = 0;
  }

  clearLamp() {
    [this.gameSignalOne.element, this.gameSignalTwo.element, this.gameSignalThree.element].forEach(lampElement => {
      lampElement.classList.toggle("activate", false);
    });

  }


}

export default SprintGamePage;