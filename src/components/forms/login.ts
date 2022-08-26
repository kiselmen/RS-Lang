import { Component } from "../../utils/component";
import { UIInput } from "../UI/input";
import { UIButton } from "../UI/button";

import "./login.scss";

export class LoginForm extends Component {
  eMailInput: UIInput;
  passInput: UIInput;
  buttonRegister: UIButton;
  buttonLogin: UIButton;
  message: Component;
  showPass: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "form", ["form"], "");

    const eMailContainer = new Component(this.element, "div", ["form-item", "item"]);
    new Component(eMailContainer.element, "label", ["item-label"], "EMail");
    this.eMailInput = new UIInput(eMailContainer.element, "email", ["item-input"]);
    this.eMailInput.element.setAttribute("placeholder", "E-mail");
    this.eMailInput.element.setAttribute("required", "");

    const passContainer = new Component(this.element, "div", ["form-item", "item"]);
    new Component(passContainer.element, "label", ["item-label"], "Password");
    this.passInput = new UIInput(passContainer.element, "password", ["item-input"]);
    this.passInput.element.setAttribute("placeholder", "password");
    this.passInput.element.setAttribute("required", "");

    const showPassContainer = new Component(this.element, "div", ["form-item", "item"]);
    this.showPass = new Component(showPassContainer.element, "div", ["item-checkbox"], "");
    new Component(showPassContainer.element, "label", ["item-label"], "Show password");
    this.showPass.element.addEventListener("click", () => this.toggleShow());

    const messageContainer = new Component(this.element, "div", ["form-item", "item"], "");
    this.message = new Component(messageContainer.element, "div", ["item-message"], "");

    const buttonContainer = new Component(this.element, "div", ["form-item", "item"]);
    this.buttonLogin = new UIButton(buttonContainer.element, ["btn"], "Login");
    this.buttonRegister = new UIButton(buttonContainer.element, ["btn"], "Register");
  }

  toggleShow() {
    this.showPass.element.classList.toggle("item-checkbox__active");
    if (this.showPass.element.classList.contains("item-checkbox__active")) {
      this.passInput.element.setAttribute("type", "text");
    } else {
      this.passInput.element.setAttribute("type", "password");
    }
  }
}  