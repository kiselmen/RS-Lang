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
      this.homeLvlBtns.element.setAttribute("id", `${i}`);
    }
    this.linkMainPage = new Component(this.homeContent.element, "a", ["btn", "home-link__back"], "Back to main page"
    );

    this.linkMainPage.element.setAttribute("href", "#/");
    this.linkMainPage.element.setAttribute("tabindex", "0");

    let position = 0;
    document.addEventListener("keydown", (event) => {
      const homeBtns = document.querySelectorAll(".home-btn") as NodeListOf<HTMLElement>;
      const homeBtnBack = document.querySelector(".home-link__back") as HTMLElement;

      if (event.code !== "ArrowRight" && event.code !== "ArrowLeft" &&
      event.code !== "ArrowUp" && event.code !== "ArrowDown") {
        event.preventDefault();
      }

      if (event.code === "ArrowRight") {
        if (position === 6) {
          position = 0;
        }
        homeBtns[position].focus();
        position++;
      } else if (event.code === "ArrowLeft") {
        if (position === 0) {
          position = homeBtns.length;
        } else if (position === 1) {
          position = 7;
        }
        position -= 2;
        homeBtns[position].focus();
        position++;
      } else if (event.code === "ArrowDown") {
        homeBtnBack.focus();
      }
      event.preventDefault();
    });
  }
}