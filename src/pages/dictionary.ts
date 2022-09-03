import { Component } from "../utils/component";
import { DictionaryHeader } from "../components/dictionary/header/dictionaryHeader";
import { DictionaryContent } from "../components/dictionary/content/dictionaryContent";
import { DictionaryPagination } from "../components/dictionary/pagination/dictionaryPagination";
import { getWordsByChapterAndPage, getAlluserWords} from "../utils/loader";
import { elementData, wordOptional } from "../interfaces";
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
    
    this.dictionaryHeader = new DictionaryHeader(this.element, () => this.onChapterChange());
    this.dictionaryPagination = new DictionaryPagination(this.element, () => this.onPageChange());

    this.words = [];
    this.userWords = [];
    // this.loadData();

    this.dictionaryContent = new DictionaryContent(
      this.element, 
      this.words, 
      (word, type) => this.onAddWordToUserWords(word, type),
      (word) => this.onClickPlay(word),
      () => this.onSetupButtons(),
      (word) => this.onRemoveWordFromDifficult(word)
    );
  }

  onChapterChange = () => {
    this.onPageChange();
  };

  onPageChange = () => {
    this.loadData();
  }; 

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
            this.dictionaryPagination.enabledButtons();
            getWordsByChapterAndPage(this.dictionaryHeader.chapters.chapter, this.dictionaryPagination.page).then( data => {
              this.words = data;
              this.dictionaryContent.loading = false;
              this.dictionaryContent.renderContent(this.words);
            });
          } else {
            const page = 0;
            const worPerPage = 100;
            this.dictionaryPagination.disabletButtons();
            getAgregatedWordsByPage(page, worPerPage).then( data => {
              const allPages = data.totalCount.length !== 0 ? Math.ceil(data.totalCount[0].count / worPerPage) : 0;
              if (page < allPages - 1) {
                getAllAgregatedWords(allPages, worPerPage).then( data => {
                  this.words = data;
                  this.dictionaryContent.loading = false;
                  this.dictionaryContent.renderContent(this.words);
                });
              } else {
                this.words = data.paginatedResults;
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
          this.dictionaryContent.loading = false;
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
    if (this.dictionaryHeader.chapters.chapter !== 6) {
      this.checkToken().then( () => {
        const isWordPresent = this.userWords.filter(item => item.wordId === word.id);
        if (isWordPresent.length) {
          updateWordInUserWords(word, type, {} as wordOptional).then( data => {
            isWordPresent[0].difficulty = data.difficulty;
            this.onSetupButtons();
          });
        } else {
          addWordToUserWords(word, type, {} as wordOptional).then( data => {
            this.userWords.push(data);
            this.onSetupButtons();
          });
        }
      });
    } else {
      this.dictionaryContent.loading = true;
      this.dictionaryContent.renderContent();
      updateWordInUserWords(word, "study", {} as wordOptional).then( data => {
        this.userWords = this.userWords.filter(item => item.wordId !== data.wordId);
        this.words = this.words.filter(item => item._id !== data.wordId);
        this.dictionaryContent.loading = false;
        this.dictionaryContent.renderContent(this.words);
      });
    }
  };

  onRemoveWordFromDifficult =  (word: elementData) => {
    // const isInHard = this.userWords.filter( item => item.wordId === word.id);
    
    this.checkToken().then( () => {
      removeWordFromDifficult(word).then( () => {
        if (this.dictionaryHeader.chapters.chapter !== 6) {
          this.userWords = this.userWords.filter(item => item.wordId !== word.id);
          this.words = this.words.filter(item => item.wordId !== word.id);
        } else {
          this.dictionaryContent.loading = true;
          this.dictionaryContent.renderContent();
          this.userWords = this.userWords.filter(item => item.wordId !== word._id);
          this.words = this.words.filter(item => item._id !== word._id);
        }
        this.dictionaryContent.loading = false;
        this.dictionaryContent.renderContent(this.words);
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

  setupButtonsForCapter1_6 = () => {
    let countStudy = 0;
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
  };

  setupButtonsForCapter7 = () => {
    this.dictionaryContent.listElement.forEach ( itemInList => {
      itemInList.elementBtnAdd?.setDisabled(true);
      itemInList.elementBtnRemove.setDisabled(false);
      itemInList.elementBtnStudied.setDisabled(false);
    });
  };

  onSetupButtons() {
    this.dictionaryHeader.chapters.chapter !== 6 ? this.setupButtonsForCapter1_6() : this.setupButtonsForCapter7();
  }
}
