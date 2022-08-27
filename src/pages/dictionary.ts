import { Component } from "../utils/component";
import { DictionaryHeader } from "../components/dictionary/header/dictionaryHeader";
import { DictionaryContent } from "../components/dictionary/content/dictionaryContent";
import { DictionaryPagination } from "../components/dictionary/pagination/dictionaryPagination";
import { getWordsByChapterAndPage, getAlluserWords} from "../utils/loader";
import { elementData } from "../interfaces";
import { preLoad, addWordToUserWords, updateWordInUserWords, removeWordFromDifficult, getAgregatedWordsByPage, getAllAgregatedWords } from "../utils/loader";

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
    
    this.dictionaryHeader = new DictionaryHeader(this.element, () => this.loadData());
    this.dictionaryPagination = new DictionaryPagination(this.element, () => this.loadData());

    this.words = [];
    this.userWords = [];
    this.loadData();

    this.dictionaryContent = new DictionaryContent(
      this.element, 
      this.words, 
      (word, type) => this.onAddWordToUserWords(word, type),
      (word) => this.onClickPlay(word),
      () => this.onSetupButtons(),
      (word) => this.onRemoveWordFromDifficult(word)
    );
  }

  loadData = () => {
    this.checkToken().then(() => {
      this.words = [];
      this.dictionaryContent.loading = true;
      this.dictionaryContent.renderContent(this.words);
      if (localStorage.getItem("token")) {
        getAlluserWords().then( data => {
          this.userWords = data;
        }).then( () => {
          if (this.dictionaryHeader.chapters.chapter < 6) {
            getWordsByChapterAndPage(this.dictionaryHeader.chapters.chapter, this.dictionaryPagination.page).then( data => {
              this.words = data;
              this.dictionaryPagination.enabledButtons();
              this.dictionaryContent.loading = false;
              this.dictionaryContent.renderContent(this.words);
            });
          } else {
            const page = 0;
            const worPerPage = 100;
            this.dictionaryPagination.disabletButtons();
            getAgregatedWordsByPage(page, worPerPage).then( data => {
              const allPages = Math.ceil(data.totalCount[0].count / worPerPage);
              if (page < allPages) {
                getAllAgregatedWords(allPages, worPerPage).then( data => {
                  this.words = data;
                  this.dictionaryContent.loading = false;
                  this.dictionaryContent.renderContent(this.words);
                });
              } else {
                this.words = data;
                this.dictionaryContent.loading = false;
                this.dictionaryContent.renderContent(this.words);
              }
            });
          }
        });
      } else {
        this.userWords = [];
        getWordsByChapterAndPage(this.dictionaryHeader.chapters.chapter, this.dictionaryPagination.page).then( data => {
          this.words = data;
          this.dictionaryContent.renderContent(this.words);
        });
      }
    });
  };

  checkToken = async () => {
    if (localStorage.getItem("token")) {
      await preLoad();
      if (!localStorage.getItem("token")) {
        window.location.hash = "#/login";
        this.onUpdateRouter();
      }
    }
  };

  onAddWordToUserWords = (word: elementData, type: string) => {
    this.checkToken().then( () => {
      const isWordPresent = this.userWords.filter(item => item.wordId === word.id);
      if (isWordPresent.length) {
        updateWordInUserWords(word, type).then( data => {
          isWordPresent[0].difficulty = data.difficulty;
          this.onSetupButtons();
        });
      } else {
        addWordToUserWords(word, type).then( data => {
          this.userWords.push(data);
          this.onSetupButtons();
        });
      }
    });
  };

  onRemoveWordFromDifficult =  (word: elementData) => {
    const isInHard = this.userWords.filter( item => item.wordId === word.id);
    console.log(isInHard, this.userWords);
    
    this.checkToken().then( () => {
      removeWordFromDifficult(word).then( () => {
        this.userWords = this.userWords.filter(item => item.wordId !== word.id);
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
    let countStudy = 0;
    console.log(this.userWords);
    
    this.dictionaryContent.listElement.forEach ( itemInList => {
      if (localStorage.getItem("token")) {
        const isPresent = this.userWords.filter( userItem => {
          return itemInList.word.id === userItem.wordId;
        });
        if (isPresent.length) {
          if (isPresent[0].difficulty === "hard") {
            itemInList.elementBtnAdd.setDisabled(true);
            itemInList.elementBtnRemove.setDisabled(false);
            itemInList.elementBtnStudied.setDisabled(false);
            itemInList.element.classList.remove("element__hard");
            itemInList.element.classList.remove("element__studied");
            itemInList.element.classList.add("element__hard");
          } else {
            itemInList.elementBtnAdd.setDisabled(true);
            itemInList.elementBtnRemove.setDisabled(false);
            itemInList.elementBtnStudied.setDisabled(true);
            itemInList.element.classList.remove("element__hard");
            itemInList.element.classList.remove("element__studied");
            itemInList.element.classList.add("element__studied");
          }
        } else {
          itemInList.elementBtnAdd?.setDisabled(false);
          itemInList.elementBtnRemove.setDisabled(true);
          itemInList.elementBtnStudied.setDisabled(false);
          itemInList.element.classList.remove("element__hard");
          itemInList.element.classList.remove("element__studied");
        }
        countStudy = countStudy + this.userWords.filter( userItem => itemInList.word.id === userItem.wordId && userItem.difficulty === "study").length;
      } else {
        itemInList.elementBtnAdd?.setDisabled(true);
        itemInList.elementBtnRemove.setDisabled(true);
        itemInList.elementBtnStudied.setDisabled(true);
        itemInList.element.classList.remove("element__hard");
        itemInList.element.classList.remove("element__studied");
      }
      
    });
    if (countStudy === 20) {
      this.dictionaryPagination.numberPage.element.classList.add("pagination-number__learned");
    } else {
      this.dictionaryPagination.numberPage.element.classList.remove("pagination-number__learned");
    }
  }
}
