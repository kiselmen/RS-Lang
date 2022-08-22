import { Component } from "../utils/component";
import "./about.scss";

export class About extends Component {
  private controlsWrap;
  private aboutProgectBtn;
  private aboutPTeamBtn;

  constructor(parentNode: HTMLElement) {    
    super(parentNode, "div", ["about"]);

    this.controlsWrap = new Component(this.element, "div", ["aboutControls-wrap"]);
    this.aboutProgectBtn = new Component(this.controlsWrap.element, "button", ["aboutProgect-btn"], "About project");
    this.aboutPTeamBtn = new Component(this.controlsWrap.element, "button", ["aboutProgect-btn"], "About team");

  }
}