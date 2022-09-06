import { Component } from "../../../utils/component";
import { Chapters } from "./chapters/chapters";
import { Games } from "./games/games";

export class DictionaryHeader extends Component {
  chapters: Chapters;
  games: Games;
  onChangePage: () => void;

  constructor(parentNode: HTMLElement, onChangePage: () => void) {
    super(parentNode, "div", ["dictionary-header"],);
    this.onChangePage = () => onChangePage();

    this.chapters = new Chapters(this.element, () => this.onChangePage());
    this.games = new Games(this.element);
  }
}