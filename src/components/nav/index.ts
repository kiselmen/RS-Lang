import { Component } from "../../utils/component";
import "./styles.scss";

export class Nav extends Component {

  private navBody: Component;  
  private linkToAbout: Component;
  private linkToDictionary: Component;
  private linkToAudioCall: Component;
  private linkToSprint: Component;
  
  navItems: Component[] = [];
  
  constructor(parentNode: HTMLElement) {
    super(parentNode, "nav", ["nav", "close"], "");
    this.navBody = new Component(this.element, "div", ["nav-body"]);
    this.linkToAbout = new Component(this.navBody.element, "a", ["nav-link"], "About");
    this.linkToDictionary = new Component(this.navBody.element, "a", ["nav-link"], "Dictionary");
    this.linkToAudioCall = new Component(this.navBody.element, "a", ["nav-link"], "Audio call");
    this.linkToSprint = new Component(this.navBody.element, "a", ["nav-link"], "Sprint");

    this.linkToAbout.element.setAttribute("href", "#/");
    this.linkToDictionary.element.setAttribute("href", "#/dictionary");
    this.linkToAudioCall.element.setAttribute("href", "#/audiocall");
    this.linkToSprint.element.setAttribute("href", "#/sprint");

    // this.element.addEventListener("click", (e: Event) => this.onNavClick(e));

    this.navItems = [this.linkToAbout, this.linkToDictionary, this.linkToAudioCall, this.linkToSprint];

    window.addEventListener("hashchange", () => this.updateActive(this.navItems));
    window.addEventListener("load", () => this.updateActive(this.navItems));

  }

  private updateActive(navItems: Component[]): void {
    this.navItems = navItems.map((item) => {
      item.element.classList.remove("active");
      if (item.element.getAttribute("href") === window.location.hash) {
        item.element.classList.add("active");
      }

      return item;
    });
  }

  onNavClose: () => void = () => {
    this.element.classList.remove("open");
    this.element.classList.add("close");
  };

  onNavToggle: () => void = () => {
    this.element.classList.toggle("open");
    this.element.classList.toggle("close");
  };
}