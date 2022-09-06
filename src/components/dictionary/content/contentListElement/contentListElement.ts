/* eslint-disable @typescript-eslint/no-empty-function */
import { elementData, BASE_URL } from "../../../../interfaces";
import { Component } from "../../../../utils/component";
import { UIButton } from "../../../UI/button";

export class DictionaryContentElement extends Component {
  word: elementData;
  isPlaying: boolean;
  private elementImg: Component;
  private elementDiscription: Component;
  private elementWord: Component;
  private elementExplain: Component;
  private elementExample: Component;
  private elementBtns: Component;
  private elementBtnListen: UIButton;
  elementBtnAdd: UIButton;
  elementBtnRemove: UIButton;
  elementBtnStudied: UIButton;
  elementTotalAttempts: Component;
  elementCorrectAnswers: Component;
  elementStata: Component;
  private elementBtnImg: Component;
  private elementAudio: Component;
  private elementAudioMeaning: Component;
  private elementAudioExample: Component;
  private elementExplainHeading: Component;
  private elementExampleHeading: Component;
  onAddWordToUserWords: (word: elementData, type: string) => void = () => {};
  onClickPLay: (word: elementData) => void = () => {};
  onRemoveWordFromDifficult: (word: elementData) => void = () => {};

  constructor(parentNode: HTMLElement, word: elementData) {
    super(parentNode, "li", ["list-content__element", "element"],);
    this.word = word;
    this.isPlaying = false;

    this.elementImg = new Component(this.element, "img", ["element-img"]);
    this.elementImg.element.setAttribute("alt", "picture-association");
    this.elementImg.element.setAttribute("src", BASE_URL + word.image);

    this.elementDiscription = new Component(this.element, "div", ["element-discript"]);

    this.elementWord = new Component(this.elementDiscription.element, "div", ["element-word", "word"]);
    new Component(this.elementWord.element, "span", ["word-en"], word.word);
    new Component(this.elementWord.element, "span", ["word-transcription"], word.transcription);
    new Component(this.elementWord.element, "span", ["word-rus"], " - " + word.wordTranslate);

    this.elementExplain = new Component(this.elementDiscription.element, "div", ["element-explain", "explain"]);
    this.elementExplainHeading = new Component(this.elementExplain.element, "h3", ["explain-heading"], "Meaning:");
    const elementEngExplain = new Component(this.elementExplain.element, "p", ["explain-en"], "");
    elementEngExplain.element.innerHTML = word.textMeaning;
    new Component(this.elementExplain.element, "p", ["explain-rus"], word.textMeaningTranslate);
    
    this.elementExample = new Component(this.elementDiscription.element, "div", ["element-example", "example"]);
    this.elementExampleHeading = new Component(this.elementExample.element, "h3", ["example-heading"], "Example:");
    const elementEngExample = new Component(this.elementExample.element, "p", ["example-en"], "");
    elementEngExample.element.innerHTML = word.textExample;
    new Component(this.elementExample.element, "p", ["example-rus"], word.textExampleTranslate);

    this.elementBtns = new Component(this.elementDiscription.element, "div", ["element-btns"],);

    this.elementBtnListen = new UIButton(this.elementBtns.element, ["btn", "btn-listen"], "");
    this.elementBtnImg = new Component(this.elementBtnListen.element, "img", ["element-btn__img"],);
    this.elementBtnImg.element.setAttribute("src", "./public/sprint-images/sound-on.svg");
    this.elementBtnImg.element.setAttribute("alt", "play");

    this.elementBtnAdd = new UIButton(this.elementBtns.element, ["btn"], "Hard");
    this.elementBtnRemove = new UIButton(this.elementBtns.element, ["btn"], "Remove");
    this.elementBtnStudied = new UIButton(this.elementBtns.element, ["btn"], "Studied");
  
    this.elementStata = new Component(this.elementBtns.element, "div", ["element-stata"],);
    this.elementTotalAttempts = new Component(this.elementStata.element, "div", ["element-questions"],);
    new Component(this.elementStata.element, "div", ["element-separator"], "/");
    this.elementCorrectAnswers = new Component(this.elementStata.element, "div", ["element-questions"],);
  
    if (localStorage.getItem("token")) {
      this.elementBtnAdd.onClickButton = async () => this.onAddClick("hard");
      this.elementBtnRemove.onClickButton = async () => this.onRemoveClick();
      this.elementBtnStudied.onClickButton = async () => this.onAddClick("study");

    } else {
      this.elementBtnAdd.setDisabled(true);
      this.elementBtnRemove.setDisabled(true);
      this.elementBtnStudied.setDisabled(true);
    }

    this.elementAudio = new Component(this.elementDiscription.element, "audio", []);
    this.elementAudio.element.setAttribute("src", BASE_URL + word.audio);
    this.elementAudioMeaning = new Component(this.elementDiscription.element, "audio", []);
    this.elementAudioMeaning.element.setAttribute("src", BASE_URL + word.audioMeaning);
    this.elementAudioExample = new Component(this.elementDiscription.element, "audio", []);
    this.elementAudioExample.element.setAttribute("src", BASE_URL + word.audioExample);

    this.elementBtnListen.onClickButton = () => this.onListenClick();
  }

  onListenClick() {
    const audio = this.elementAudio.element as HTMLAudioElement;
    const audioMeaning = this.elementAudioMeaning.element as HTMLAudioElement;
    const audioExample = this.elementAudioExample.element as HTMLAudioElement;
    this.onClickPLay(this.word);
    if (this.isPlaying) {
      this.elementBtnImg.element.setAttribute("src", "./public/sprint-images/sound-on.svg");
      this.elementBtnImg.element.setAttribute("alt", "stop");
      audio.pause();
      audioMeaning.pause();
      audioExample.pause();
      this.isPlaying = !this.isPlaying;
    } else {
      this.isPlaying = !this.isPlaying;
      this.elementBtnImg.element.setAttribute("src", "./public/sprint-images/sound-off.svg");
      this.elementBtnImg.element.setAttribute("alt", "play");
      audio.play();
      audio.onended = () => {
        audioMeaning.play();
        audioMeaning.onended = () => {
          audioExample.play();
          audioExample.onended = () => {
            this.elementBtnImg.element.setAttribute("src", "./public/sprint-images/sound-on.svg");
            this.elementBtnImg.element.setAttribute("alt", "stop");
            this.isPlaying = !this.isPlaying;
          };
        };
      };
    }
  }

  onAddClick(type: string) {
    this.onAddWordToUserWords(this.word, type);
  }

  onRemoveClick() {
    this.onRemoveWordFromDifficult(this.word);
  }

}