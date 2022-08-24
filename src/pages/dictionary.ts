import { Component } from "../utils/component";
import { DictionaryHeader } from "../components/dictionary/header/dictionaryHeader";
import { DictionaryContent } from "../components/dictionary/content/dictionaryContent";
import { DictionaryPagination } from "../components/dictionary/pagination/dictionaryPagination";
import { getWordsByChapterAndPage, getAlluserWords} from "../utils/loader";
import { elementData } from "../interfaces";
import { preLoad, addWordToDifficult, removeWordFromDifficult } from "../utils/loader";

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
      }).then( () => {
        getWordsByChapterAndPage(1, 1).then( data => {
          this.words = data;
          this.dictionaryContent.renderContent(this.words);
        });
      });
    });

    this.dictionaryContent = new DictionaryContent(
      this.element, 
      this.words, 
      (word) => this.onAddWordToDifficult(word),
      (word) => this.onClickPlay(word),
      () => this.onSetupButtons(),
      (word) => this.onRemoveWordFromDifficult(word)
    );
  }

  checkToken = async () => {
    if (localStorage.getItem("token")) {
      await preLoad();
      if (!localStorage.getItem("token")) {
        window.location.hash = "#/login";
        this.onUpdateRouter();
      }
    }
  };

  onAddWordToDifficult = (word: elementData) => {
    preLoad().then( () => {
      addWordToDifficult(word).then( (data) => {
        this.userWords.push(data);
        this.onSetupButtons();
      });
    });
  };

  onRemoveWordFromDifficult =  (word: elementData) => {
    preLoad().then( () => {
      removeWordFromDifficult(word).then( () => {
        this.userWords = this.userWords.filter(item => {
          return item.wordId !== word.id;
        });
        
        this.onSetupButtons();
      });
    });
  };

  onClickPlay(word: elementData) {
    const filterWordsElements = this.dictionaryContent.listElement.filter( item => {
      return item.word.id !== word.id && item.isPlaying;      
    });
    filterWordsElements.forEach(item => item.onListenClick());
  }

  onSetupButtons() {
    let countHard = 0;
    this.dictionaryContent.listElement.forEach ( itemInList => {
      const isHard = this.userWords.filter( userItem => {
        return itemInList.word.id === userItem.wordId && userItem.difficulty === "hard";
      });
      if (isHard.length) {
        itemInList.elementBtnAdd?.setDisabled(true);
        itemInList.elementBtnRemove.setDisabled(false);
        itemInList.element.classList.add("element__hard");
      } else {
        itemInList.elementBtnAdd?.setDisabled(false);
        itemInList.elementBtnRemove.setDisabled(true);
        itemInList.element.classList.remove("element__hard");
      }
      countHard = isHard.length === 0 ? countHard : countHard + 1;
      
    });
    console.log(countHard);
  }
}
