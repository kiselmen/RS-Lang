import { Component } from "../utils/component";

export class AudioCall extends Component {
  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["audiocall"]);
  }
}