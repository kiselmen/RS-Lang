import {Component} from "../../utils/component";

class SprintResultesPage extends Component {
  toSprintGamePageBtn;
  title;
  results;
  result: SprintResult | undefined;
  specialFunc: () => void = () => console.log("to do something");

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["sprint-resultsPage__container"]);
    this.element.style.display = "none";


    this.toSprintGamePageBtn = new Component(this.element, "div", ["toSprintGamePage-btn"]);
    this.title = new Component(this.element, "h3", ["sprintGameReults-title"], "Results");
    this.results = new Component(this.element, "div", ["sprint-results__container"]);

    // this.result = new SprintResult(this.results.element);
    // this.result = new SprintResult(this.results.element);
    // this.result = new SprintResult(this.results.element);
  }

  clearResults() {
    this.results.element.innerHTML = "";
  }
}


class SprintResult extends Component {
  soundOnOffBtn;
  wordInEng;
  wordInEngTranscription;
  wordInRu;
  wordPronunLink;
  wordCheckingResultImg;
  specialFunc: () => void = () => console.log("to do something");

  constructor(parentNode: HTMLElement, wordInEng: string, wordInEngTranscription: string, wordInRu: string, wordVoiceLink: string, boolean: boolean) {
    super(parentNode, "div", ["sprint-result__wrap"]);

    this.soundOnOffBtn = new Component(this.element, "div", ["sprintReultSound-btn"]);
    this.wordInEng = new Component(this.element, "div", ["sprintResultWordInEng"], wordInEng);
    this.wordInEngTranscription = new Component(this.element, "div", ["sprintResultWordInEng-transcription"], wordInEngTranscription);
    this.wordInRu = new Component(this.element, "div", ["sprintResultWordInRu"], wordInRu);
    this.wordPronunLink = wordVoiceLink;

    if(boolean) {
      this.wordCheckingResultImg = new Component(this.element, "div", ["sprintResultWordCheckingResult-img", "true"]);
    } else {
      this.wordCheckingResultImg = new Component(this.element, "div", ["sprintResultWordCheckingResult-img", "false"]);
    }

    this.soundOnOffBtn.element.onclick = () =>  this.specialFunc();
  }
}

export {SprintResultesPage, SprintResult};


