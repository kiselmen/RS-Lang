import { elementData, BASE_URL } from "../../../../interfaces";
import { Component } from "../../../../utils/component";
import { UIButton } from "../../../UI/button";

export class DictionaryContentElement extends Component {
  word: elementData;
  isPlaying: boolean;
  trackNumber: number;
  private elementImg: Component;
  private elementDiscription: Component;
  private elementWord: Component;
  private elementExplain: Component;
  private elementExample: Component;
  private elementBtns: Component;
  private elementBtnListen: UIButton;
  private elementBtnAdd: UIButton | null;
  private elementBtnRemove: UIButton | null;
  private elementBtnStudied: UIButton | null;
  private elementBtnImg: Component;
  private elementAudio: Component;
  private elementAudioMeaning: Component;
  private elementAudioExample: Component;

  constructor(parentNode: HTMLElement, word: elementData) {
    super(parentNode, "li", ["list-content__element", "element"],);
    this.word = word;
    this.isPlaying = false;
    this.trackNumber = 1;
    
    this.elementImg = new Component(this.element, "img", ["element-img"]);
    this.elementImg.element.setAttribute("alt", "picture-association");
    this.elementImg.element.setAttribute("src", BASE_URL + word.image);

    this.elementDiscription = new Component(this.element, "div", ["element-discript"]);

    this.elementWord = new Component(this.elementDiscription.element, "div", ["element-word", "word"]);
    new Component(this.elementWord.element, "span", ["word-en"], word.word);
    new Component(this.elementWord.element, "span", ["word-transcription"], word.transcription);
    new Component(this.elementWord.element, "span", ["word-rus"], " - " + word.wordTranslate);

    this.elementExplain = new Component(this.elementDiscription.element, "div", ["element-explain", "explain"]);
    const elementEngExplain = new Component(this.elementExplain.element, "p", ["explain-en"], "");
    elementEngExplain.element.innerHTML = word.textMeaning;
    new Component(this.elementExplain.element, "p", ["explain-rus"], word.textMeaningTranslate);

    this.elementExample = new Component(this.elementDiscription.element, "div", ["element-example", "example"]);
    const elementEngExample = new Component(this.elementExample.element, "p", ["example-en"], "");
    elementEngExample.element.innerHTML = word.textExample;
    new Component(this.elementExample.element, "p", ["example-rus"], word.textExampleTranslate);

    this.elementBtns = new Component(this.elementDiscription.element, "div", ["element-btns"],);

    this.elementBtnListen = new UIButton(this.elementBtns.element, ["btn", "btn-dictionary"], "");
    this.elementBtnImg = new Component(this.elementBtnListen.element, "img", ["element-btn__img"],);
    this.elementBtnImg.element.setAttribute("src", "../../../../../sprint-images/sound-on.svg");
    this.elementBtnImg.element.setAttribute("alt", "play");

    this.elementBtnAdd = null;
    this.elementBtnRemove =null;
    this.elementBtnStudied =null;
    if (localStorage.getItem("token")) {
      this.elementBtnAdd = new UIButton(this.elementBtns.element, ["btn", "btn-dictionary"], "Hard");
      this.elementBtnRemove = new UIButton(this.elementBtns.element, ["btn", "btn-dictionary"], "Remove");
      this.elementBtnStudied = new UIButton(this.elementBtns.element, ["btn", "btn-dictionary"], "Studied");
      this.elementBtnAdd.onClickButton = async () => this.onAddClick();
      this.elementBtnRemove.onClickButton = async () => this.onRemoveClick();
      this.elementBtnStudied.onClickButton = async () => this.onStudiedClick();
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
    let audio = this.elementAudio.element as HTMLAudioElement;
    if (this.isPlaying) {
      this.elementBtnImg.element.setAttribute("src", "../../../../../sprint-images/sound-on.svg");
      this.elementBtnImg.element.setAttribute("alt", "stop");
      audio.pause();
    } else {
      this.elementBtnImg.element.setAttribute("src", "../../../../../sprint-images/sound-off.svg");
      this.elementBtnImg.element.setAttribute("alt", "play");
      audio.play();
      audio.onended = () => {
        audio = this.elementAudioMeaning.element as HTMLAudioElement;
        audio.play();
        audio.onended = () => {
          audio = this.elementAudioExample.element as HTMLAudioElement;
          audio.play();
          audio.onended = () => {
            this.elementBtnImg.element.setAttribute("src", "../../../../../sprint-images/sound-on.svg");
            this.elementBtnImg.element.setAttribute("alt", "stop");
          };
        };
      };
    }
    this.isPlaying = !this.isPlaying;
  }

  onAddClick() {
    console.log();
  }

  onRemoveClick() {
    console.log();
  }

  onStudiedClick() {
    console.log();
  }

}