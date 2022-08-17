import { Component } from "../utils/component";

export class Sprint extends Component {
  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["sprint"]);
  }
}