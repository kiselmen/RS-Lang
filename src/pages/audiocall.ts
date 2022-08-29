import { Component } from "../utils/component";
import { AudioCallStartPage } from "../components/audio-call/home/start-page";
import { AudioCallMainPage } from "../components/audio-call/main/main-page";

export class AudioCall extends Component {
  private homePage: AudioCallStartPage;
  private mainPage: AudioCallMainPage;

  constructor(parentNode: HTMLElement, parameters: string) {
    super(parentNode, "div", ["audiocall"]);

    console.log(parameters);
    
    this.homePage = new AudioCallStartPage(this.element);
    this.mainPage = new AudioCallMainPage(this.element);
  }
}