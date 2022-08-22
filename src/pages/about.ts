import "./about.scss";
import { Component } from "../utils/component";
import {AboutTeam} from "../components/about/about-team";

export class About extends Component {
  private controlsWrap;
  private aboutProgectBtn;
  private aboutPTeamBtn;
  private aboutTeamPage;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["about"]);

    this.controlsWrap = new Component(this.element, "div", ["aboutControls-wrap"]);
    this.aboutProgectBtn = new Component(this.controlsWrap.element, "button", ["aboutProgect-btn"], "About project");
    this.aboutPTeamBtn = new Component(this.controlsWrap.element, "button", ["aboutProgect-btn", "active"], "About team");
    this.aboutTeamPage = new AboutTeam(this.element);

  }
}