import { Component } from "../utils/component";
import { DictionaryHeader } from "../components/dictionary/header/dictionaryHeader";
import { DictionaryContent } from "../components/dictionary/content/dictionaryContent";
import { DictionaryPagination } from "../components/dictionary/pagination/dictionaryPagination";
import { getWordsByChapterAndPage, getAlluserWords} from "../utils/loader";
import { getTodayInString } from "../utils/helper";
import { elementData, wordOptional } from "../interfaces";
import { preLoad, addWordToUserWords, updateWordInUserWords, removeWordFromDifficult, getAgregatedWordsByPage, getAllAgregatedWords, updateUserStatistics } from "../utils/loader";

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
        if (type === "study") {
          localStorage.setItem("learnedWords", String(Number(localStorage.getItem("learnedWords") as string) + 1));
          updateUserStatistics();
        }          
        const isWordPresent = this.userWords.filter(item => item.wordId === word.id);
        if (isWordPresent.length) {
          const lastOtional = JSON.parse(JSON.stringify(isWordPresent[0].optional)) as wordOptional;
          lastOtional.learned = type == "study" ? "yes" : "no";
          lastOtional.learnDate = type == "study" ?  getTodayInString() : "no";
          updateWordInUserWords(word, type, lastOtional).then( data => {
            isWordPresent[0].difficulty = data.difficulty;
            this.onSetupButtons();
          });
        } else {
          const optional = this.createEmptyOptional();
          optional.learned = type == "study" ? "yes" : "no";
          optional.learnDate = type == "study" ?  getTodayInString() : "no";
          addWordToUserWords(word, type, optional).then( data => {
            this.userWords.push(data);
            this.onSetupButtons();
          });
        }
      });
    } else {
      this.dictionaryContent.loading = true;
      const lastOtional = JSON.parse(JSON.stringify(word.userWord)).optional; 
      lastOtional.learned = "yes";
      lastOtional.learnDate = getTodayInString();
      this.dictionaryContent.renderContent();

      localStorage.setItem("learnedWords", String(Number(localStorage.getItem("learnedWords") as string) + 1));
      updateUserStatistics();

      updateWordInUserWords(word, "study", lastOtional).then( data => {
        const newUserWords = this.userWords.filter(item => item.wordId === data.wordId);
        newUserWords[0].difficulty ="study";
        this.words = this.words.filter(item => item._id !== data.wordId);
        this.dictionaryContent.loading = false;
        this.dictionaryContent.renderContent(this.words);
      });
    }
  };

  onRemoveWordFromDifficult =  (word: elementData) => {
    const isWordPresent = this.userWords.filter(item => item.wordId === word.id);
    let lastOtional = {} as wordOptional;
    if (isWordPresent.length) {
      if (isWordPresent[0].optional) {
        lastOtional = isWordPresent[0].optional ? JSON.parse(JSON.stringify(isWordPresent[0].optional)) : this.createEmptyOptional();
      } else {
        lastOtional = this.createEmptyOptional();
      }
      lastOtional.learned = "no";
      lastOtional.learnDate = "no";
    } else {
      lastOtional = this.createEmptyOptional();
    }
    this.checkToken().then( () => {
      if (isWordPresent.length) {
        updateWordInUserWords(word, "normal", lastOtional).then( (data) => {
          const newUserWords = this.userWords.filter(item => item.wordId === data.wordId);
          newUserWords[0].difficulty ="normal";
          this.dictionaryContent.loading = false;
          this.dictionaryContent.renderContent(this.words);
          this.onSetupButtons();
        });
      } else {
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
      }
    });
  };

  createEmptyOptional() {
    const optional = {} as wordOptional;
    optional.learned = "no";
    optional.learnDate = "no";
    const audiocall = { totalAttempts: 0, correctAnswers: 0 };
    const sprint = { totalAttempts: 0, correctAnswers: 0 };
    const games = { sprint: sprint, audiocall: audiocall };
    optional.games = games;
    optional.totalAttempts = 0;
    optional.correctAnswers = 0;
    optional.isNew = false;
    return optional;
  }

  onClickPlay(word: elementData) {
    const filterWordsElements = this.dictionaryContent.listElement.filter( item => {
      return item.word.id !== word.id && item.isPlaying;      
    });
    filterWordsElements.forEach(item => item.onListenClick());
  }

  setupButtonsForCapter1_6 = () => {
    let countStudy = 0;
    let countHard = 0;
    this.dictionaryContent.listElement.forEach ( itemInList => {
      if (localStorage.getItem("token")) {
        const isPresent = this.userWords.filter( userItem => {
          return itemInList.word.id === userItem.wordId;
        });
        if (isPresent.length) {
          itemInList.elementStata.element.classList.add("active");
          itemInList.elementCorrectAnswers.element.textContent = isPresent[0].optional ? JSON.parse(JSON.stringify(isPresent[0].optional)).correctAnswers : "0";
          itemInList.elementTotalAttempts.element.textContent = isPresent[0].optional ? JSON.parse(JSON.stringify(isPresent[0].optional)).totalAttempts : "0";
          itemInList.elementStata.element.classList.remove("element-stata__disabled");
          if (isPresent[0].difficulty === "hard") {
            itemInList.elementBtnAdd.setDisabled(true);
            itemInList.elementBtnRemove.setDisabled(false);
            itemInList.elementBtnStudied.setDisabled(false);
            itemInList.element.classList.remove("element__hard");
            itemInList.element.classList.remove("element__studied");
            itemInList.element.classList.add("element__hard");
          } else if (isPresent[0].difficulty === "study") {
            itemInList.elementBtnAdd.setDisabled(true);
            itemInList.elementBtnRemove.setDisabled(false);
            itemInList.elementBtnStudied.setDisabled(true);
            itemInList.element.classList.remove("element__hard");
            itemInList.element.classList.remove("element__studied");
            itemInList.element.classList.add("element__studied");
          } else {
            itemInList.elementBtnAdd.setDisabled(false);
            itemInList.elementBtnRemove.setDisabled(true);
            itemInList.elementBtnStudied.setDisabled(false);
            itemInList.element.classList.remove("element__hard");
            itemInList.element.classList.remove("element__studied");
          }
        } else {
          itemInList.elementCorrectAnswers.element.textContent = "0";
          itemInList.elementTotalAttempts.element.textContent = "0";
          itemInList.elementStata.element.classList.remove("active");
          itemInList.elementBtnAdd?.setDisabled(false);
          itemInList.elementBtnRemove.setDisabled(true);
          itemInList.elementBtnStudied.setDisabled(false);
          itemInList.element.classList.remove("element__hard");
          itemInList.element.classList.remove("element__studied");
        }
        countStudy = countStudy + this.userWords.filter( userItem => itemInList.word.id === userItem.wordId && userItem.difficulty === "study").length;
        countHard = countHard + this.userWords.filter( userItem => itemInList.word.id === userItem.wordId && userItem.difficulty === "hard").length;
      } else {
        itemInList.elementBtnAdd?.setDisabled(true);
        itemInList.elementBtnRemove.setDisabled(true);
        itemInList.elementBtnStudied.setDisabled(true);
        itemInList.element.classList.remove("element__hard");
        itemInList.element.classList.remove("element__studied");
        itemInList.elementStata.element.classList.add("element-stata__disabled");
      }
      
    });
    if (countStudy === 20) {
      this.dictionaryPagination.numberPage.element.classList.add("pagination-number__learned");
    } else {
      this.dictionaryPagination.numberPage.element.classList.remove("pagination-number__learned");
    }
    if (countStudy + countHard === 20) {
      this.dictionaryHeader.games.dictionaryHeading.element.classList.add("games__disabled");
      this.dictionaryHeader.games.dictionaryGames.element.classList.add("games__disabled");
    } else {
      this.dictionaryHeader.games.dictionaryHeading.element.classList.remove("games__disabled");
      this.dictionaryHeader.games.dictionaryGames.element.classList.remove("games__disabled");
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
