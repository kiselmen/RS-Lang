import { Component } from "../../../utils/component";
import Circle from "progressbar.js/circle";
import "./main-page.scss";
import { UIButton } from "../../UI/button";
import { getAlluserWords, getWordById, getWordsByChapterAndPage } from "../../../utils/loader";
import { BASE_URL, elementData, IGetUsersWords, IStatisticGame, IWordsElement } from "../../../interfaces";
import { progressBarMixin } from "../progressBar";

export let correctWords: IWordsElement[] = [];
export let wrongWords: IWordsElement[] = [];
export const dataAudiocall: IStatisticGame = {
  totalWords: 0,
  correctWordsPercent: 0,
  series: 0,
  maxSeries :0,
  correctArr: [],
  wrongArr: []
};

export class AudioCallMainPage extends Component {
  private audioCallHeader: Component;
  private audioCallContent: Component;
  private audioCallControls: Component;
  private controlsInfoCont: Component;
  private controlsInfo: UIButton;
  private dropDownList: Component;
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
  private infoHeading: Component;
  private infoVoice: Component;
  private infoChoose: Component;
  private infoNext: Component;
  private infoInfo: Component;
  private infoFullScreen: Component;
  private infoExit: Component;
  private param: string;
  listBtn!: UIButton;
  listItem!: Component;
  private bar: Circle;
  valChapter = 0;
  valPage = 0;
  arrWords: IWordsElement[] = [];
  randomNum!: IWordsElement;

  constructor(parentNode: HTMLElement, parameters: string) {
    super(parentNode, "div", ["audiocall-main", "master"]);

    this.param = parameters;
    this.audioCallHeader = new Component(this.element, "div", ["master-header"]);
    this.audioCallContent = new Component(this.element, "div", ["master-content"]);
    this.audioCallControls = new Component(this.audioCallHeader.element, "div", ["master-controls", "controls"]);
    this.controlsInfoCont = new Component(this.audioCallControls.element, "div", ["controls-btn__cont"],);
    this.controlsInfo = new UIButton(this.controlsInfoCont.element, ["controls-btn", "btn", "controls-info"], "");
    this.dropDownList = new Component(this.controlsInfoCont.element, "div", ["controls-dropDownList", "info"],);
    this.infoHeading = new Component(this.dropDownList.element, "h3", ["info-heading"], "Hotkeys:");
    this.infoVoice = new Component(this.dropDownList.element, "span", ["info-item", "info-voice"],);
    this.infoChoose = new Component(this.dropDownList.element, "span", ["info-item", "info-choose"],);
    this.infoNext = new Component(this.dropDownList.element, "span", ["info-item", "info-next"],);
    this.infoInfo = new Component(this.dropDownList.element, "span", ["info-item", "info-info"],);
    this.infoFullScreen = new Component(this.dropDownList.element, "span", ["info-item", "info-fullscreen"],);
    this.infoExit = new Component(this.dropDownList.element, "span", ["info-item", "info-exit"],);
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
      this.listBtn.element.setAttribute("value", `${i + 1}`);
    }
    this.actionBtn = new UIButton(this.audioCallContent.element, ["master-action__btn", "btn"], "");
    this.textDontKnow = new Component(this.actionBtn.element, "span", ["action-item"], "I don't know");
    this.textNext = new Component(this.actionBtn.element, "span", ["action-item", "next"], "Next");
    
    this.audioCallProgressbar.element.setAttribute("id", "container");
    this.voiceBtn.element.setAttribute("value", "Shift");
    this.textDontKnow.element.setAttribute("id", "Space-Dont");
    this.textNext.element.setAttribute("id", "Space-Next");

    this.infoVoice.element.innerHTML = "Listen: <i>Shift</i>";
    this.infoChoose.element.innerHTML = "Choose: <i>1-5</i>";
    this.infoNext.element.innerHTML = "Next: <i>Space</i>";
    this.infoInfo.element.innerHTML = "Hotkeys: <i>I</i>";
    this.infoFullScreen.element.innerHTML = "Fullscreen: <i>F</i>";
    this.infoExit.element.innerHTML = "Close: <i>Esc</i>";

