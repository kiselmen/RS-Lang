import Circle from "progressbar.js/circle";
import { BASE_URL, IWordsElement } from "../../../interfaces";
import { Component } from "../../../utils/component";
import { UIButton } from "../../UI/button";
import { correctWords, wrongWords } from "../main/main-page";
import { progressBarMixin } from "../progressBar";
import "./stat-page.scss";

export class AudioCallStatisticPage extends Component {
  private statHeading: Component;
  private statProgressbar: Component;
  private progressbarCount: Component;
  private statTotalCont: Component;
  private statBtnsCont: Component;
  private totalCorrect: Component;
  private totalWrong: Component;
  private correctCont: Component;
  private wrongCont: Component;
  private correctHeading: Component;
  private wrongHeading: Component;
  private btnAgain: UIButton;
  private btnDictionary: UIButton;
  private linkDictionary: Component;
  private linkAgain: Component;
  totalItemHyphen!: Component;
  totalCorrectItem!: Component;
  totalWrongItem!: Component;
  totalItemImg!: Component;
  totalItemEnWord!: Component;
  totalItemRuWord!: Component;
  totalItemBtn!: UIButton;
  bar: Circle;
  totalItem!: Component;
  totalItemAudio!: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["audiocall-stat", "statistic"]);

    this.statHeading = new Component(this.element, "h3", ["statistic-heading"],"Here is your result");
    this.statProgressbar = new Component(this.element, "div", ["master-progressbar", "statistic-progressbar"]);
    this.statTotalCont = new Component(this.element, "div", ["statistic-total", "total"]);
    this.correctCont = new Component(this.statTotalCont.element, "div", ["total-correct__cont"]);
    this.wrongCont = new Component(this.statTotalCont.element, "div", ["total-wrong__cont"]);
    this.totalCorrect = new Component(this.correctCont.element, "ul", ["total-list", "total-correct"]);
    this.correctHeading = new Component(this.totalCorrect.element, "h4", ["total-heading"], "Correct:");
    this.totalWrong = new Component(this.wrongCont.element, "ul", ["total-list", "total-wrong"]);
    this.wrongHeading = new Component(this.totalWrong.element, "h4", ["total-heading"], "Wrong:");
    this.statBtnsCont = new Component(this.element, "div", ["statistic-btns"]);
    this.btnAgain = new UIButton(this.statBtnsCont.element, ["statistic-btns__again"], "Again");
    this.linkAgain = new Component(this.btnAgain.element, "a", ["statistic-link"], "");
    this.btnDictionary = new UIButton(this.statBtnsCont.element, ["statistic-btns__dictionary"], "Dictionary");
    this.linkDictionary = new Component(this.btnDictionary.element, "a", ["statistic-link"], "");

    this.linkAgain.element.setAttribute("href", "#/audiocall");
    this.linkDictionary.element.setAttribute("href", "#/dictionary");
    
    this.progressbarCount = new Component(this.statProgressbar.element, "span", ["master-progressbar__count"],);
    this.bar = progressBarMixin(this.statProgressbar.element);

    (<HTMLElement>document.querySelector(".next")).addEventListener("click", this.updateStat);

    document.addEventListener("keydown", (event) => {
      const isAudiocallMain = document.querySelector(".audiocall-main") as HTMLElement;
      if (isAudiocallMain && isAudiocallMain.style.display === "flex") {
        if (event.code === "Space") {
          this.updateStat();
        }
      }
    });

    this.statTotalCont.element.addEventListener("click", (e) => {
      const eventTarget = e.target as HTMLElement;
      const btn = eventTarget.closest(".total-item__btn");
      if (!btn) return;
      if ((!this.statTotalCont.element.contains(btn))) return;
      (<HTMLAudioElement>btn.querySelector("audio")).play();
    });
  }
  
  createList = (listContainer: HTMLElement, arrayWords: IWordsElement[]) => {
    arrayWords.forEach( el => {
      this.totalItem = new Component(listContainer, "li", ["total-item", "total-correct__item"]);
      this.totalItemBtn = new UIButton(this.totalItem.element, ["total-item__btn"], "");
      this.totalItemImg = new Component(this.totalItemBtn.element, "img", ["total-item__img"]);
      this.totalItemImg.element.setAttribute("src", "../../../../public/volume.svg");
      this.totalItemImg.element.setAttribute("alt", "volume");
      this.totalItemAudio = new Component(this.totalItemBtn.element, "audio", ["total-item__audio"]);
      this.totalItemAudio.element.setAttribute("src", BASE_URL + el.audio);
      this.totalItemEnWord = new Component(this.totalItem.element, "span", ["total-item__word", "total-item__en"], el.word);
      this.totalItemHyphen = new Component(this.totalItem.element, "span", [], "-");
      this.totalItemRuWord = new Component(this.totalItem.element, "span", ["total-item__word"], el.wordTranslate);
    });
  };
  
  updateStat = () => {
    if (correctWords.length + wrongWords.length === 10) {
      const animateVal = localStorage.getItem("progressbarVal") as string;
      (<HTMLElement>document.querySelector(".audiocall-main")).style.display = "none";
      this.element.style.display = "flex";
      this.bar.animate(+animateVal);
      this.createList(this.totalCorrect.element, correctWords);
      this.createList(this.totalWrong.element, wrongWords);
    }
  };

}
