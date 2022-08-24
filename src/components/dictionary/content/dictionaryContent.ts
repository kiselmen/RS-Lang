import { elementData } from "../../../interfaces";
import { Component } from "../../../utils/component";
import { DictionaryContentElement } from "./contentListElement/contentListElement";

export class DictionaryContent extends Component {
  private wordsList: Component;
  listElement: Array<DictionaryContentElement>;
  onAddWordToDifficult: (word: elementData) => void;

  constructor(parentNode: HTMLElement, words: Array<elementData>, onAddWordToDifficult: (word: elementData) => void) {
    super(parentNode, "div", ["dictionary-content"],);

    this.onAddWordToDifficult = (word) => onAddWordToDifficult(word);
    this.wordsList = new Component(this.element, "ul", ["dictionary-content__list", "list-content"]);

    this.listElement = [];
    this.renderContent(words);
  }

  renderContent(words: Array<elementData>){
    this.wordsList.element.innerHTML ="";
    this.listElement = [];
    for(let i = 0; i < words.length; i++) {
      this.listElement.push(new DictionaryContentElement(this.wordsList.element, words[i], (word) => this.onAddWordToDifficult(word)));
    }
  }
}