    this.bar = progressBarMixin(this.audioCallProgressbar.element);

    this.controlsInfo.element.addEventListener("click", () => this.openInfo());

    document.addEventListener("click", (e) => {
      const event = e.target as HTMLElement;
      if (!event.closest(".controls-btn__cont")) {
        this.dropDownList.element.classList.remove("openInfo");
      }
    });

    this.controlsClose.element.addEventListener("click", () => this.closeGame(parameters));

    this.controlsScreen.element.addEventListener("click", () => this.getFullScreen());
    
    (<HTMLElement>document.querySelector(".home-lvl__btns")).addEventListener("click", (e) => {
      const eventTarget = e.target as HTMLElement;
      const { id } = eventTarget;
      this.valChapter = +id;
      
      if (eventTarget.classList.contains("home-btn")) {
        this.hidenIntroPage(this.valChapter, this.valPage);
      }
    });
    
    this.voiceBtn.element.addEventListener("click", () => {
      (<HTMLAudioElement>this.audio.element).play();
    });

    document.addEventListener("keyup", (event) => this.activateKeyboard(event, parameters));

    this.textDontKnow.element.addEventListener("click", () => {
      this.getCorrectWord();
      wrongWords.push(this.randomNum);
    });

    this.textNext.element.addEventListener("click", () => this.getWords(this.valChapter, this.valPage +=1));
    
    this.listWords.element.addEventListener("click", this.guessWord);
    
