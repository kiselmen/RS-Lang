import { Component } from "../../../../utils/component";
import "../dictionary.scss";

export class Games extends Component {
  private dictionaryGames: Component;
  private dictionaryHeading: Component;
  private dictionaryGamesAudio: Component;
  private dictionaryGamesSprint: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["dictionary-wrapper__games"]);

    this.dictionaryHeading = new Component(this.element, "h2", ["dictionary-heading"], "Play the game:");
    this.dictionaryGames = new Component(this.element, "div", ["dictionary-games", "games"]);
    this.dictionaryGamesAudio = new Component(this.dictionaryGames.element, "a", ["dictionary-games__audio", "game", "btn-dictionary"], "Audio call");
    this.dictionaryGamesSprint = new Component(this.dictionaryGames.element, "a", ["dictionary-games__sprint", "game", "btn-dictionary"], "Sprint");
    this.dictionaryGamesAudio.element.setAttribute("href", "#/audiocall?type=dictionary");
    this.dictionaryGamesSprint.element.setAttribute("href", "#/sprint?type=dictionary");

    this.dictionaryGamesAudio.element.addEventListener("click", () => {
      window.location.hash = "#/audiocall?type=dictionary";
      location.reload();
    });
  }
}