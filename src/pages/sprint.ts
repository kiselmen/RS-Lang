import { Component } from "../utils/component";
import SprintIntroCard from "../utils/sprint-helpers/intro-card";
import "../pages/sprint.scss";

export class Sprint extends Component {
  private sprintIntroCard;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["sprint"]);

    this.sprintIntroCard = new SprintIntroCard(this.element);

    [this.sprintIntroCard.cardBtn1, this.sprintIntroCard.cardBtn2, this.sprintIntroCard.cardBtn3, this.sprintIntroCard.cardBtn4, this.sprintIntroCard.cardBtn5, this.sprintIntroCard.cardBtn6].forEach((btn) => {
      btn.element.addEventListener("click", (e) => {
        console.log(e.target + " was clicked");
      });
    });
  }

}