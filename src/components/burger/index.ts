import { Component } from "../../utils/component";
import "./styles.scss";

export class Burger extends Component {

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["burger"], "");
    new Component(this.element, "div", ["line", "line1"], "");
    new Component(this.element, "div", ["line", "line2"], "");
    new Component(this.element, "div", ["line", "line3"], "");
  }

  onBurgerClick: () => void = () => {
    this.element.classList.toggle("open");
  };

  onBurgerClose: () => void = () => {
    this.element.classList.remove("open");
  };

}