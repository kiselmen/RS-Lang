import { elementData } from "../../../interfaces";
import { Component } from "../../../utils/component";
import { DictionaryContentElement } from "./contentListElement/contentListElement";
import { UILoader } from "../../UI/loader";

export class DictionaryContent extends Component {
  private wordsList: Component;
  private emptyWordsList: Component;
  private loadingElement: UILoader;
  loading : boolean;
  listElement: Array<DictionaryContentElement>;
  onAddWordToUserWords: (word: elementData, type: string) => void;
  onRemoveWordFromDifficult: (word: elementData) => void;
  onClickPLay: (word: elementData) => void;
  onSetupButtons: () => void;

  constructor(parentNode: HTMLElement, words: Array<elementData>, 
    onAddWordToUserWords: (word: elementData, type: string) => void,
    onClickPLay: (word: elementData) => void,
    onSetupButtons: () => void,
    onRemoveWordFromDifficult: (word: elementData) => void
  ) {
    super(parentNode, "div", ["dictionary-content"],);

    this.loading = true;
    this.onAddWordToUserWords = (word, type) => onAddWordToUserWords(word, type);
    this.onRemoveWordFromDifficult = (word) => onRemoveWordFromDifficult(word);
    this.onClickPLay = (word) => onClickPLay(word);
    this.onSetupButtons = () => onSetupButtons();

    this.loadingElement = new UILoader(this.element, true);
    this.wordsList = new Component(this.element, "ul", ["dictionary-content__list", "list-content"]);
    this.emptyWordsList = new Component(this.element, "ul", ["dictionary-content__list", "list-content"]);
    this.listElement = [];
    () => this.renderContent(words);
    this.loading = false;
    this.loadingElement.setVisible(false);
  }

  renderContent(words: Array<elementData> = []){
    this.wordsList.element.innerHTML ="";
    this.listElement = [];
    if (this.loading) {
      this.loadingElement.setVisible(true);
    } else {
      words.forEach( item  => {
        const elem = new DictionaryContentElement(this.wordsList.element, item);
        elem.onAddWordToUserWords = (word: elementData, type: string) => this.onAddWordToUserWords(word, type);
        elem.onRemoveWordFromDifficult = (word) => this.onRemoveWordFromDifficult(word);
        elem.onClickPLay = (word) => this.onClickPLay(word);
        this.listElement.push(elem);
      });
      this.onSetupButtons();
      if (words.length === 0) {
        this.emptyWordsList.element.textContent = "There is no any hard word";
      } else {
        this.emptyWordsList.element.textContent = "";
      }  
      this.loadingElement.setVisible(false);
    }
  }
}

