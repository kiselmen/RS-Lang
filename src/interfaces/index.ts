export interface IRoute {
  name: string;
  component: (param: string) => void;
}

export type elementData = {
  [key: string] : string
}

export type statisticsData = {
  learnedWords: string,
  optional : userOptional
}

// export const BASE_URL = "http://localhost:8081/";
export const BASE_URL = "https://react-learnwords-team74.herokuapp.com/";

export interface IWordsElement {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  __v: number,
  textExampleTranslate: string,
  textMeaningTranslate: string,
  wordTranslate: string
}

export interface IStatisticGame {
  totalWords: number;
  correctWordsPercent: number;
  series: number;
  maxSeries: number;
  correctArr: IWordsElement[];
  wrongArr: IWordsElement[];
}
export interface IGetUsersWords {
  difficulty: string,
  id: string,
  optional: someData[],
  wordId: string
}

export type someData = {
  [key: string] : number
}

export type wordOptional = {
  learned : string,
  learnDate: string,
  games: {
    sprint: someData,
    audiocall: someData,
  },
  totalAttempts: number,
  correctAnswers: number,
  isNew: boolean,
}

export type userOptional = {
  page : string,
  chapter: string,
  audiocall: {
    currSeria: number,
    maxSeria: number,
    dayStata: Array<elementData>
  },
  sprint: {
    currSeria: number,
    maxSeria: number,
    dayStata: Array<elementData>
  },
}
