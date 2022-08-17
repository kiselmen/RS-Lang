import { Component } from "../utils/component";

export class Dictionary extends Component {
  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["dictionary"]);
  }
}