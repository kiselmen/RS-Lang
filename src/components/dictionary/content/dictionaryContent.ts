import { Component } from "../../../utils/component";
import { DictionaryContentElement } from "./contentListElement/contentListElement";

export class DictionaryContent extends Component {
  private wordsList: Component;
  private listElement: DictionaryContentElement | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["dictionary-content"],);

    this.wordsList = new Component(this.element, "ul", ["dictionary-content__list", "list-content"]);
    for(let i = 0; i < 20; i++) {
      this.listElement = new DictionaryContentElement(this.wordsList.element);
    }
  }
}