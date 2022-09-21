import {getUserStatistics} from "../../utils/loader";
import { LineChart, AutoScaleAxis } from "chartist";
import "./index.scss";
import  "../../../node_modules/chartist/dist/index.css";


const makeStatistics = async (target1El: HTMLElement, target2El: HTMLElement) => {

  let userStatisticsOptional;
  let userStatisticsLength;

  if(localStorage.userId && localStorage.token) {
    const currentUserId = localStorage.userId;
    const response = await getUserStatistics(currentUserId);
    userStatisticsOptional = response.data.optional;
    userStatisticsLength = userStatisticsOptional.audiocall.dayStata.length;
    console.log(userStatisticsOptional);

  }

  const myArr1 = [];
  const myArr2 = [];

  for(let i=0; i<userStatisticsLength; i += 1) {

    const audiocallNewWords = +userStatisticsOptional.audiocall.dayStata[i].newWords;
    const sprintNewWords = +userStatisticsOptional.sprint.dayStata[i].newWords;
    myArr1.push({x: i+1, y: audiocallNewWords + sprintNewWords});
    const audiocallLearned = +userStatisticsOptional.audiocall.dayStata[i].learnedWords;
    const sprintLearned = +userStatisticsOptional.sprint.dayStata[i].learnedWords;
    myArr2.push({x: i+1, y: audiocallLearned + sprintLearned});
  }

  console.log(myArr2);

  // learnedWords
  target1El.id = "chart1";
  target2El.id = "chart2";

  new LineChart(
    "#chart1",
    {
      series: [
        myArr1
      ]
    },
    {
      axisX: {
        type: AutoScaleAxis,
        onlyInteger: true
      }
    }
  );

  new LineChart(
    "#chart2",
    {
      series: [
        myArr2
      ]
    },
    {
      axisX: {
        type: AutoScaleAxis,
        onlyInteger: true
      }
    }
  );
};


export default makeStatistics;
