import { IRoute } from "../interfaces";
import { Component } from "../utils/component";
import { About } from "../pages/about";
import { Dictionary } from "../pages/dictionary";
import { AudioCall } from "../pages/audiocall";
import { Sprint } from "../pages/sprint";
import { Login } from "../pages/login";

export class Router {
  private readonly routes: Array<IRoute>;
  private defaultRoute: IRoute;

  // Pages
  aboutPage: Component;
  dictionaryPage: Component | undefined;
  audiocallPage: Component | undefined;
  sprintPage: Component | undefined;
  loginPage: Component | undefined;

  constructor(private rootElement: HTMLElement) {
    this.aboutPage = new About(this.rootElement);

    this.routes = [
      {
        name: "/",
        component: () => {
          this.rootElement.append(this.aboutPage.element);
        },
      },
      {
        name: "/dictionary",
        component: () => {
          this.dictionaryPage = new Dictionary(this.rootElement);
          this.rootElement.append(this.dictionaryPage.element);
        },
      },
      {
        name: "/audiocall",
        component: () => {
          this.audiocallPage = new AudioCall(this.rootElement);
          this.rootElement.append(this.audiocallPage.element);
        },
      },
      {
        name: "/sprint",
        component: () => {
          this.sprintPage = new Sprint(this.rootElement);
          this.rootElement.append(this.sprintPage.element);
        },
      },
      {
        name: "/login",
        component: () => {
          this.loginPage = new Login(this.rootElement);
          this.rootElement.append(this.loginPage.element);
        },
      },
    ];

    this.defaultRoute = {
      name: "Default router",
      component: () => {
        this.rootElement.innerHTML = "Default Page";
      },
    };
  }

  updateRouter(): void {
    this.rootElement.innerHTML = "";
    const currentRouteName = window.location.hash.slice(1);
    const currentRoute = this.routes.find(
      (page) => page.name === currentRouteName,
    );

    (currentRoute || this.defaultRoute).component();
  }

  initRouter(): void {
    if (window.location.hash === "") {
      window.location.hash = "#/";
    }

    window.onpopstate = () => this.updateRouter();
    this.updateRouter();
  }
}
