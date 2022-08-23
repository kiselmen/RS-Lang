import { elementData } from "../../../interfaces";
import { Component } from "../../../utils/component";
import { DictionaryContentElement } from "./contentListElement/contentListElement";

export class DictionaryContent extends Component {
  private wordsList: Component;
  // private listElement: DictionaryContentElement | undefined;

  constructor(parentNode: HTMLElement, words: Array<elementData>) {
    super(parentNode, "div", ["dictionary-content"],);

    this.wordsList = new Component(this.element, "ul", ["dictionary-content__list", "list-content"]);
    this.renderContent(words);
  }

  renderContent(words: Array<elementData>){
    this.wordsList.element.innerHTML ="";
    for(let i = 0; i < words.length; i++) {
      new DictionaryContentElement(this.wordsList.element, words[i]);
    }
  }
}

