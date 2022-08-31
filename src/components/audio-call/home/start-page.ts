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
  // private position = 0;
  // private flag = true;
  
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

    // document.addEventListener("keydown", (event) => {
    //   const isAudiocall = document.querySelector(".audiocall") as HTMLElement;
    //   if (isAudiocall) {
    //     const homeBtns = document.querySelectorAll(".home-btn") as NodeListOf<HTMLElement>;
    //     const homeBtnBack = document.querySelector(".home-link__back") as HTMLElement;
  
    //     if (event.code !== "ArrowRight" && event.code !== "ArrowLeft" &&
    //     event.code !== "ArrowUp" && event.code !== "ArrowDown" && event.code !== "Enter") {
    //       event.preventDefault();
    //     }
  
    //     if (event.code === "ArrowRight" && !this.flag) {
    //       if (this.position === 5) {
    //         this.position = -1;
    //       }
    //       this.position += 1;
    //       homeBtns[this.position].focus();
    //     } else if (event.code === "ArrowLeft" && !this.flag) {
    //       if (this.position === 0) {
    //         this.position = homeBtns.length;
    //       } 
    //       this.position -= 1;
    //       homeBtns[this.position].focus();
    //     } else if (event.code === "ArrowDown") {
    //       if (!this.flag) {
    //         homeBtnBack.focus();
    //       } else {
    //         homeBtns[this.position].focus();
    //         this.flag = false;
    //       }
    //     } else if (event.code === "ArrowUp") {
    //       homeBtns[this.position].focus();
    //     }
    //   }
    // });
  }
}

