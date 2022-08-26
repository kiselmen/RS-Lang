import { Component } from "../../../utils/component";
import { UIButton } from "../../UI/button";
import "./start-page.scss";

export class AudioCallStartPage extends Component {
  private homeHeading: Component;
  private homeContent: Component;
  private homeDescription: Component;
  private homeBtnsChoose: Component;
  private homeLvl: Component;
  private homeLvlBtnsWrapper: Component;
  homeLvlBtns: UIButton | undefined;
  private linkMainPage: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["audiocall-home", "home"]);

    this.homeHeading = new Component(this.element, "h2", ["home-heading"], "Audio Сall Game");
    this.homeContent = new Component(this.element, "div", ["home-content"]);
    this.homeDescription = new Component(this.homeContent.element, "p", ["home-content__descript"], "It will help to understand the pronunciation of sounds, words and connectives in phrases. Improves listening comprehension.");
    this.homeLvl = new Component(this.homeContent.element, "div", ["home-lvl"]);
    this.homeBtnsChoose = new Component(this.homeLvl.element, "span", ["home-lvl__span"], "Choose a level:");
    this.homeLvlBtnsWrapper = new Component(this.homeLvl.element, "div", ["home-lvl__btns"]);
    for(let i = 0; i < 6; i+=1) {
      this.homeLvlBtns = new UIButton(this.homeLvlBtnsWrapper.element, ["btn", "home-btn"], `${i+1}`);
    }
    this.linkMainPage = new Component(this.homeContent.element, "a", ["btn", "home-link__back"], "Back to main page"
    );

    this.linkMainPage.element.setAttribute("href", "#/");

    this.homeLvlBtnsWrapper.element.addEventListener("click", (e) => {
      const eventTarget = e.target as HTMLElement;
      if (eventTarget.classList.contains("home-btn")) {
        (<HTMLElement>document.querySelector(".master")).style.display = "flex";
        (<HTMLElement>document.querySelector(".home")).style.display = "none";
      }
    });
  }
}