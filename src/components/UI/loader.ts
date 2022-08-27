import "./loader.scss";
import { Component } from "../../utils/component";

export class UILoader extends Component {
  constructor(
    parentNode: HTMLElement,
    type = false,
  ) {
    super(parentNode, "div", ["lds_wrapper"], "");
    const rollers = new Component(this.element, "div", ["lds-roller"], "");
    for (let i = 0; i < 8; i++) {
      new Component(rollers.element, "div", [], "");
    }
    this.setVisible(type);
  }

  setVisible(type = false): void {
    type ? this.element.classList.remove("lds_disabled") : this.element.classList.add("lds_disabled");
  }

}