    if (parameters) {
      const currChapter = Number(localStorage.getItem("chapter"));
      const currPage = Number(localStorage.getItem("page"));
      this.hidenIntroPage(currChapter, currPage);
    }
  }
  
  getWords = (numChapter: number, numPage: number) => {
    document.querySelectorAll(".words-btn").forEach( el => {
      el.innerHTML = "";
      el.removeAttribute("disabled");
      (<HTMLElement>el).style.background = "rgb(228 244 255)";
    });
    this.voiceWrapper.element.style.background = `none`;
    this.voiceBtn.element.classList.remove("showPicture");
    this.textDontKnow.element.style.display = "flex";
    this.textNext.element.style.display = "none";
    if (this.param && Number(localStorage.getItem("chapter")) === 6) {
      numChapter = 6;
      numPage = 0;
    }
    getWordsByChapterAndPage(numChapter, numPage).then( data => {
      if (localStorage.getItem("token")) {
        getAlluserWords().then( async userWords => {
          if (this.param && numChapter === 6) {
            data = [];
            const difficultArr = userWords.filter( (item: IGetUsersWords) => item.difficulty === "hard").map((word:elementData) => word).map( (el: IGetUsersWords) => el.wordId);
            for(let i=0; i< difficultArr.length; i+=1) {
              const word = await getWordById(difficultArr[i]);
              data.push(word);
            }
          } 
          this.getListCards(data);
        });
      } else {
        this.getListCards(data);
      }
    });
  };

  getRandomElem = (arr: IWordsElement[]) => {
    const randomNum = Math.floor(Math.random() * arr.length);
    const randomElem = arr[randomNum];
    return randomElem;
  };

  shuffleArr = (array: IWordsElement[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  guessWord = (e: Event) => {
    const eventTarget = e.target as HTMLElement;
    if (eventTarget.classList.contains("words-btn")) {
      const { id } = eventTarget;
      this.splitEvents(id, eventTarget);
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

  resetVal = () => {
    this.progressVal = 0;
    correctWords = [];
    wrongWords = [];
    this.bar.animate(0);
  };

  splitEvents = (id: string, event: HTMLElement) => {
    const isLogin = localStorage.getItem("token");
    if(this.randomNum.word === id) {
      event.style.background = "#67db67";
      this.audioResult.element.setAttribute("src", "./public/audio/win.mp3");
      this.bar.animate(this.progressVal += 0.1);
      localStorage.setItem("progressbarVal", `${this.progressVal}`);
      correctWords.push(this.randomNum);
      dataAudiocall.correctArr = correctWords;
      if (isLogin) {
        dataAudiocall.series++;
        if (dataAudiocall.maxSeries < dataAudiocall.series) dataAudiocall.maxSeries = dataAudiocall.series;
      }
    } else {
      dataAudiocall.series = 0;
      event.style.background = "#ff4c4c";
      this.audioResult.element.setAttribute("src", "./public/audio/wrong.mp3");
      wrongWords.push(this.randomNum);
      dataAudiocall.wrongArr = wrongWords;
    }
    (<HTMLAudioElement>this.audioResult.element).play();
    this.getCorrectWord();
    dataAudiocall.totalWords = correctWords.length + wrongWords.length;
    dataAudiocall.correctWordsPercent = Math.floor((dataAudiocall.correctArr.length / dataAudiocall.totalWords) * 100);
  };

  closeGame = (parameters: string) => {
    if(document.fullscreenElement) {
      document.exitFullscreen();
    }
    this.resetVal();
    if(parameters) {
      window.location.hash = "/dictionary";
    } else {
      (<HTMLElement>document.querySelector(".home")).style.display = "flex";
      (<HTMLElement>document.querySelector(".master")).style.display = "none";
    }
  };

  getFullScreen = () => {
    if(document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.element.requestFullscreen();
    }
  };

  openInfo = () => {
    this.dropDownList.element.classList.toggle("openInfo");
  };

  hidenIntroPage = (numChapter: number, numPage: number) => {
    this.resetVal();
    (<HTMLElement>document.querySelector(".master")).style.display = "flex";
    (<HTMLElement>document.querySelector(".home")).style.display = "none";
    this.textDontKnow.element.style.display = "flex";
    this.textNext.element.style.display = "none";
    this.getWords(numChapter, numPage);
    localStorage.removeItem("progressbarVal");
  };

  activateKeyboard = (event: KeyboardEvent, parameters: string) => {
    const isAudiocallMain = document.querySelector(".audiocall-main") as HTMLElement;
    if (isAudiocallMain && isAudiocallMain.style.display === "flex") {
      if (event.key === "Shift") {
        (<HTMLAudioElement>this.audio.element).play();
      }

      document.querySelectorAll(".words-btn").forEach( el => {
        if (event.key === (<HTMLButtonElement>el).value && !(<HTMLButtonElement>el).disabled) {
          this.splitEvents((<HTMLButtonElement>el).id, <HTMLElement>el);
        }
      });

      if (event.code === "Space" && (<HTMLElement>document.getElementById("Space-Dont")).style.display === "flex") {
        this.getCorrectWord();
        wrongWords.push(this.randomNum);
      } else if (event.code === "Space" && (<HTMLElement>document.getElementById("Space-Next")).style.display === "flex") {
        this.getWords(this.valChapter, this.valPage +=1);
      }

      if (event.code === "Escape") {
        this.closeGame(parameters);
      }

      if (event.code === "KeyF") {
        this.getFullScreen();
      }
      
      if (event.code === "KeyI") {
        this.openInfo();
      }
      event.preventDefault();
    }
  };
  getListCards = (data: IWordsElement[]) => {
    const wordBtn = (document.querySelectorAll(".words-btn"));
    if (!data.length) {
      this.audioCallContent.element.prepend("Sorry but the list of hard words is empty");
      this.voiceBtn.element.setAttribute("disabled", "true");
      this.actionBtn.element.setAttribute("disabled", "true");
    } else {
      this.shuffleArr(data);
      this.arrWords = data.map( (dataItm: IWordsElement, idx: number) => {
        if(idx < wordBtn.length) {
          wordBtn[idx].innerHTML = `${idx + 1}. ${dataItm.wordTranslate}`;
          wordBtn[idx].setAttribute("id", dataItm.word);
          return dataItm;
        }
      }).filter( (dataItm) => dataItm !== undefined) as IWordsElement[];
      this.randomNum = this.getRandomElem(this.arrWords);
      
      this.audio.element.setAttribute("src", BASE_URL + this.randomNum.audio);
      this.audio.element.setAttribute("autoplay", "");
      if (correctWords.length + wrongWords.length === 10) {
        this.audio.element.removeAttribute("autoplay");
      }
    }
    wordBtn.forEach( btn => {
      if(btn.innerHTML === "") {
        btn.setAttribute("disabled", "true");
      }
    });
  };
}