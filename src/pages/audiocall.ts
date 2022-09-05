import { Component } from "../utils/component";
import { AudioCallStartPage } from "../components/audio-call/home/start-page";
import { AudioCallMainPage } from "../components/audio-call/main/main-page";
import { AudioCallStatisticPage } from "../components/audio-call/statistic/stat-page";

export class AudioCall extends Component {
  private homePage: AudioCallStartPage;
  private mainPage: AudioCallMainPage;
  private statPage: AudioCallStatisticPage;

  constructor(parentNode: HTMLElement, parameters: string) {
    super(parentNode, "div", ["audiocall"]);

    this.homePage = new AudioCallStartPage(this.element);
    this.mainPage = new AudioCallMainPage(this.element, parameters);
    this.statPage = new AudioCallStatisticPage(this.element, parameters);
  }
}