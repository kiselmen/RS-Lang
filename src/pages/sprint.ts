import "../styles/sprint.scss";
import { Component } from "../utils/component";
import SprintIntro from "../components/sprint/intro-page";
import SprintGamePage from "../components/sprint/game-page";
import {SprintResultesPage, SprintResult} from "../components/sprint/sprint-results-page";
import Timer from "../components/sprint/timer";
import {sprintState, getInfo, sayTheWord, myRandom, clearSprintState, makeVisibleCurrentSprintPage, updateSprintState} from "../components/sprint/sprint-helpers";
import { getAlluserWords, getWordById } from "../utils/loader";
import { IGetUsersWords, someData } from "../interfaces";


export class Sprint extends Component {
  private sprintIntroCard;
  private sprintGamePage;
  private sprintResultsPage;
  private timer: Timer | undefined;

  constructor(parentNode: HTMLElement, parameters: string) {
    super(parentNode, "div", ["sprint"]);

    clearSprintState();
    if(parameters) sprintState.parentNodeInfo = "dictionary";
    this.sprintIntroCard = new SprintIntro(this.element);
    this.sprintGamePage = new SprintGamePage(this.element);
    this.sprintResultsPage = new SprintResultesPage(this.element);

    this.starterKit();
  }

  //* Начало игры, определение откуда совершен переход *//

  sprintStart = async () => {
    if(sprintState.parentNodeInfo === "about") {
      await makeVisibleCurrentSprintPage(this.sprintResultsPage.element,
        this.sprintGamePage.element, this.sprintIntroCard.element, "flex");
    }
    if(sprintState.parentNodeInfo === "dictionary") {
      if(localStorage.userId) {
        if(localStorage.chapter !== "6") {
          await this.gamePreparation();
        }
        if(localStorage.chapter === "6") {
          await this.gamePreparation();
        }
      }
      if(!localStorage.userId) {
        await this.gamePreparation();
      }
    }
  };

  //* */ Получение данных для начала игры с сервера
  //* в зависимости от того, откуда был переход на страницу

  gamePreparation = async () => {
    if(sprintState.parentNodeInfo === "about") {
      sprintState.currentContent = await getInfo(sprintState.currentGroup, sprintState.currentPage);
      await this.gamePreparationActions("default");
    }
    if(sprintState.parentNodeInfo === "dictionary") {
      if(!localStorage.userId) {
        sprintState.currentGroup = +localStorage.chapter;
        sprintState.currentPage = +localStorage.page;
        sprintState.currentContent = await getInfo(sprintState.currentGroup, sprintState.currentPage);
        await this.gamePreparationActions("default");
      }
      if(localStorage.userId && localStorage.chapter !== "6") {
        sprintState.currentGroup = +localStorage.chapter;
        sprintState.currentPage = +localStorage.page;
        sprintState.currentContent = await getInfo(sprintState.currentGroup, sprintState.currentPage );
        const allUserWords = await getAlluserWords();


        const supportFunc = async () => {
          const studiedUserWordsId = allUserWords.filter((word: IGetUsersWords) => word.difficulty !== "hard").map((word: someData) => word.wordId);
          for(const id of studiedUserWordsId) {
            sprintState.currentContent = sprintState.currentContent.filter(item => item.id !== id);
          }
        };
        await supportFunc();
        await this.gamePreparationActions("default");
      }
      if(localStorage.userId && localStorage.chapter === "6") {
        const allUserWords = await getAlluserWords();

        const supportFunc = async () => {
          const allUserWordId = allUserWords.filter((word: IGetUsersWords) => word.difficulty !== "study").map((word: someData) => word.wordId);

          for(let i=0; i<allUserWordId.length; i+=1) {
            const word = await getWordById(allUserWordId[i]);
            sprintState.userHardWords[i] = word;
          }
        };
        await supportFunc();
        await this.gamePreparationActions("custom");
      }
    }
  };

