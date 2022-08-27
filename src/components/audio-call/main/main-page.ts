import { Component } from "../../../utils/component";
import ProgressBar from "progressbar.js";
import Circle from "progressbar.js/circle";
import "./main-page.scss";
import { UIButton } from "../../UI/button";
import { getWordsByChapterAndPage } from "../../../utils/loader";
import { BASE_URL, IWordsElement } from "../../../interfaces";

export class AudioCallMainPage extends Component {
  private audioCallHeader: Component;
  private audioCallContent: Component;
  private audioCallControls: Component;
  private controlsVolume: UIButton;
  private controlsScreen: UIButton;
  private controlsClose: UIButton;
  private voiceWrapper: Component;
  private voiceBtn: UIButton;
  private audio: Component;
  private audioResult: Component;
  private actionBtn: UIButton;
  private audioCallProgressbar: Component;
  private progressbarCount: Component;
  private listWords: Component;
  listBtn: UIButton | undefined;
  listItem: Component | undefined;
  private bar: Circle;
  valChapter = 0;
  arrWords: IWordsElement[] = [];
  randomNum!: IWordsElement;

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
    this.audio = new Component(this.voiceWrapper.element, "audio", [],);
    this.audioResult = new Component(this.voiceWrapper.element, "audio", [],);
    this.listWords = new Component(this.audioCallContent.element, "ul", ["master-words", "words"]);
    this.actionBtn = new UIButton(this.audioCallContent.element, ["master-action__btn", "btn"], "I don't know");
    
    this.audioCallProgressbar.element.setAttribute("id", "container");

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

    this.controlsClose.element.addEventListener("click", () => {
      (<HTMLElement>document.querySelector(".master")).style.display = "none";
      (<HTMLElement>document.querySelector(".home")).style.display = "flex";
    });

    (<HTMLElement>document.querySelector(".home-lvl__btns")).addEventListener("click", (e) => {
      this.listWords.element.innerHTML = "";
      const eventTarget = e.target as HTMLElement;
      const { id } = eventTarget;
      this.valChapter = +id;
      
      if (eventTarget.classList.contains("home-btn")) {
        (<HTMLElement>document.querySelector(".master")).style.display = "flex";
        (<HTMLElement>document.querySelector(".home")).style.display = "none";
        this.getWords(this.valChapter);
      }
    });
    
    this.voiceBtn.element.addEventListener("click", () => {
      (<HTMLAudioElement>this.audio.element).play();
    });
    
    this.listWords.element.addEventListener("click", this.guessWord, {once: true});
    
    this.bar.animate(0.0);
  }
  getWords = (numChapter: number) => {
    getWordsByChapterAndPage(numChapter,0).then( data => {
      this.arrWords = data.map( (dataItm: IWordsElement, idx: number) => {
        if(idx < 5) {
          this.listItem = new Component(this.listWords.element, "li", ["words-item"],);
          this.listBtn = new UIButton(this.listItem.element, ["words-btn", "btn"], `${idx + 1}. ${dataItm.wordTranslate}`);
          this.listBtn.element.setAttribute("id", dataItm.word);
          return dataItm;
        }
      }).filter( (dataItm: IWordsElement) => dataItm !== undefined);
      
      this.randomNum = this.getRandomNum(this.arrWords);

      this.audio.element.setAttribute("src", BASE_URL + this.randomNum.audio);
      this.audio.element.setAttribute("autoplay", "");
    });
  };

  getRandomNum = (arr: IWordsElement[]) => {
    const randomNum = Math.floor(Math.random() * arr.length);
    const randomElem = arr[randomNum];
    return randomElem;
  };

  guessWord = (e: Event) => {
    const eventTarget = e.target as HTMLElement;
    if (eventTarget.classList.contains("words-btn")) {
      const { id } = eventTarget;
      if(this.randomNum.word === id) {
        eventTarget.style.background = "#67db67";
        this.audioResult.element.setAttribute("src", "../../../../public/audio/win.mp3");
      } else {
        eventTarget.style.background = "#ff4c4c";
        this.audioResult.element.setAttribute("src", "../../../../public/audio/wrong.mp3");
      }
      (<HTMLAudioElement>this.audioResult.element).play();
    }
  };
}