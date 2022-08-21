import { Component } from "../utils/component";
import SprintIntro from "../components/sprint/intro-page";
import SprintGamePage from "../components/sprint/game-page";
import {SprintResultesPage} from "../components/sprint/sprint-results-page";

import "../pages/sprint.scss";

export class Sprint extends Component {
  private sprintIntroCard;
  private sprintGamePage;
  private sprintResultsPage;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["sprint"]);

    this.sprintIntroCard = new SprintIntro(this.element);
    this.sprintGamePage = new SprintGamePage(this.element);
    this.sprintResultsPage = new SprintResultesPage(this.element);

    //** Sprint intro page **//

    [this.sprintIntroCard.cardBtn1, this.sprintIntroCard.cardBtn2, this.sprintIntroCard.cardBtn3, this.sprintIntroCard.cardBtn4, this.sprintIntroCard.cardBtn5, this.sprintIntroCard.cardBtn6].forEach((btn) => {
      btn.element.addEventListener("click", () => {
        this.sprintIntroCard.element.style.display = "none";
        this.sprintGamePage.element.style.display = "flex";
      });
    });

    //** Sprint game page **//

    this.sprintGamePage.soundToggleBtn.element.addEventListener("click", () => {
      this.sprintGamePage.soundToggleBtn.element.classList.toggle("active");
    });

    this.sprintGamePage.toFullScreenBtn.element.addEventListener("click", () => {
      const el = document.documentElement,
        rfs = el.requestFullscreen;

      if(typeof rfs!="undefined" && rfs){
        rfs.call(el);
      }
      if(document.fullscreenElement !== null) {
        document.exitFullscreen();
      }
    });

    this.sprintGamePage.toSprintIntroPageBtn.element.addEventListener("click", () => {
      this.sprintIntroCard.element.style.display = "flex";
      this.sprintGamePage.element.style.display = "none";
    });
  }

}