  /* Обновление контента игры */
  updateGameContent = async (options: string) => {

    if(options === "default") {
      if(sprintState.stepCounter !== sprintState.currentContent.length) {
        try {
          this.sprintGamePage.wordInEng.element.innerText =  sprintState.currentContent[sprintState.stepCounter].word.toString();
          this.sprintGamePage.wordInRu.element.innerText =  sprintState.currentContent[myRandom(sprintState.stepCounter)].wordTranslate.toString();
        }
        catch (e) {
          console.error((e as Error).message, "Запрос на сервер по дефолту не вернул данных !!!");
        }
      }
    }

    if(options === "custom") {
      if(sprintState.userHardWordsCounter !== sprintState.userHardWords.length) {
        try {
          this.sprintGamePage.wordInEng.element.innerText =  sprintState.userHardWords[sprintState.userHardWordsCounter].word.toString();
          this.sprintGamePage.wordInRu.element.innerText =  sprintState.userHardWords[myRandom(sprintState.userHardWordsCounter, [0, sprintState.userHardWords.length])].wordTranslate.toString();
        }
        catch (e) {
          console.error((e as Error).message, "Запрос на сервер (кастомный) не вернул данных !!!");
        }
      }
    }
  };

  /* Проверка на крайнее слово */
  checkLimit = async (options: string) => {

    if(options === "default" && sprintState.parentNodeInfo === "about") {
      const length = sprintState.currentContent.length;

      if(sprintState.stepCounter === length && sprintState.currentPage < 29) {
        await updateSprintState(true, "none", false, false, true, false);
        sprintState.stepCounter = 0;
      } else if (sprintState.stepCounter === length && sprintState.currentPage === 29) {
        await makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintIntroCard.element, this.sprintResultsPage.element, "block");
        await this.timer?.timerStop();
      }
    }

