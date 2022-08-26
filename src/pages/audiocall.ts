import { Component } from "../utils/component";
import { AudioCallStartPage } from "../components/audio-call/start-page";

export class AudioCall extends Component {
  private homePage: AudioCallStartPage;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["audiocall"]);

    this.homePage = new AudioCallStartPage(this.element);
  }
}