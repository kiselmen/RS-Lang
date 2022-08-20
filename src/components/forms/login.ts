import { Component } from "../../utils/component";
import { UIInput } from "../UI/input";
import { UIButton } from "../UI/button";

import "./login.scss";

export class LoginForm extends Component {
  eMailInput: UIInput;
  passInput: UIInput;
  buttonRegister: UIButton;
  buttonLogin: UIButton;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "form", ["form"], "");

    const eMailContainer = new Component(this.element, "div", ["form-item", "item"]);
    new Component(eMailContainer.element, "label", ["item-label"], "EMail");
    this.eMailInput = new UIInput(eMailContainer.element, "email", ["item-input"]);
    this.eMailInput.element.setAttribute("placeholder", "E-mail");
    this.eMailInput.element.setAttribute("required", "");

    const passContainer = new Component(this.element, "div", ["form-item", "item"]);
    new Component(passContainer.element, "label", ["item-label"], "Password");
    this.passInput = new UIInput(passContainer.element, "text", ["item-input"]);
    this.passInput.element.setAttribute("placeholder", "password");
    this.passInput.element.setAttribute("required", "");

    const buttonContainer = new Component(this.element, "div", ["form-item", "item"]);
    this.buttonLogin = new UIButton(buttonContainer.element, ["btn"], "Login");
    this.buttonRegister = new UIButton(buttonContainer.element, ["btn"], "Register");
  }
}  