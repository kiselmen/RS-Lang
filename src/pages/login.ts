import { Component } from "../utils/component";
import { LoginForm } from "../components/forms/login";

export class Login extends Component{
  loginForm : LoginForm;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["container"], "");
    this.loginForm = new LoginForm(this.element);
  }
}