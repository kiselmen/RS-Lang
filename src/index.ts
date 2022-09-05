import { App } from "./app/app";
import "./styles/style.scss";

window.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.body;
  const app = new App(rootElement);
  
  app.init();
});
  