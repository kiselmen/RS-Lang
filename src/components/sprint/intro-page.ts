import {Component} from "../../utils/component";
import {UIButton} from "../UI/button";

class SprintIntro extends Component {

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
    this.cardBtn1 = new UIButton(this.cardBtnsContainer.element, ["sprintIntro-card__Btn"], "1");
    this.cardBtn2 = new UIButton(this.cardBtnsContainer.element, ["sprintIntro-card__Btn"], "2");
    this.cardBtn3 = new UIButton(this.cardBtnsContainer.element, ["sprintIntro-card__Btn"], "3");
    this.cardBtn4 = new UIButton(this.cardBtnsContainer.element, ["sprintIntro-card__Btn"], "4");
    this.cardBtn5 = new UIButton(this.cardBtnsContainer.element, ["sprintIntro-card__Btn"], "5");
    this.cardBtn6 = new UIButton(this.cardBtnsContainer.element, ["sprintIntro-card__Btn"], "6");

    this.cardBtn1.element.style.background = "#FA8072";
    this.cardBtn2.element.style.background = "#00FFFF";
    this.cardBtn3.element.style.background = "#DC143C";
    this.cardBtn4.element.style.background = "#FF00FF";
    this.cardBtn5.element.style.background = "#FF4500";
    this.cardBtn6.element.style.background = "#FFA500";
  }

  private startSprint() {
    return null;
  }

}

export default SprintIntro;