import {Component} from "../component";

class SprintResultesPage extends Component {
  toSprintGamePageBtn;
  title;
  results;
  result;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["sprint-resultsPage__container"]);
    this.element.style.display = "none";

    this.toSprintGamePageBtn = new Component(this.element, "div", ["toSprintGamePage-btn"]);
    this.title = new Component(this.element, "h3", ["sprintGameReults-title"], "Результаты");
    this.results = new Component(this.element, "div", ["sprint-results__container"]);

    this.result = new SprintResult(this.results.element);
    this.result = new SprintResult(this.results.element);
    this.result = new SprintResult(this.results.element);

  }
}


class SprintResult extends Component {
  soundOnOffBtn;
  wordInEng;
  wordInEngTranscription;
  wordInRu;
  wordCheckingResultImg;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["sprint-result__wrap"]);

    this.soundOnOffBtn = new Component(this.element, "div", ["sprintReultSound-btn"]);
    this.wordInEng = new Component(this.element, "div", ["sprintResultWordInEng"], "criticize");
    this.wordInEngTranscription = new Component(this.element, "div", ["sprintResultWordInEng-transcription"], "[krítisàiz]");
    this.wordInRu = new Component(this.element, "div", ["sprintResultWordInRu"], "критиковать");
    this.wordCheckingResultImg = new Component(this.element, "div", ["sprintResultWordCheckingResult-img", "true"]);
  }
}

export {SprintResultesPage, SprintResult};


