import { Component } from "../../../utils/component";
import Circle from "progressbar.js/circle";
import "./main-page.scss";
import { UIButton } from "../../UI/button";
import { getWordsByChapterAndPage } from "../../../utils/loader";
import { BASE_URL, IWordsElement } from "../../../interfaces";
import { progressBarMixin } from "../progressBar";


export let correctWords: IWordsElement[] = [];
export let wrongWords: IWordsElement[] = [];

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
  private progressVal = 0;
  private listWords: Component;
  private textDontKnow: Component;
  private textNext: Component;
  listBtn!: UIButton;
  listItem!: Component;
  private bar: Circle;
  valChapter = 0;
  valPage = 0;
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
    for(let i = 0; i < 5; i+=1) {
      this.listItem = new Component(this.listWords.element, "li", ["words-item"],);
      this.listBtn = new UIButton(this.listItem.element, ["words-btn", "btn"], "");
    }
    this.actionBtn = new UIButton(this.audioCallContent.element, ["master-action__btn", "btn"], "");
    this.textDontKnow = new Component(this.actionBtn.element, "span", ["action-item"], "I don't know");
    this.textNext = new Component(this.actionBtn.element, "span", ["action-item", "next"], "Next");
    
    this.audioCallProgressbar.element.setAttribute("id", "container");

    this.bar = progressBarMixin(this.audioCallProgressbar.element);

    this.controlsClose.element.addEventListener("click", () => {
      this.progressVal = 0;
      correctWords = [];
      wrongWords = [];
      this.bar.animate(0);
      (<HTMLElement>document.querySelector(".master")).style.display = "none";
      (<HTMLElement>document.querySelector(".home")).style.display = "flex";
    });
    
    (<HTMLElement>document.querySelector(".home-lvl__btns")).addEventListener("click", (e) => {
      const eventTarget = e.target as HTMLElement;
      const { id } = eventTarget;
      this.valChapter = +id;
      
      if (eventTarget.classList.contains("home-btn")) {
        (<HTMLElement>document.querySelector(".master")).style.display = "flex";
        (<HTMLElement>document.querySelector(".home")).style.display = "none";
        this.textDontKnow.element.style.display = "flex";
        this.textNext.element.style.display = "none";
        this.getWords(this.valChapter, this.valPage);
      }
    });
    
    this.voiceBtn.element.addEventListener("click", () => {
      (<HTMLAudioElement>this.audio.element).play();
    });

    this.textDontKnow.element.addEventListener("click", () => {
      this.getCorrectWord();
      wrongWords.push(this.randomNum);
    });

    this.textNext.element.addEventListener("click", () => this.getWords(this.valChapter, this.valPage +=1));
    
    this.listWords.element.addEventListener("click", this.guessWord);
  }

  getWords = (numChapter: number, numPage: number) => {
    document.querySelectorAll(".words-btn").forEach( el => {
      el.innerHTML = "";
      el.removeAttribute("disabled");
      (<HTMLElement>el).style.background = "transparent";
    });
    this.voiceWrapper.element.style.background = `none`;
    this.voiceBtn.element.classList.remove("showPicture");
    this.textDontKnow.element.style.display = "flex";
    this.textNext.element.style.display = "none";
    getWordsByChapterAndPage(numChapter, numPage).then( data => {
      this.arrWords = data.map( (dataItm: IWordsElement, idx: number) => {
        if(idx < 5) {
          const wordBtn = (<HTMLElement>document.querySelectorAll(".words-btn")[idx]);
          wordBtn.innerHTML = `${idx + 1}. ${dataItm.wordTranslate}`;
          wordBtn.setAttribute("id", dataItm.word);
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
        this.bar.animate(this.progressVal += 0.1);
        localStorage.setItem("progressbarVal", `${this.progressVal}`);
        correctWords.push(this.randomNum);
      } else {
        eventTarget.style.background = "#ff4c4c";
        this.audioResult.element.setAttribute("src", "../../../../public/audio/wrong.mp3");
        wrongWords.push(this.arrWords.filter( el => el.word === id)[0]);
      }
      (<HTMLAudioElement>this.audioResult.element).play();
      this.getCorrectWord();
    }
  };
  
  getCorrectWord = () => {
    document.querySelectorAll(".words-btn").forEach( el => {
      if (el.id === this.randomNum.word) {
        (<HTMLElement>el).style.background = "#67db67";
        this.voiceWrapper.element.style.background = `url(${BASE_URL + this.randomNum.image}) center / contain no-repeat`;
        this.voiceBtn.element.classList.add("showPicture");
      }
      el.setAttribute("disabled", "true");
      this.textDontKnow.element.style.display = "none";
      this.textNext.element.style.display = "flex";
    });
  };
}