import { Component } from "../utils/component";
import { DictionaryHeader } from "../components/dictionary/header/dictionaryHeader";
import { DictionaryContent } from "../components/dictionary/content/dictionaryContent";
import { DictionaryPagination } from "../components/dictionary/pagination/dictionaryPagination";
import { getWordsByChapterAndPage, getAlluserWords} from "../utils/loader";
import { elementData } from "../interfaces";
import { preLoad, addWordToDifficult } from "../utils/loader";

export class Dictionary extends Component {
  private dictionaryHeader: DictionaryHeader;
  private dictionaryContent: DictionaryContent;
  private dictionaryPagination: DictionaryPagination;
  words: Array<elementData>;
  userWords: Array<elementData>;
  onUpdateRouter: () => void;

  constructor(parentNode: HTMLElement, updateRouter: () => void) {
    super(parentNode, "div", ["dictionary"]);
    this.onUpdateRouter = () => updateRouter();
    
    this.dictionaryHeader = new DictionaryHeader(this.element);
    this.dictionaryPagination = new DictionaryPagination(this.element);

    this.words = [];
    this.userWords = [];
    this.checkToken().then(() => {
      getAlluserWords().then( data => {
        this.userWords = data;
        console.log(this.userWords);
        
      });
      getWordsByChapterAndPage(1, 1).then( data => {
        this.words = data;
        this.onWordsLoaded();
      });
    });

    this.dictionaryContent = new DictionaryContent(this.element, this.words, (word) => this.onAddWordToDifficult(word));
  }

  onWordsLoaded() {
    this.dictionaryContent.renderContent(this.words);
  }

  checkToken = async () => {
    if (localStorage.getItem("token")) {
      preLoad().then(() => {
        if (!localStorage.getItem("token")) {
          window.location.hash = "#/login";
          this.onUpdateRouter();
        }
      });
    }
  };

  onAddWordToDifficult(word: elementData) {
    preLoad().then( () => {
      addWordToDifficult(word).then( (data) => {
        console.log(data);
      });
    });
  }
}
