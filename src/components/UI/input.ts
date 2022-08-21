import { Component } from "../../utils/component";
import "./input.scss";

export class UIInput extends Component {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getInputValue: (event: Event) => void = () => {};

  constructor(
    parentNode: HTMLElement,
    type: string,
    styles: string[] = [],

    initValue?: string,
  ) {
    super(parentNode, "input", ["ui-input"]);
    this.element.setAttribute("type", type);
    this.element.classList.add(...styles);

    if (initValue) {
      this.element.setAttribute("value", initValue);
    }

    this.element.addEventListener("input", (event) =>
      this.getInputValue(event),
    );
  }
}
