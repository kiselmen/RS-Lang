import "../styles/about.scss";
import { Component } from "../utils/component";
import {AboutTeam} from "../components/about/about-team";
import AboutRsLang from "../components/about/about-rs-lang";

export class About extends Component {
  private controlsWrap;
  private aboutProgectBtn;
  private aboutTeamBtn;
  private aboutTeamPage;
  private aboutRSLang;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["about"]);

    this.controlsWrap = new Component(this.element, "div", ["aboutControls-wrap"]);
    this.aboutProgectBtn = new Component(this.controlsWrap.element, "button", ["aboutProgect-btn", "about-btn", "active"], "About project");
    this.aboutTeamBtn = new Component(this.controlsWrap.element, "button", ["aboutTeam-btn", "about-btn"], "About team");
    this.aboutTeamPage = new AboutTeam(this.element);
    this.aboutRSLang = new AboutRsLang(this.element);



    [this.aboutTeamBtn.element, this.aboutProgectBtn.element].forEach(btn => {
      btn.addEventListener("click", (e) => {
        if(e.target === this.aboutTeamBtn.element) {
          this.aboutTeamBtn.element.classList.toggle("active", true);
          this.aboutProgectBtn.element.classList.toggle("active", false);
          
          this.aboutTeamPage.element.style.display = "block";
          this.aboutRSLang.element.style.display = "none";
        } else {
          this.aboutTeamBtn.element.classList.toggle("active", false);
          this.aboutProgectBtn.element.classList.toggle("active", true);

          this.aboutTeamPage.element.style.display = "none";
          this.aboutRSLang.element.style.display = "flex";
        }
      });
    });

  }
}