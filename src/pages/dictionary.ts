import { Component } from "../utils/component";
import { DictionaryHeader } from "../components/dictionary/header/dictionaryHeader";
import { DictionaryContent } from "../components/dictionary/content/dictionaryContent";
import { DictionaryPagination } from "../components/dictionary/pagination/dictionaryPagination";

export class Dictionary extends Component {
  private dictionaryHeader: DictionaryHeader;
  private dictionaryContent: DictionaryContent;
  private dictionaryPagination: DictionaryPagination;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["dictionary"]);

    this.dictionaryHeader = new DictionaryHeader(this.element);
    this.dictionaryContent = new DictionaryContent(this.element);
    this.dictionaryPagination = new DictionaryPagination(this.element);
  }
}
