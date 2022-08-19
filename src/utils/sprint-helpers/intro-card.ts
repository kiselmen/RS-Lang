import {Component} from "../component";

class SprintIntroCard extends Component{

  private cardTitle;
  private cardTextContent;
  private cardBtnsContainer;
  cardBtn1;
  cardBtn2;
  cardBtn3;
  cardBtn4;
  cardBtn5;
  cardBtn6;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["sprintIntro-card__wrap"]);

    this.cardTitle = new Component(this.element, "h3", ["sprintIntro-card__title"], "Спринт");
    this.cardTextContent = new Component(this.element, "p", ["sprintIntro-card__content"], "Тренирует навык быстрого перевода с английского языка на русский. Вам нужно выбрать соответствует ли перевод предложенному слову.");

    this.cardBtnsContainer = new Component(this.element, "div", ["sprintIntro-card__Btns"]);
    this.cardBtn1 = new Component(this.cardBtnsContainer.element, "button", ["sprintIntro-card__Btn", "btn-1"], "1");
    this.cardBtn2 = new Component(this.cardBtnsContainer.element, "button", ["sprintIntro-card__Btn", "btn-2"], "2");
    this.cardBtn3 = new Component(this.cardBtnsContainer.element, "button", ["sprintIntro-card__Btn", "btn-3"], "3");
    this.cardBtn4 = new Component(this.cardBtnsContainer.element, "button", ["sprintIntro-card__Btn", "btn-4"], "4");
    this.cardBtn5 = new Component(this.cardBtnsContainer.element, "button", ["sprintIntro-card__Btn", "btn-5"], "5");
    this.cardBtn6 = new Component(this.cardBtnsContainer.element, "button", ["sprintIntro-card__Btn", "btn-6"], "6");
  }

  private startSprint() {
    return null;
  }

}

export default SprintIntroCard;