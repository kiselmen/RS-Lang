import { elementData } from "../../../interfaces";
import { Component } from "../../../utils/component";
import { DictionaryContentElement } from "./contentListElement/contentListElement";

export class DictionaryContent extends Component {
  private wordsList: Component;
  listElement: Array<DictionaryContentElement>;
  onAddWordToDifficult: (word: elementData) => void;
  onRemoveWordFromDifficult: (word: elementData) => void;
  onClickPLay: (word: elementData) => void;
  onSetupButtons: () => void;

  constructor(parentNode: HTMLElement, words: Array<elementData>, 
    onAddWordToDifficult: (word: elementData) => void,
    onClickPLay: (word: elementData) => void,
    onSetupButtons: () => void,
    onRemoveWordFromDifficult: (word: elementData) => void
  ) {
    super(parentNode, "div", ["dictionary-content"],);

    this.onAddWordToDifficult = (word) => onAddWordToDifficult(word);
    this.onRemoveWordFromDifficult = (word) => onRemoveWordFromDifficult(word);
    this.onClickPLay = (word) => onClickPLay(word);
    this.onSetupButtons = () => onSetupButtons();

    this.wordsList = new Component(this.element, "ul", ["dictionary-content__list", "list-content"]);

    this.listElement = [];
    () => this.renderContent(words);
  }

  renderContent(words: Array<elementData>){
    this.wordsList.element.innerHTML ="";
    this.listElement = [];
    words.forEach( item  => {
      const elem = new DictionaryContentElement(this.wordsList.element, item);
      elem.onAddWordToDifficult = (word) => this.onAddWordToDifficult(word);
      elem.onRemoveWordFromDifficult = (word) => this.onRemoveWordFromDifficult(word);
      elem.onClickPLay = (word) => this.onClickPLay(word);
      this.listElement.push(elem);
    });
    this.onSetupButtons();
  }
}

