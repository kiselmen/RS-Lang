import { Component } from "../../../../utils/component";

export class DictionaryContentElement extends Component {
  private elementImg: Component;
  private elementDiscription: Component;
  private elementWord: Component;
  private elementEngWord: Component;
  private elementTranscriptWord: Component;
  private elementRusWord: Component;
  private elementExplain: Component;
  private elementEngExplain: Component;
  private elementRusExplain: Component;
  private elementExample: Component;
  private elementEngExample: Component;
  private elementRusExample: Component;
  private elementBtns: Component;
  private elementBtnListen: Component;
  private elementBtnAdd: Component;
  private elementBtnRemove: Component;
  private elementBtnStudied: Component;
  private elementBtnImg: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "li", ["list-content__element", "element"],);

    this.elementImg = new Component(this.element, "img", ["element-img"]);
    this.elementDiscription = new Component(this.element, "div", ["element-discript"]);
    this.elementWord = new Component(this.elementDiscription.element, "div", ["element-word", "word"]);
    this.elementEngWord = new Component(this.elementWord.element, "span", ["word-en"], `alcohol`);
    this.elementTranscriptWord = new Component(this.elementWord.element, "span", ["word-transcription"], `[ǽlkəhɔ̀ːl]`);
    this.elementRusWord = new Component(this.elementWord.element, "span", ["word-rus"], ` - алкоголь`);
    this.elementExplain = new Component(this.elementDiscription.element, "div", ["element-explain", "explain"]);
    this.elementEngExplain = new Component(this.elementExplain.element, "p", ["explain-en"],);
    this.elementRusExplain = new Component(this.elementExplain.element, "p", ["explain-rus"], `Алкоголь - это тип напитка, который может сделать людей пьяными`);
    this.elementExample = new Component(this.elementDiscription.element, "div", ["element-example", "example"]);
    this.elementEngExample = new Component(this.elementExample.element, "p", ["example-en"],);
    this.elementRusExample = new Component(this.elementExample.element, "p", ["example-rus"], `Человек не должен водить машину после того, как он выпил алкоголь`);
    this.elementBtns = new Component(this.elementDiscription.element, "div", ["element-btns"],);
    this.elementBtnListen = new Component(this.elementBtns.element, "button", ["element-btn", "btn"], "Listen");
    this.elementBtnAdd = new Component(this.elementBtns.element, "button", ["element-btn", "btn"], "Hard");
    this.elementBtnRemove = new Component(this.elementBtns.element, "button", ["element-btn", "btn"], "Remove");
    this.elementBtnStudied = new Component(this.elementBtns.element, "button", ["element-btn", "btn"], "Studied");
    this.elementBtnImg = new Component(this.elementBtnListen.element, "img", ["element-btn__img"],);

    this.elementEngExplain.element.innerHTML = `<i>Alcohol</i> is a type of drink that can make people drunk.`;
    this.elementEngExample.element.innerHTML = `A person should not drive a car after he or she has been drinking <b>alcohol</b>.`;
    this.elementImg.element.setAttribute("src", "../../../../../public/01_0002.jpg");
    this.elementImg.element.setAttribute("alt", "picture-association");
    this.elementBtnImg.element.setAttribute("src", "../../../../../volume.svg");
    this.elementBtnImg.element.setAttribute("alt", "picture-volume");
  }
}