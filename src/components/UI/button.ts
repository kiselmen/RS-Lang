import "./button.scss";
import { Component } from "../../utils/component";

export class UIButton extends Component {
  onClickButton: (e: Event) => void = (e) => e;

  constructor(
    parentNode: HTMLElement,
    styles: string[] = [],
    content: string,
    disabled = false,
  ) {
    super(parentNode, "button", ["btn"], content);

    this.element.classList.add(...styles);
    this.element.addEventListener("click", (e) => this.onClickButton(e));

    if (disabled) {
      this.setDisabled(true);
    }
  }

  setDisabled(type = false): void {
    this.element.toggleAttribute("disabled", type);
  }

  removeDisabled(): void {
    this.element.removeAttribute("disabled");
  }
}
