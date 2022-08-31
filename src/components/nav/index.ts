import { Component } from "../../utils/component";
import "./styles.scss";

export class Nav extends Component {

  navBody: Component;  
  private linkToAbout: Component;
  private linkToDictionary: Component;
  private linkToAudioCall: Component;
  private linkToSprint: Component;
  private linkToLogin: Component | null;
  private linkToProfile: Component | null;
  
  navItems: Component[] = [];
  
  constructor(parentNode: HTMLElement) {
    super(parentNode, "nav", ["nav"], "");
    this.navBody = new Component(this.element, "div", ["nav-body"]);
    this.linkToAbout = new Component(this.navBody.element, "a", ["nav-link"], "About");
    this.linkToDictionary = new Component(this.navBody.element, "a", ["nav-link"], "Dictionary");
    this.linkToAudioCall = new Component(this.navBody.element, "a", ["nav-link"], "Audio call");
    this.linkToSprint = new Component(this.navBody.element, "a", ["nav-link"], "Sprint");
    this.linkToLogin = null;
    this.linkToProfile = null;

    this.linkToAbout.element.setAttribute("href", "#/");
    this.linkToDictionary.element.setAttribute("href", "#/dictionary");
    this.linkToAudioCall.element.setAttribute("href", "#/audiocall");
    this.linkToSprint.element.setAttribute("href", "#/sprint");
    this.linkToAbout.element.setAttribute("tabindex", "-1");
    this.linkToDictionary.element.setAttribute("tabindex", "-1");
    this.linkToAudioCall.element.setAttribute("tabindex", "-1");
    this.linkToSprint.element.setAttribute("tabindex", "-1");

    // this.element.addEventListener("click", (e: Event) => this.onNavClick(e));
    this.onInitNavSignUser();

    // this.navItems = [this.linkToAbout, this.linkToDictionary, this.linkToAudioCall, this.linkToSprint, this.linkToLogin, this.linkToProfile];

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
    if (this.element.classList.contains("open") || this.element.classList.contains("close")) {
      this.element.classList.toggle("open");
      this.element.classList.toggle("close");
    } else {
      this.element.classList.add("open");
    }
  };

  onInitNavSignUser: () => void = () => {
    if (localStorage.getItem("token")) {
      if (!this.linkToProfile) {
        this.linkToProfile = new Component(this.navBody.element, "a", ["nav-link"], "Profile");
        this.linkToProfile.element.setAttribute("href", "#/profile");
        this.linkToProfile.element.setAttribute("tabindex", "-1");
      }
      if (this.linkToLogin) {
        this.linkToLogin.element.remove();
        this.linkToLogin = null;
      }
      this.navItems = [this.linkToAbout, this.linkToDictionary, this.linkToAudioCall, this.linkToSprint, this.linkToProfile];
    } else {
      if (!this.linkToLogin) {
        this.linkToLogin = new Component(this.navBody.element, "a", ["nav-link"], "Login");
        this.linkToLogin.element.setAttribute("href", "#/login");
        this.linkToLogin.element.setAttribute("tabindex", "-1");
      }
      if (this.linkToProfile) {
        this.linkToProfile.element.remove();
        this.linkToProfile = null;
      }
      this.navItems = [this.linkToAbout, this.linkToDictionary, this.linkToAudioCall, this.linkToSprint, this.linkToLogin];
    }
  };
}