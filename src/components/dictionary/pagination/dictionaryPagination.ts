import { Component } from "../../../utils/component";
import { UIButton } from "../../UI/button";

export class DictionaryPagination extends Component {
  private btnPrev: UIButton;
  private numberPage: Component;
  private btnNext: UIButton;
  page: number;
  onChangePage: () => void;

  constructor(parentNode: HTMLElement, onChangePage: () => void) {
    super(parentNode, "div", ["dictionary-pagination", "pagination"],);
    this.onChangePage = () => onChangePage();
    this.page = 0;
    if (localStorage.getItem("page")) {
      this.page = Number(localStorage.getItem("page"));
    }

    this.btnPrev = new UIButton(this.element, ["btn"], "Prev");
    this.numberPage = new Component(this.element, "span", ["pagination-number"], `Page: ${this.page}`);
    this.btnNext = new UIButton(this.element, ["btn"], "Next");
    this.btnPrev.onClickButton = () => this.onPrevPageClicl();
    this.btnNext.onClickButton = () => this.onNextPageClick();
    this.setupButtons();
  }

  onPrevPageClicl = () => {
    if (this.page !== 0) {
      this.page--;
      this.setupButtons();
    }
  };

  onNextPageClick = () => {
    if (this.page < 29) {
      this.page++;
      this.setupButtons();
    }
  };

  setupButtons = () => {
    if (this.page === 0) {
      this.btnPrev.setDisabled(true);
    } else {
      this.btnPrev.setDisabled(false);
    }
    if (this.page === 29) {
      this.btnNext.setDisabled(true);
    } else {
      this.btnNext.setDisabled(false);
    }  
    localStorage.setItem("page", String(this.page));
    this.numberPage.element.textContent = `Page: ${this.page}`;
    this.onChangePage();
  };
}