import { Component } from "../utils/component";
import SprintIntro from "../utils/sprint-helpers/intro-page";
import SprintGamePage from "../utils/sprint-helpers/game-page";

import "../pages/sprint.scss";

export class Sprint extends Component {
  private sprintIntroCard;
  private sprintGamePage;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["sprint"]);

    this.sprintIntroCard = new SprintIntro(this.element);
    this.sprintGamePage = new SprintGamePage(this.element);

    this.sprintGamePage.element.style.display = "none";

    [this.sprintIntroCard.cardBtn1, this.sprintIntroCard.cardBtn2, this.sprintIntroCard.cardBtn3, this.sprintIntroCard.cardBtn4, this.sprintIntroCard.cardBtn5, this.sprintIntroCard.cardBtn6].forEach((btn) => {
      btn.element.addEventListener("click", () => {
        this.sprintIntroCard.element.style.display = "none";
        this.sprintGamePage.element.style.display = "flex";
      });
    });
  }

}