    if(options === "default" && sprintState.parentNodeInfo === "dictionary") {
      const length = sprintState.currentContent.length;

      if(sprintState.stepCounter === length && sprintState.currentPage < 29 && sprintState.currentPage !== 0) {
        await updateSprintState(false, "none", false, false,
          true, false);
        sprintState.stepCounter = 0;
      } else if (sprintState.stepCounter === length && sprintState.currentPage === 0) {
        await makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintIntroCard.element, this.sprintResultsPage.element, "block");
        await this.timer?.timerStop();
      }
    }

    if(options === "custom" && sprintState.parentNodeInfo === "dictionary") {
      if(sprintState.userHardWordsCounter === sprintState.userHardWords.length) {
        await makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintIntroCard.element, this.sprintResultsPage.element, "block");
        await this.timer?.timerStop();
        /* Проверить нужно ли !!! */
        await this.updateSignalLampState(false);
      }
    }
  };

  /* Встроенная в таймер функция */
  showResults = async () => {
    makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintIntroCard.element, this.sprintResultsPage.element, "block");
    this.timer?.timerStop();
    /* Проверить нужно ли !!! */
    this.updateScore(false);
  };

  /* Озвучка правильных и неправильных ответов */
  makeAnswerVoise = async (soundLinkToBool: boolean) => {
    const player = this.sprintGamePage.audioPlayer.element as HTMLAudioElement;

    if(soundLinkToBool) {
      player.setAttribute("src", "./public/sprint-music/true.mp3");
    } else {
      player.setAttribute("src", "./public/sprint-music/false.mp3");
    }
    player.play();
  };

  //*********** Sprint Intro ************//

  /* Обработка кнопок выбора раздела в Sprint Intro */
  introChapterBtnsListener = () => {
    [this.sprintIntroCard.cardBtn1, this.sprintIntroCard.cardBtn2, this.sprintIntroCard.cardBtn3,
      this.sprintIntroCard.cardBtn4, this.sprintIntroCard.cardBtn5, this.sprintIntroCard.cardBtn6].forEach((btn) => {
      btn.element.addEventListener("click", async() => {
        sprintState.currentGroup = +btn.element.innerText - 1;
        this.gamePreparation();
      });
    });
  };


  //*********** Sprint Game ************//

  /* Прослушка кнопок выбора ответа */
  answerBtnsListener = async () => {
    [this.sprintGamePage.answerFalseBtn.element, this.sprintGamePage.answerTrueBtn.element].forEach(async (btn) => {
      btn.addEventListener("click", async (e) => {
        await this.unswersBtnsBlockToggle(true);
        const currentBtn = e.target as HTMLButtonElement;

        if(localStorage.userId && sprintState.parentNodeInfo === "dictionary" && localStorage.chapter === "6") {

          if(currentBtn.innerText === "CORRECT" && this.sprintGamePage.wordInRu.element.innerText === sprintState.userHardWords[sprintState.userHardWordsCounter].wordTranslate.toString()) {
            await this.responseProcessing(true, "custom");
          } else if (currentBtn.innerText === "CORRECT" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.userHardWords[sprintState.userHardWordsCounter].wordTranslate.toString()) {
            await this.responseProcessing(false, "custom");
          }

          if(currentBtn.innerText === "INCORRECT" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.userHardWords[sprintState.userHardWordsCounter].wordTranslate.toString()) {
            await this.responseProcessing(true, "custom");
          } else if (currentBtn.innerText === "INCORRECT" && this.sprintGamePage.wordInRu.element.innerText ===  sprintState.userHardWords[sprintState.userHardWordsCounter].wordTranslate.toString()) {
            await this.responseProcessing(false, "custom");
          }

        } else {
          if(currentBtn.innerText === "CORRECT" && this.sprintGamePage.wordInRu.element.innerText ===  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
            await this.responseProcessing(true, "default");
          } else if (currentBtn.innerText === "CORRECT" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
            await this.responseProcessing(false, "default");
          }

          if(currentBtn.innerText === "INCORRECT" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
            await this.responseProcessing(true, "default");
          } else if (currentBtn.innerText === "INCORRECT" && this.sprintGamePage.wordInRu.element.innerText ===  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
            await this.responseProcessing(false, "default");
          }
        }
        await this.unswersBtnsBlockToggle(false);
      });
    });
  };

  /* Обработка ответов пользователя */
  responseProcessing = async (bool: boolean, options: string) => {
    if(options === "default") {
      if(bool) {
        await this.userResponseProcessing(sprintState.currentContent[sprintState.stepCounter].word.toString(), sprintState.currentContent[sprintState.stepCounter].transcription.toString(), sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString(), sprintState.currentContent[sprintState.stepCounter].audio.toString(), true);

        if(localStorage.userId) {
          sprintState.userResult.push({"id": sprintState.currentContent[sprintState.stepCounter].id as string, "answer": true});
        }

        await updateSprintState("none", true, true, true, false, false);
        await this.updateScore(true);
        await this.updateSignalLampState(true);
        await this.makeAnswerVoise(true);
        await this.checkLimit("default");
        await this.updateGameContent("default");

      } else {
        await this.userResponseProcessing(sprintState.currentContent[sprintState.stepCounter].word.toString(), sprintState.currentContent[sprintState.stepCounter].transcription.toString(), sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString(), sprintState.currentContent[sprintState.stepCounter].audio.toString(), false);

        if(localStorage.userId) {
          sprintState.userResult.push({"id": sprintState.currentContent[sprintState.stepCounter].id as string, "answer": false});
        }

        await updateSprintState("none", true, true, false, false, false);
        await this.updateSignalLampState(true);
        await this.makeAnswerVoise(false);
        await this.checkLimit("default");
        await this.updateGameContent("default");
      }
    }
    if(options === "custom") {
      if(bool) {
        await this.userResponseProcessing(sprintState.userHardWords[sprintState.userHardWordsCounter].word.toString(), sprintState.userHardWords[sprintState.userHardWordsCounter].transcription.toString(), sprintState.userHardWords[sprintState.userHardWordsCounter].wordTranslate.toString(), sprintState.userHardWords[sprintState.userHardWordsCounter].audio.toString(), true);

        if(localStorage.userId) {
          sprintState.userResult.push({"id": sprintState.userHardWords[sprintState.userHardWordsCounter].id as string, "answer": true});
        }

        await updateSprintState("none", true, true, true, false, true);
        await this.updateScore(true);
        await this.updateSignalLampState(true);
        await this.makeAnswerVoise(true);
        await this.checkLimit("custom");
        await this.updateGameContent("custom");

      } else {
        await this.userResponseProcessing(sprintState.userHardWords[sprintState.userHardWordsCounter].word.toString(), sprintState.userHardWords[sprintState.userHardWordsCounter].transcription.toString(), sprintState.userHardWords[sprintState.userHardWordsCounter].wordTranslate.toString(), sprintState.userHardWords[sprintState.userHardWordsCounter].audio.toString(), false);

        if(localStorage.userId) {
          sprintState.userResult.push({"id": sprintState.userHardWords[sprintState.userHardWordsCounter].id as string, "answer": false});
        }

        await updateSprintState("", true, false, false, false, true);
        await this.updateSignalLampState(true);
        await this.makeAnswerVoise(false);
        await this.checkLimit("custom");
        await this.updateGameContent("custom");
      }
    }
  };

  /* Для обработки ответа пользователя и вывода результата Sprint */
  userResponseProcessing = async (wordInEng: string, wordInEngTranscription: string, wordInRu: string, wordVoiceLink: string, boolean: boolean) => {
    this.sprintResultsPage.result = new SprintResult(this.sprintResultsPage.results.element, wordInEng, wordInEngTranscription, wordInRu, wordVoiceLink, boolean);
    this.sprintResultsPage.result.specialFunc =  () => sayTheWord(this.sprintGamePage.audioPlayer.element as HTMLAudioElement, wordVoiceLink);
  };

  /* Блокировка/разблокировка кнопок ответа */
  unswersBtnsBlockToggle = async (bool: boolean) => {
    if(bool) {
      [this.sprintGamePage.answerTrueBtn.element, this.sprintGamePage.answerFalseBtn.element].forEach((btn) => {
        btn.setAttribute("disabled", "true");
      });
    } else {
      [this.sprintGamePage.answerTrueBtn.element, this.sprintGamePage.answerFalseBtn.element].forEach((btn) => {
        btn.removeAttribute("disabled");
      });
    }
  };

  /* Обновление сигнальных ламп */
  updateSignalLampState = async (bool: boolean) => {
    if(bool) {
      const signalLamps = [this.sprintGamePage.gameSignalOne.element, this.sprintGamePage.gameSignalTwo.element, this.sprintGamePage.gameSignalThree.element];

      signalLamps.forEach(lamp => lamp.classList.toggle("activate", false));
      for(let i = 1; i <= sprintState.correctAnswerCount; i += 1) {
        signalLamps[i-1].classList.toggle("activate", true);
      }
    }
    else {
      const signalLamps = [this.sprintGamePage.gameSignalOne.element, this.sprintGamePage.gameSignalTwo.element, this.sprintGamePage.gameSignalThree.element];

      signalLamps.forEach(lamp => lamp.classList.toggle("activate", false));
    }
  };

  /* Обновление счета игры */
  updateScore = async (bool: boolean) => {
    if(bool) {
      this.sprintGamePage.points.element.innerText = sprintState.score.toString();
    } else
      this.sprintGamePage.points.element.innerText = "0";
  };

  /* Кнопка включения и отключения звука на странице игры */
  gamePageGlobalSoundToggle = async () => {
    this.sprintGamePage.soundToggleBtn.element.addEventListener("click", () => {
      this.sprintGamePage.soundToggleBtn.element.classList.toggle("active");

      if(this.sprintGamePage.soundToggleBtn.element.className === "sprintSoundToggle-btn") {
        (this.sprintGamePage.audioPlayer.element as HTMLAudioElement).volume = 1;
      } else {
        (this.sprintGamePage.audioPlayer.element as HTMLAudioElement).volume = 0;
      }
    });
  };

  /* Кнопка full-screen на странице игры */
  gamePageFullScreenToggle = async () => {
    this.sprintGamePage.toFullScreenBtn.element.addEventListener("click", () => {
      const el = document.documentElement,
        rfs = el.requestFullscreen;

      if(typeof rfs!="undefined" && rfs){
        rfs.call(el);
      }
      if(document.fullscreenElement !== null) {
        document.exitFullscreen();
      }
    });
  };

  /* Кнопка закрытия страницы игры ( Х ) */
  closeGamePage = async () => {
    this.sprintGamePage.toSprintIntroPageBtn.element.addEventListener("click", async () => {
      await this.closeGameActions();
    });
  };


  //*********** Sprint Result ************//

  /* Кнопка закрытия страницы игры ( Х ) */
  closeResultsPage = async () => {
    this.sprintResultsPage.toSprintGamePageBtn.element.onclick = async () => {
      await this.closeGameActions();
    };
  };

  /* Задачи при закрытиее игры */
  closeGameActions = async () => {
    await makeVisibleCurrentSprintPage(this.sprintGamePage.element, this.sprintResultsPage.element, this.sprintIntroCard.element, "flex");
    console.log(sprintState.userResult);
    clearSprintState();
    this.sprintResultsPage.clearResults();
    this.timer?.timerStop();
    this.updateScore(false);
    this.updateSignalLampState(false);
  };

  /* Задачи при подготовке к игре */
  gamePreparationActions = async (options: string) => {
    const myFunc = async () => {
      if(options === "default") {
        await this.updateGameContent("default");
      } else {
        await this.updateGameContent("custom");
      }
    };
    await myFunc();
    await makeVisibleCurrentSprintPage(this.sprintIntroCard.element, this.sprintResultsPage.element, this.sprintGamePage.element, "flex");
    this.timer = new Timer(this.sprintGamePage.timer.element);
    this.timer.specialFunc = this.showResults;
    this.timer.timerRun();
  };

  /* Прослушиватель событий клавиатуры */
  keybordListener = () => {
    document.addEventListener("keyup",  this.funcForKE);
  };

  /* Функция для прослушивания событий клавиатуры */
  funcForKE = async (e: KeyboardEvent) => {

    if(localStorage.userId && sprintState.parentNodeInfo === "dictionary" && localStorage.chapter === "6") {

      if(e.code === "ArrowRight" && this.sprintGamePage.wordInRu.element.innerText === sprintState.userHardWords[sprintState.userHardWordsCounter].wordTranslate.toString()) {
        await this.responseProcessing(true, "custom");
      } else if (e.code === "ArrowRight" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.userHardWords[sprintState.userHardWordsCounter].wordTranslate.toString()) {this;
        await this.responseProcessing(false, "custom");
      }

      if(e.code === "ArrowLeft" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.userHardWords[sprintState.userHardWordsCounter].wordTranslate.toString()) {
        await this.responseProcessing(true, "custom");
      } else if (e.code === "ArrowLeft" && this.sprintGamePage.wordInRu.element.innerText ===  sprintState.userHardWords[sprintState.userHardWordsCounter].wordTranslate.toString()) {
        await this.responseProcessing(false, "custom");
      }
    } else {

      if(e.code === "ArrowRight" && this.sprintGamePage.wordInRu.element.innerText ===  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
        await this.responseProcessing(true, "default");
      } else if (e.code === "ArrowRight" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
        await this.responseProcessing(false, "default");
      }

      if(e.code === "ArrowLeft" && this.sprintGamePage.wordInRu.element.innerText !==  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
        await this.responseProcessing(true, "default");
      } else if (e.code === "ArrowLeft" && this.sprintGamePage.wordInRu.element.innerText ===  sprintState.currentContent[sprintState.stepCounter].wordTranslate.toString()) {
        await this.responseProcessing(false, "default");
      }
    }
  };

  /* Удаление слушателя клавиатуры при покидании страницы */

  removeKBEvent = () => {
    const exitPoints = document.querySelectorAll(".nav-link");

    exitPoints.forEach(item => {
      item.addEventListener("click", () => {
        document.removeEventListener("keyup", this.funcForKE, false);
      });
    });
  };


  starterKit = () => {
    this.sprintStart();
    this.introChapterBtnsListener();
    this.gamePageGlobalSoundToggle();
    this.gamePageFullScreenToggle();
    this.closeGamePage();
    this.answerBtnsListener();
    this.closeResultsPage();
    this.keybordListener();
    this.removeKBEvent();
  };
}