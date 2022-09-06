import "../styles/profile.scss";
import { Component } from "../utils/component";
import { UIButton } from "../components/UI/button";
import { getUserStatistics } from "../utils/loader";
import { elementData } from "../interfaces/index";

export class Profile extends Component {
  profileHeaderContainer;
  title;
  userLogOut;
  contentWrapper;
  todaySubTitle;
  todayContentWrapper;
  todayLearnedWordsStatWrapper;
  todayAudioCallStatWrapper;
  todaySprintStatWrapper;
  todayLearnedWordsCounter;
  todayAudioCallStatContent;
  todaySprintStatContent;
  learnedWords: number;

  onUpdateRouter: () => void;

  constructor(parentNode: HTMLElement, updateRouter: () => void) {
    super(parentNode, "div", ["profile"]);
    this.onUpdateRouter = () => updateRouter();
    this.learnedWords = 0;

    this.profileHeaderContainer = new Component(this.element, "div", ["statisticsHeader-container"]);
    this.title = new Component(this.profileHeaderContainer.element, "h3", ["statistics-title"], "Statistics");
    this.userLogOut = new UIButton(this.profileHeaderContainer.element,["statisticsProfileLogout"], "Log Out");
    this.userLogOut.onClickButton = async () => this.onLogout();

    this.contentWrapper = new Component(this.element, "div", ["statisticsContent-wrapper"]);
    this.todaySubTitle = new Component(this.contentWrapper.element, "h3", ["statistics-subTitle", "today-subTitle"], "Today");
    this.todayContentWrapper = new Component(this.contentWrapper.element, "div", ["todayStatistics-wrapper"]);
    this.todayLearnedWordsStatWrapper = new Component(this.todayContentWrapper.element, "div", ["todayLearnedWords-wrapper"]);
    this.todayAudioCallStatWrapper = new Component(this.todayContentWrapper.element, "div", ["todayLearnedWords-wrapper"]);
    this.todaySprintStatWrapper = new Component(this.todayContentWrapper.element, "div", ["todayLearnedWords-wrapper"]);

    /* Внутиренние блоки */

    /* Today */
    this.todayLearnedWordsCounter = new StatisticsContentPart(this.todayLearnedWordsStatWrapper.element, "Words");
    this.todayAudioCallStatContent = new StatisticsContentPart(this.todayAudioCallStatWrapper.element, "Audio call");
    this.todaySprintStatContent = new StatisticsContentPart(this.todaySprintStatWrapper.element, "Sprint");

    this.requestUserStatInfo();
    // this.createPiechart1();
  }

  onLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("page");
    localStorage.removeItem("chapter");
    localStorage.removeItem("audiocall");
    localStorage.removeItem("sprint");
    localStorage.removeItem("words");

