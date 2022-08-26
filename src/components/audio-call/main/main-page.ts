import { Component } from "../../../utils/component";
import ProgressBar from "progressbar.js";
import Circle from "progressbar.js/circle";
import "./main-page.scss";
import { UIButton } from "../../UI/button";
import { getWordsByChapterAndPage } from "../../../utils/loader";

export class AudioCallMainPage extends Component {
  private audioCallHeader: Component;
  private audioCallContent: Component;
  private audioCallControls: Component;
  private controlsVolume: UIButton;
  private controlsScreen: UIButton;
  private controlsClose: UIButton;
  private voiceWrapper: Component;
  private voiceBtn: UIButton;
  private actionBtn: UIButton;
  private audioCallProgressbar: Component;
  private progressbarCount: Component;
  private listWords: Component;
  listBtn: UIButton | undefined;
  listItem: Component | undefined;
  private bar: Circle;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["audiocall-main", "master"]);

    this.audioCallHeader = new Component(this.element, "div", ["master-header"]);
    this.audioCallContent = new Component(this.element, "div", ["master-content"]);
    this.audioCallControls = new Component(this.audioCallHeader.element, "div", ["master-controls", "controls"]);
    this.controlsVolume = new UIButton(this.audioCallControls.element, ["controls-btn", "btn", "controls-volume"], "");
    this.controlsScreen = new UIButton(this.audioCallControls.element, ["controls-btn", "btn", "controls-fullscreen"], "");
    this.controlsClose = new UIButton(this.audioCallControls.element, ["controls-btn", "btn", "controls-close"], "");
    this.audioCallProgressbar = new Component(this.audioCallHeader.element, "div", ["master-progressbar"]);
    this.progressbarCount = new Component(this.audioCallProgressbar.element, "span", ["master-progressbar__count"],);
    this.voiceWrapper = new Component(this.audioCallContent.element, "div", ["master-voice"],);
    this.voiceBtn = new UIButton(this.voiceWrapper.element, ["master-voice__btn", "btn"], "");
    this.listWords = new Component(this.audioCallContent.element, "ul", ["master-words", "words"]);
    this.actionBtn = new UIButton(this.audioCallContent.element, ["master-action__btn", "btn"], "I don't know");
    
    this.audioCallProgressbar.element.setAttribute("id", "container");
    this.controlsClose.element.addEventListener("click", () => {
      (<HTMLElement>document.querySelector(".master")).style.display = "none";
      (<HTMLElement>document.querySelector(".home")).style.display = "flex";
    });
    
    this.bar = new ProgressBar.Circle(this.audioCallProgressbar.element, {
      strokeWidth: 6,
      easing: "easeInOut",
      duration: 1400,
      color: "#ff9f00",
      trailColor: "#f6e369",
      trailWidth: 4,
      svgStyle: null,
      step: function(state, circle) {
        const value = Math.round(circle.value() * 100);
        if (value === 0) {
          (<HTMLElement>document.querySelector(".master-progressbar__count")).innerHTML = "0%";
        } else {
          (<HTMLElement>document.querySelector(".master-progressbar__count")).innerHTML = `${value}%`;
        }
      }
    });
    this.bar.animate(0.0);
    this.getWords();
  }
  getWords = () => {
    getWordsByChapterAndPage(0,0).then( data => {
      data.map( (dataItm: { word: string; }, idx: number) => {
        if(idx < 5) {
          this.listItem = new Component(this.listWords.element, "li", ["words-item"],);
          this.listBtn = new UIButton(this.listItem.element, ["words-btn", "btn"], `${idx + 1}. ${dataItm.word}`);
        }
      });
    });
  };
}