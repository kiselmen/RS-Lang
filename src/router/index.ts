import { IRoute } from "../interfaces";
import { Component } from "../utils/component";
import { About } from "../pages/about";
import { Dictionary } from "../pages/dictionary";
import { AudioCall } from "../pages/audiocall";
import { Sprint } from "../pages/sprint";
import { Login } from "../pages/login";
import { Profile } from "../pages/profile";
// import { Header } from "../components/header";

export class Router {
  private routes: Array<IRoute>;
  private readonly allRoutes: Array<IRoute>;
  private defaultRoute: IRoute;

  onInitNavSignUser: () => void;

  // Pages
  aboutPage: Component;
  dictionaryPage: Component | undefined;
  audiocallPage: Component | undefined;
  sprintPage: Component | undefined;
  loginPage: Component | undefined;
  profilePage: Component | undefined;

  constructor(private rootElement: HTMLElement, onInitNav: () => void ) {
    this.aboutPage = new About(this.rootElement);
    this.onInitNavSignUser = () => onInitNav();
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
          this.loginPage = new Login(this.rootElement, () => this.onSignOnUser("/login", "/profile"));
          this.rootElement.append(this.loginPage.element);
        },
      },
      {
        name: "/profile",
        component: () => {
          this.profilePage = new Profile(this.rootElement);
          this.rootElement.append(this.profilePage.element);
        },
      },
    ];

    this.allRoutes = [...this.routes];

    if (localStorage.getItem("token")) {
      this.routes = this.routes.filter( item => item.name !== "/login");
    } else {
      this.routes = this.routes.filter( item => item.name !== "/profile");
    }

    this.defaultRoute = {
      name: "Default router",
      component: () => {
        this.rootElement.innerHTML = "Default Page";
      },
    };
  }

  updateRouter(): void {
    console.log("Router");
    
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

  onSignOnUser(removeRoute: string, addRoute: string): void {
    if (localStorage.getItem("token")) {
      this.routes = this.allRoutes.filter( item => item.name !== removeRoute);
    } else {
      const route = this.allRoutes.filter( item => item.name === addRoute);
      this.routes = [...this.routes, ...route];
    }
    this.initRouter();
    this.onInitNavSignUser();
  }
}
