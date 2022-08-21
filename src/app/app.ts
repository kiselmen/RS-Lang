import { Component } from "../utils/component";
import { Router } from "../router/index";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export class App {
  private header;
  private main;
  private router;
  private footer;

  constructor(private rootElement: HTMLElement) {
    this.header = new Header(this.rootElement);
    this.main = new Component(this.rootElement, "main", ["main"]);

    this.router = new Router(this.main.element, () => this.header.nav.onInitNavSignUser());
    this.footer = new Footer(this.rootElement);
  }

  init(): void {
    this.router.initRouter();
  }
}
