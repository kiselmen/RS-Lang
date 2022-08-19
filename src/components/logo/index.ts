import { Component } from "../../utils/component";
import "./styles.scss";

export class Logo extends Component {

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["logo"], "");
    new Component(this.element, "div", ["logo-title"], "RS-Lang");
    new Component(this.element, "div", ["logo-subtitle"], "Learning english");

    this.element.addEventListener("click", () => this.onLogoClick());
  }

  onLogoClick: () => void = () => {
    // this.element.classList.toggle("open");
  };

}