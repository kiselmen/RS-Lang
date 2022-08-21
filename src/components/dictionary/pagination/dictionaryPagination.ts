import { Component } from "../../../utils/component";

export class DictionaryPagination extends Component {
  private btnPrev: Component;
  private numberPage: Component;
  private btnNext: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["dictionary-pagination", "pagination"],);

    this.btnPrev = new Component(this.element, "button", ["pagination-btn__prev", "btn-dictionary"], "Prev");
    this.numberPage = new Component(this.element, "span", ["pagination-number"], `Page: 1`);
    this.btnNext = new Component(this.element, "button", ["pagination-btn__next", "btn-dictionary"], "Next");
  }
}