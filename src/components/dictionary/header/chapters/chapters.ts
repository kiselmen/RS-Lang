import { Component } from "../../../../utils/component";
import "../dictionary.scss";

export class Chapters extends Component {
  private dictionaryChapters: Component;
  private dictionaryHeading: Component;
  private dictionaryChapterName: Component;
  private dictionaryChaptersList: Component;
  dictionaryChaptersListEl: Component | undefined;

  chapter: number;
  chapterColor: string;

  constructor(parentNode: HTMLElement, onChangePage: () => void) {
    super(parentNode, "div", ["dictionary-wrapper__chapters"]);

    this.chapter = 0;
    this.chapterColor = "1";
    if (localStorage.getItem("chapter")) {
      this.chapter = Number(localStorage.getItem("chapter"));
    } else {
      localStorage.setItem("chapter", String(this.chapter));
    }
    if (localStorage.getItem("chapterColor")) {
      this.chapterColor = String(localStorage.getItem("chapterColor"));
    } else {
      localStorage.setItem("chapterColor", String(this.chapterColor));
    }
    this.changeTheme(this.chapterColor);
    onChangePage();
    this.dictionaryHeading = new Component(this.element, "h2", ["dictionary-heading"], "Choose a section:");
    this.dictionaryChapters = new Component(this.element, "div", ["dictionary-chapters", "chapters"]);
    this.dictionaryChapterName = new Component(this.dictionaryChapters.element, "span", ["dictionary-chapter__name"], "Chapter " + String(this.chapter + 1));
    this.dictionaryChaptersList = new Component(this.dictionaryChapters.element, "ul", ["chapters-list"]);
    let chaptersCount = 6;
    if (localStorage.getItem("token")){
      chaptersCount = 7;
    }
    for(let i = 1; i <= chaptersCount; i++) {
      this.dictionaryChaptersListEl = new Component(this.dictionaryChaptersList.element, "li", ["chapters-item"], `Chapter ${i}`);
      this.dictionaryChaptersListEl.element.setAttribute("id", `chapter-${i}`);
      if (i === this.chapter + 1) this.dictionaryChaptersListEl.element.classList.add("active");
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
      if (event.classList.contains("chapters-item")) {
        this.changeTheme(String(event.id[event.id.length - 1]));
        localStorage.setItem("chapterColor", String(event.id[event.id.length - 1]));
        const curChapter = Number(event.textContent?.slice(-1)) - 1;
        if (this.chapter !== curChapter) {
          localStorage.setItem("chapter", String(curChapter));
          this.chapter = curChapter;
          onChangePage();
        }
      }
    });
  }
  changeTheme = (id: string) => {
    (<HTMLElement>document.querySelector(".dictionary")).setAttribute("class", "dictionary");
    (<HTMLElement>document.querySelector(".dictionary")).classList.add("dictionary", `dictionary-chapter-${id}`);
  };
}