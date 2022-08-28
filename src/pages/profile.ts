import { Component } from "../utils/component";

export class Profile extends Component {
  title;
  contentWrapper;
  todaySubTitle;
  todayContentWrapper;
  todayLearnedWordsStatWrapper;
  todayAudioCallStatWrapper;
  todaySprintStatWrapper;
  allTimeSubTitle;
  allTimeContentWrapper;
  allTimeLearnedWords;
  allTimeProgress;
  learnedWordsCounter;
  learnedWordsTextContentContainer;
  todayAudioCallStatContent;
  todaySprintStatContent;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["profile"]);

    this.title = new Component(this.element, "h3", ["statistics-title"], "Statistics");
    this.contentWrapper = new Component(this.element, "div", ["statisticsContent-wrapper"]);

    this.todaySubTitle = new Component(this.contentWrapper.element, "h3", ["statistics-subTitle", "today-subTitle"], "Today");
    this.todayContentWrapper = new Component(this.contentWrapper.element, "div", ["todayStatistics-wrapper"]);
    this.todayLearnedWordsStatWrapper = new Component(this.todayContentWrapper.element, "div", ["todayLearnedWords-wrapper"]);
    this.todayAudioCallStatWrapper = new Component(this.todayContentWrapper.element, "div", ["todayLearnedWords-wrapper"]);
    this.todaySprintStatWrapper = new Component(this.todayContentWrapper.element, "div", ["todayLearnedWords-wrapper"]);

    this.allTimeSubTitle = new Component(this.contentWrapper.element, "h3", ["statistics-subTitle", "allTime-subTitle"], "All Time");
    this.allTimeContentWrapper = new Component(this.contentWrapper.element, "div", ["allTimeContent-wrapper"]);
    this.allTimeLearnedWords = new Component(this.allTimeContentWrapper.element, "div", ["allTimeLearnedWords-wrapper"]);
    this.allTimeProgress = new Component(this.allTimeContentWrapper.element, "div", ["allTimeProgress-wrapper"]);

    /* Внутиренние блоки */

    this.learnedWordsCounter = new Component(this.todayLearnedWordsStatWrapper.element, "div", ["learnedWords-counter"]);
    this.learnedWordsTextContentContainer = new Component(this.todayLearnedWordsStatWrapper.element, "div", ["learnedWordsTxtContent-container"]);
    new Component(  this.learnedWordsTextContentContainer.element, "div", ["learnedWordsTxtContent-textContent"], "words");
    new Component(  this.learnedWordsTextContentContainer.element, "div", ["learnedWordsTxtContent-textContent"], "were learned");

    this.todayAudioCallStatContent = new StatisticsContentPart(this.todayAudioCallStatWrapper.element, "Audio call");
    this.todaySprintStatContent = new StatisticsContentPart(this.todaySprintStatWrapper.element, "Sprint");

  }
}

class StatisticsContentPart extends Component {
  contentWrapper;
  block1Wrapper;
  block2Wrapper;
  block3Wrapper;
  block1Counter;
  block2Counter;
  block3Counter;

  constructor(parentNode: HTMLElement, title: string) {
    super(parentNode, "div", ["profile"]);

    const partOfClassName = title.toLowerCase().split(" ").join("");

    new Component(this.element, "p", [partOfClassName + "-title"], partOfClassName);
    this.contentWrapper = new Component(this.element, "div", [partOfClassName + "Content-wrapper"]);
    this.block1Wrapper = new Component(this.contentWrapper.element, "div", [partOfClassName + "Block1-wrapper", partOfClassName + "Block-wrapper"]);
    this.block2Wrapper = new Component(this.contentWrapper.element, "div", [partOfClassName + "Block2-wrapper", partOfClassName + "Block-wrapper"]);
    this.block3Wrapper = new Component(this.contentWrapper.element, "div", [partOfClassName + "Block3-wrapper", partOfClassName + "Block-wrapper"]);

    this.block1Counter = new Component(this.block1Wrapper.element, "div", [partOfClassName + "Block1-counter", partOfClassName + "Block-counter"], "0");
    new Component(this.block1Wrapper.element, "p", [partOfClassName + "Block1-textContent", partOfClassName + "Block-textContent"], "words");

    this.block2Counter = new Component(this.block2Wrapper.element, "div", [partOfClassName + "Block2-counter", partOfClassName + "Block-counter"], "0%");
    new Component(this.block1Wrapper.element, "p", [partOfClassName + "Block2-textContent", partOfClassName + "Block-textContent"], "accuracy");

    this.block3Counter = new Component(this.block3Wrapper.element, "div", [partOfClassName + "Block3-counter", partOfClassName + "Block-counter"], "0");
    new Component(this.block1Wrapper.element, "p", [partOfClassName + "Block3-textContent", partOfClassName + "Block-textContent"], "in a row");
  }

  setCounter = (counterNumber: number, value: string): string => {
    return [this.block1Counter, this.block2Counter, this.block3Counter][counterNumber].element.innerText = value;
  };

  getCounter = (counterNumber: number): string => {
    return [this.block1Counter, this.block2Counter, this.block3Counter][counterNumber].element.innerText;
  };

}