    window.location.hash = "#/";
    this.onUpdateRouter();
  }

  /* Вывод статистики */
  requestUserStatInfo = async () => {

    if(localStorage.userId && localStorage.token) {
      const currentUserId = localStorage.userId;
      const response = await getUserStatistics(currentUserId);
      const userStatistics = response.data;

      const audiocallStatistics = userStatistics.optional.audiocall as {
        currSeria: number,
        maxSeria: number,
        dayStata: Array<elementData>
      };
      const sprintStatistics = userStatistics.optional.sprint as {
        currSeria: number,
        maxSeria: number,
        dayStata: Array<elementData>
      };

      this.learnedWords = +userStatistics.learnedWords;

      //* Еежедневная //*

      /* Sprint */
      let newWordsSprint = 0;
      let totalQuestionsSprint = 0;
      let correctAnswerSprint = 0;
      const sprintStatisticsDayStata = sprintStatistics.dayStata as Array<elementData>;
      sprintStatisticsDayStata.forEach( item => {
        newWordsSprint = newWordsSprint + Number(item.newWords);
        totalQuestionsSprint = totalQuestionsSprint + Number(item.totalQuestions);
        correctAnswerSprint = correctAnswerSprint + Number(item.correctAnswers);
      });

      let newWordsAudio = 0;
      let totalQuestionsAudio = 0;
      let correctAnswerAudio = 0;
      const audiocallStatisticsDayStata = audiocallStatistics.dayStata as Array<elementData>;
      audiocallStatisticsDayStata.forEach( item => {
        newWordsAudio = newWordsAudio + Number(item.newWords);
        totalQuestionsAudio = totalQuestionsAudio + Number(item.totalQuestions);
        correctAnswerAudio = correctAnswerAudio + Number(item.correctAnswers);
      });
      
      const sprintAccuracy = totalQuestionsSprint ? (correctAnswerSprint * 100 / totalQuestionsSprint).toFixed(2) : 0.00;
      this.todaySprintStatContent.setCounter(0, String(newWordsSprint));
      this.todaySprintStatContent.setCounter(1, Number(sprintAccuracy).toFixed(2) + " %");
      this.todaySprintStatContent.setCounter(2, String(sprintStatistics.maxSeria));

      /* Audio Call */
      const audiocallAccuracy = totalQuestionsAudio ? (correctAnswerAudio * 100 / totalQuestionsAudio).toFixed(2) : 0.00;
      this.todayAudioCallStatContent.setCounter(0, String(newWordsAudio));
      this.todayAudioCallStatContent.setCounter(1, Number(audiocallAccuracy).toFixed(2) + " %");
      this.todayAudioCallStatContent.setCounter(2, String(audiocallStatistics.maxSeria));

      /* Vocabruary */
      this.todayLearnedWordsCounter.block3Title.element.innerText = "learned words";
      const totalAccuracy = totalQuestionsSprint + totalQuestionsAudio ? ((correctAnswerSprint + correctAnswerAudio) * 100 / (totalQuestionsSprint + totalQuestionsAudio)).toFixed(2) : 0.00;
      this.todayLearnedWordsCounter.setCounter(0, (newWordsSprint + newWordsAudio).toString());
      this.todayLearnedWordsCounter.setCounter(1, Number(totalAccuracy).toFixed(2) + " %");
      this.todayLearnedWordsCounter.setCounter(2, String(this.learnedWords));


    }
  };
}


/* Класс для отдельных компонентов статистики - Sprint и Audiocall */
class StatisticsContentPart extends Component {
  contentWrapper;
  block1Wrapper;
  block2Wrapper;
  block3Wrapper;
  block1Counter;
  block2Counter;
  block3Counter;
  block1Title;
  block2Title;
  block3Title;

  constructor(parentNode: HTMLElement, title: string) {
    super(parentNode, "div", ["statistics-item"]);

    const partOfClassName = title.toLowerCase().split(" ").join("");

    new Component(this.element, "p", [partOfClassName + "-title"], title);
    this.contentWrapper = new Component(this.element, "div", [partOfClassName + "Content-wrapper"]);
    this.block1Wrapper = new Component(this.contentWrapper.element, "div", [partOfClassName + "Block1-wrapper", partOfClassName + "Block-wrapper"]);
    this.block2Wrapper = new Component(this.contentWrapper.element, "div", [partOfClassName + "Block2-wrapper", partOfClassName + "Block-wrapper"]);
    this.block3Wrapper = new Component(this.contentWrapper.element, "div", [partOfClassName + "Block3-wrapper", partOfClassName + "Block-wrapper"]);

    this.block1Counter = new Component(this.block1Wrapper.element, "div", [partOfClassName + "Block1-counter", partOfClassName + "Block-counter"], "0");
    this.block1Title = new Component(this.block1Wrapper.element, "p", [partOfClassName + "Block1-textContent", partOfClassName + "Block-textContent"], "new words");

    this.block2Counter = new Component(this.block2Wrapper.element, "div", [partOfClassName + "Block2-counter", partOfClassName + "Block-counter"], "0%");
    this.block2Title = new Component(this.block2Wrapper.element, "p", [partOfClassName + "Block2-textContent", partOfClassName + "Block-textContent"], "accuracy");

    this.block3Counter = new Component(this.block3Wrapper.element, "div", [partOfClassName + "Block3-counter", partOfClassName + "Block-counter"], "0");
    this.block3Title = new Component(this.block3Wrapper.element, "p", [partOfClassName + "Block3-textContent", partOfClassName + "Block-textContent"], "in line");
  }

  setCounter = (counterNumber: number, value: string): string => {
    return [this.block1Counter, this.block2Counter, this.block3Counter][counterNumber].element.innerText = value;
  };

  getCounter = (counterNumber: number): string => {
    return [this.block1Counter, this.block2Counter, this.block3Counter][counterNumber].element.innerText;
  };
}