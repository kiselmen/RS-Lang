import { Component } from "../utils/component";
import { DictionaryHeader } from "../components/dictionary/header/dictionaryHeader";
import { DictionaryContent } from "../components/dictionary/content/dictionaryContent";
import { DictionaryPagination } from "../components/dictionary/pagination/dictionaryPagination";
import { load } from "../utils/loader";
import { elementData} from "../interfaces";

export class Dictionary extends Component {
  private dictionaryHeader: DictionaryHeader;
  private dictionaryContent: DictionaryContent;
  private dictionaryPagination: DictionaryPagination;
  words: Array<elementData>;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["dictionary"]);
    
    this.dictionaryHeader = new DictionaryHeader(this.element);
    this.dictionaryPagination = new DictionaryPagination(this.element);

    this.words = [];
    this.getWordsByChapterAndPage(1, 1).then( data => {
      this.words = data;
      this.onWordsLoaded(this.words);
    });

    this.dictionaryContent = new DictionaryContent(this.element, this.words);
  }

  onWordsLoaded(words: Array<elementData>) {
    this.dictionaryContent.renderContent(words);
  }

  getWordsByChapterAndPage = async (chapter = 1, page = 1) => {
    const response = await this.loadWords(chapter, page);
    if (response.status !== 200) {
      return this.words = [];
    } else {
      return this.words = response.data;
    }
  };

  async loadWords(chapter: number, page: number) {
    const url = "words?group=" + chapter + "&page=" + page;
    const method = {
      method : "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
    };
    return await load(url, method);     
  }


}
