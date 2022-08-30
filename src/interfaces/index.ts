export interface IRoute {
  name: string;
  component: (param: string) => void;
}
  
export type elementData = {
  [key: string] : string 
}

export type statisticsData = {
  learnedWords: string,
  optional : elementData
}

export const BASE_URL = "http://localhost:8081/";

type IdValue = {
  $oid: string
}

export interface IWordsElement {
  _id: IdValue,
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