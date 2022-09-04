import "../styles/profile.scss";
import { Component } from "../utils/component";
import { UIButton } from "../components/UI/button";
import { getUserStatistics } from "../utils/loader";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";

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
  allTimeSubTitle;
  allTimeContentWrapper;
  allTimeLearnedWords;
  allTimeProgress;
  learnedWordsCounter;
  learnedWordsTextContentContainer;
  todayAudioCallStatContent;
  todaySprintStatContent;
  allTimeFirstBlockWrap;
  allTimeSecondBlockWrap;
  onUpdateRouter: () => void;

  constructor(parentNode: HTMLElement, updateRouter: () => void) {
    super(parentNode, "div", ["profile"]);
    this.onUpdateRouter = () => updateRouter();

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

    this.allTimeSubTitle = new Component(this.contentWrapper.element, "h3", ["statistics-subTitle", "allTime-subTitle"], "All Time");
    this.allTimeContentWrapper = new Component(this.contentWrapper.element, "div", ["allTimeContent-wrapper"]);

    this.allTimeFirstBlockWrap = new Component(this.allTimeContentWrapper.element, "div", ["firstBlock-wrapper"],);
    new Component(this.allTimeFirstBlockWrap.element, "div", ["allTimeLearnedWords-title", "allTime-title"], "Learned words");
    this.allTimeLearnedWords = new Component(this.allTimeFirstBlockWrap.element, "div", ["allTimeLearnedWords-wrapper"]);

    this.allTimeSecondBlockWrap = new Component(this.allTimeContentWrapper.element, "div", ["second-wrapper"],);
    new Component(this.allTimeSecondBlockWrap.element, "div", ["allTimeProgress-title", "allTime-title"], "Progress");
    this.allTimeProgress = new Component(this.allTimeSecondBlockWrap.element, "div", ["allTimeLearnedWords-wrapper"]);

    this.allTimeLearnedWords.element.id = "chart1";
    this.allTimeProgress.element.id = "chart2";

    /* Внутиренние блоки */
    this.learnedWordsCounter = new Component(this.todayLearnedWordsStatWrapper.element, "div", ["learnedWords-counter"], "0");
    this.learnedWordsTextContentContainer = new Component(this.todayLearnedWordsStatWrapper.element, "div", ["learnedWordsTxtContent-container"]);
    new Component(  this.learnedWordsTextContentContainer.element, "div", ["learnedWordsTxtContent-textContent"], "words");
    new Component(  this.learnedWordsTextContentContainer.element, "div", ["learnedWordsTxtContent-textContent"], "were learned");

    this.todayAudioCallStatContent = new StatisticsContentPart(this.todayAudioCallStatWrapper.element, "Audio call");
    this.todaySprintStatContent = new StatisticsContentPart(this.todaySprintStatWrapper.element, "Sprint");


    this.requestUserStatInfo();
    this.createPiechart1();
    this.createPiechart2();
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

      const audiocallStatistics = userStatistics.optional.audiocall;

      console.log(userStatistics);

      // const sprintStatistics = userStatistics.optional.sprint;

      //* Еежедневная //*

      /* Vocabruary */
      this.learnedWordsCounter.element.innerText = userStatistics.learnedWords;
      /* Sprint */
      const audiocallAccuracy = +audiocallStatistics.dayStata[0].correctAnswers * 100 / +audiocallStatistics.dayStata[0].totalQuestions;
      // const sprintAccuracy = +sprintStatistics.dayStata[0].correctAnswers * 100 / +sprintStatistics.dayStata[0].totalQuestions;

      // this.todaySprintStatContent.setCounter(0, sprintStatistics.dayStata[0].totalQuestions);
      // this.todaySprintStatContent.setCounter(1,  sprintAccuracy + " %");
      // this.todaySprintStatContent.setCounter(2, sprintStatistics.maxSeria);
      /* Audio Call */
      this.todayAudioCallStatContent.setCounter(0, audiocallStatistics.dayStata[0].totalQuestions);
      this.todayAudioCallStatContent.setCounter(1, audiocallAccuracy + " %");
      this.todayAudioCallStatContent.setCounter(2, audiocallStatistics.maxSeria);

      // //* Общая //*
      // this.allTimeLearnedWords.element.style.cssText = "width: 45%; height: auto;";

    }
  };

  createPiechart1 = () => {
    // Create root and chart
    const root = am5.Root.new("chart1");
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.horizontalLayout,
        radius: am5.percent(70),
        innerRadius: am5.percent(50),

      })
    );

    // Define data
    const data = [{
      source: "vocabruary",
      value: 100
    }, {
      source: "audio call",
      value: 100
    }, {
      source: "sprint",
      value: 100
    }];

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Words",
        valueField: "value",
        categoryField: "source",
        alignLabels: false
      })
    );

    series.data.setAll(data);

    series.slices.template.set("tooltipText", "[bold]{value}");
    series.labels.template.setAll({
      radius: 500
    });

    series.labels.template.setAll({
      text: "{category}",
      textType: "circular",
      inside: false,
      radius: 25
    });

    // series.labels.template.set("text", "{category}: [bold]{Total.formatNumber()} ({value})");
    // series.labels.template.set("forceHidden", true);
    // // Add legend
    // const legend = chart.children.push(am5.Legend.new(root, {
    //   centerX: am5.percent(50),
    //   x: am5.percent(50),
    //   layout: root.horizontalLayout
    // }));

    // legend.data.setAll(series.dataItems);
  };

  createPiechart2 = () => {
    // Create root and chart
    const root = am5.Root.new("chart2");
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.horizontalLayout,
        radius: am5.percent(70),
        innerRadius: am5.percent(50),

      })
    );

    // Define data
    const data = [{
      source: "vocabruary",
      value: 100
    }, {
      source: "audio call",
      value: 100
    }, {
      source: "sprint",
      value: 100
    }];

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Words",
        valueField: "value",
        categoryField: "source",
        alignLabels: false
      })
    );

    series.data.setAll(data);

    series.slices.template.set("tooltipText", "[bold]{value}");
    series.labels.template.setAll({
      radius: 500
    });

    series.labels.template.setAll({
      text: "{category}",
      textType: "circular",
      inside: false,
      radius: 25
    });
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

  constructor(parentNode: HTMLElement, title: string) {
    super(parentNode, "div", ["statistics-item"]);

    const partOfClassName = title.toLowerCase().split(" ").join("");

    new Component(this.element, "p", [partOfClassName + "-title"], title);
    this.contentWrapper = new Component(this.element, "div", [partOfClassName + "Content-wrapper"]);
    this.block1Wrapper = new Component(this.contentWrapper.element, "div", [partOfClassName + "Block1-wrapper", partOfClassName + "Block-wrapper"]);
    this.block2Wrapper = new Component(this.contentWrapper.element, "div", [partOfClassName + "Block2-wrapper", partOfClassName + "Block-wrapper"]);
    this.block3Wrapper = new Component(this.contentWrapper.element, "div", [partOfClassName + "Block3-wrapper", partOfClassName + "Block-wrapper"]);

    this.block1Counter = new Component(this.block1Wrapper.element, "div", [partOfClassName + "Block1-counter", partOfClassName + "Block-counter"], "0");
    new Component(this.block1Wrapper.element, "p", [partOfClassName + "Block1-textContent", partOfClassName + "Block-textContent"], "words");

    this.block2Counter = new Component(this.block2Wrapper.element, "div", [partOfClassName + "Block2-counter", partOfClassName + "Block-counter"], "0%");
    new Component(this.block2Wrapper.element, "p", [partOfClassName + "Block2-textContent", partOfClassName + "Block-textContent"], "accuracy");

    this.block3Counter = new Component(this.block3Wrapper.element, "div", [partOfClassName + "Block3-counter", partOfClassName + "Block-counter"], "0");
    new Component(this.block3Wrapper.element, "p", [partOfClassName + "Block3-textContent", partOfClassName + "Block-textContent"], "in a row");
  }

  setCounter = (counterNumber: number, value: string): string => {
    return [this.block1Counter, this.block2Counter, this.block3Counter][counterNumber].element.innerText = value;
  };

  getCounter = (counterNumber: number): string => {
    return [this.block1Counter, this.block2Counter, this.block3Counter][counterNumber].element.innerText;
  };

}