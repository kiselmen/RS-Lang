import { IRoute } from "../interfaces";
import { Component} from "../utils/component";
import { About } from "../pages/about";
import { Dictionary } from "../pages/dictionary";
import { AudioCall } from "../pages/audiocall";
import { Sprint } from "../pages/sprint";
import { Login } from "../pages/login";
import { Profile } from "../pages/profile";

export class Router {
  private routes: Array<IRoute>;
  private readonly allRoutes: Array<IRoute>;
  private defaultRoute: IRoute;

  onInitNavSignUser: () => void;
  onRenderFooter: () => void;

  // Pages
  aboutPage: Component;
  dictionaryPage: Component | undefined;
  audiocallPage: Component | undefined;
  sprintPage: Component | undefined;
  loginPage: Component | undefined;
  profilePage: Component | undefined;
  currRoute: string;

  constructor(private rootElement: HTMLElement, onInitNav: () => void, onRenderFooter: () => void ) {
    this.aboutPage = new About(this.rootElement);
    this.onInitNavSignUser = () => onInitNav();
    this.onRenderFooter = () => onRenderFooter();
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
          this.dictionaryPage = new Dictionary(this.rootElement, () => this.onSignOnOffUser("/profile", "/login"));
          this.rootElement.append(this.dictionaryPage.element);
        },
      },
      {
        name: "/audiocall",
        component: (param) => {
          this.audiocallPage = new AudioCall(this.rootElement, param);
          this.rootElement.append(this.audiocallPage.element);
        },
      },
      {
        name: "/sprint",
        component: (param) => {
          this.sprintPage = new Sprint(this.rootElement, param);
          this.rootElement.append(this.sprintPage.element);
        },
      },
      {
        name: "/login",
        component: () => {
          this.loginPage = new Login(this.rootElement, () => this.onSignOnOffUser("/login", "/profile"));
          this.rootElement.append(this.loginPage.element);
        },
      },
      {
        name: "/profile",
        component: () => {
          this.profilePage = new Profile(this.rootElement, () => this.onSignOnOffUser("/profile", "/login"));
          this.rootElement.append(this.profilePage.element);
        },
      },
    ];

    this.allRoutes = [...this.routes];
    this.currRoute = "/";
    if (localStorage.getItem("token")) {
      this.routes = this.routes.filter( item => item.name !== "/login");
    } else {
      this.routes = this.routes.filter( item => item.name !== "/profile");
    }

    this.defaultRoute = {
      name: "/",
      component: () => {
        this.rootElement.append(this.aboutPage.element);
      },
    };
  }

  updateRouter(): void {
    this.rootElement.innerHTML = "";
    const currentRouteFromHash = window.location.hash.slice(1);
     
    const currentRouteArray = currentRouteFromHash.split("?");
    const currentRouteName = currentRouteArray[0];
    let currentRouteParam = "";
    if (currentRouteArray.length > 1) {
      currentRouteParam = String(currentRouteArray[1]);
    } 
    
    const currentRoute = this.routes.find(
      (page) => page.name === currentRouteName,
    );
    
    !currentRouteParam ? window.location.hash = (currentRoute || this.defaultRoute).name : window.location.hash = (currentRoute || this.defaultRoute).name + "?" + currentRouteParam;
    (currentRoute || this.defaultRoute).component(currentRouteParam);
    this.currRoute = (currentRoute || this.defaultRoute).name;
    this.onRenderFooter();
  }

  initRouter(): void {
    if (window.location.hash === "") {
      window.location.hash = "#/";
    }

    window.onpopstate = () => this.updateRouter();
    this.updateRouter();
  }

  onSignOnOffUser(removeRoute: string, addRoute: string): void {
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
