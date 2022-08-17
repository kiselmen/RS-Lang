import { Component } from "../../utils/component";
import "./styles.scss";

export class Header extends Component {
  private navItems: Component[] = [];
  private linkToAbout: Component;
  private linkToDictionary: Component;
  private linkToAudioCall: Component;
  private linkToSprint: Component;
  
  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["header"]);
  
    this.linkToAbout = new Component(this.element, "a", ["nav__item"], "About");
    this.linkToDictionary = new Component(this.element, "a", ["nav__item"], "Dictionary");
    this.linkToAudioCall = new Component(this.element, "a", ["nav__item"], "Audio call");
    this.linkToSprint = new Component(this.element, "a", ["nav__item"], "Sprint");

    this.linkToAbout.element.setAttribute("href", "#/");
    this.linkToDictionary.element.setAttribute("href", "#/dictionary");
    this.linkToAudioCall.element.setAttribute("href", "#/audiocall");
    this.linkToSprint.element.setAttribute("href", "#/sprint");
  
    this.navItems = [this.linkToAbout, this.linkToDictionary, this.linkToAudioCall, this.linkToSprint];

    window.addEventListener("hashchange", () => this.updateActive(this.navItems));
    window.addEventListener("load", () => this.updateActive(this.navItems));
  }

  private updateActive(navItems: Component[]): void {
    this.navItems = navItems.map((item) => {
      item.element.classList.remove("nav__item--active");
      if (item.element.getAttribute("href") === window.location.hash) {
        item.element.classList.add("nav__item--active");
      }

      return item;
    });
  }
}