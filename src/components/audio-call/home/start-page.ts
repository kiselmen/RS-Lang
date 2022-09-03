import { Component } from "../../../utils/component";
import { UIButton } from "../../UI/button";
import "./start-page.scss";
import { dataAudiocall } from "../main/main-page";
import { elementData } from "../../../interfaces";

export class AudioCallStartPage extends Component {
  private homeHeading: Component;
  private homeContent: Component;
  private homeDescription: Component;
  private homeBtnsChoose: Component;
  private homeLvl: Component;
  private homeLvlBtnsWrapper: Component;
  homeLvlBtns: UIButton | undefined;
  private linkMainPage: Component;
  
  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["audiocall-home", "home"]);
    
    this.homeHeading = new Component(this.element, "h2", ["home-heading"], "Audio Сall Game");
    this.homeContent = new Component(this.element, "div", ["home-content"]);
    this.homeDescription = new Component(this.homeContent.element, "p", ["home-content__descript"], "It will help to understand the pronunciation of sounds, words and connectives in phrases. Improves listening comprehension.");
    this.homeLvl = new Component(this.homeContent.element, "div", ["home-lvl"]);
    this.homeBtnsChoose = new Component(this.homeLvl.element, "span", ["home-lvl__span"], "Choose a level:");
    this.homeLvlBtnsWrapper = new Component(this.homeLvl.element, "div", ["home-lvl__btns"]);
    for(let i = 0; i < 6; i+=1) {
      this.homeLvlBtns = new UIButton(this.homeLvlBtnsWrapper.element, ["btn", "home-btn"], `${i+1}`);
      this.homeLvlBtns.element.setAttribute("id", `${i}`);
    }
    this.linkMainPage = new Component(this.homeContent.element, "a", ["btn", "home-link__back"], "Back to main page"
    );

    this.linkMainPage.element.setAttribute("href", "#/");
    this.linkMainPage.element.setAttribute("tabindex", "0");
    console.log("Start game");
    this.initStatisticData();
  }

  initStatisticData(){
    const isLogin = localStorage.getItem("token");
    if (isLogin) {
      // console.log(Авторизован");
      const audiocallStorage = localStorage.getItem("audiocall");
      if (audiocallStorage){
        const audioCallStata = JSON.parse(audiocallStorage);
        if (!audioCallStata.maxSeria) audioCallStata.maxSeria = 0;
        if (!audioCallStata.currSeria) audioCallStata.currSeria = 0;
        if (audioCallStata.dayStata) {
          const day = this.getTodayInString();
          const isDay = audioCallStata.dayStata.filter( (item: elementData) => item.day === day);
          if (isDay.length === 0) {
            const currentDataStata = this.createNewDayStata();
            audioCallStata.dayStata.push(currentDataStata);
          }
        } else {
          audioCallStata.dayStata = [];
          const currentDataStata = this.createNewDayStata();
          audioCallStata.dayStata.push(currentDataStata);
        }
        localStorage.setItem("audiocall", JSON.stringify(audioCallStata));
        dataAudiocall.maxSeries = audioCallStata.maxSeria;
      } else {
        const audioCallStata = {
          maxSeria: 0,
          currSeria: 0,
          dayStata : [] as elementData[],
        };
        const currentDataStata = this.createNewDayStata();
        audioCallStata.dayStata.push(currentDataStata);
        localStorage.setItem("audiocall", JSON.stringify(audioCallStata));
        dataAudiocall.maxSeries = audioCallStata.maxSeria;
      }
    }
  }

  getTodayInString(): string {
    const currDay = new Date();
    const day = String(currDay.getFullYear()) + "-" + String(currDay.getMonth()) + "-" + String(currDay.getDate());
    return day;
  }

  createNewDayStata(){
    const day = this.getTodayInString();
    return {
      day: day,
      newWords: "0",
      totalQuestions: "0",
      correctAnswers: "0",
    } as elementData;
  }
}

