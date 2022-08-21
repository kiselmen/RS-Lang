import { Component } from "../../../utils/component";
import { Chapters } from "./chapters/chapters";
import { Games } from "./games/games";

export class DictionaryHeader extends Component {
  private chapters: Chapters;
  private games: Games;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["dictionary-header"],);

    this.chapters = new Chapters(this.element);
    this.games = new Games(this.element);
  }
}