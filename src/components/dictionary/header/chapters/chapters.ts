import { Component } from "../../../../utils/component";
import "../dictionary.scss";

export class Chapters extends Component {
  private dictionaryChapters: Component;
  private dictionaryHeading: Component;
  private dictionaryChapterName: Component;
  private dictionaryChaptersList: Component;
  dictionaryChaptersListEl: Component | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["dictionary-wrapper__chapters"]);

    this.dictionaryHeading = new Component(this.element, "h2", ["dictionary-heading"], "Choose a section:");
    this.dictionaryChapters = new Component(this.element, "div", ["dictionary-chapters", "chapters"]);
    this.dictionaryChapterName = new Component(this.dictionaryChapters.element, "span", ["dictionary-chapter__name"], "Chapter 1");
    this.dictionaryChaptersList = new Component(this.dictionaryChapters.element, "ul", ["chapters-list"]);
    for(let i = 1; i < 8; i++) {
      this.dictionaryChaptersListEl = new Component(this.dictionaryChaptersList.element, "li", ["chapters-item"], `Chapter ${i}`);
      if (i === 1) this.dictionaryChaptersListEl.element.classList.add("active");
    }

    this.dictionaryChapters.element.addEventListener("click", () => {
      this.dictionaryChaptersList.element.classList.toggle("open");
    });
    this.dictionaryChaptersList.element.addEventListener("mousedown", (e) => {
      const event = e.target as HTMLElement;
      const listItems = document.querySelectorAll(".chapters-item");
      listItems.forEach((el) => {
        const element = el as HTMLElement;
        element.classList.remove("active");
      });
      event.classList.add("active");
      this.dictionaryChapterName.element.textContent = event.textContent;
    });
    document.addEventListener("click", (e) => {
      const event = e.target as HTMLElement;
      if (!event.closest(".dictionary-chapters")) {
        this.dictionaryChaptersList.element.classList.remove("open");
      }
    });
  }
}