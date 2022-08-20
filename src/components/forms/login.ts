import { Component } from "../../utils/component";
import { load } from "../../utils/loader";
import { UIInput } from "../UI/input";
import { UIButton } from "../UI/button";

const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
// const BASE_URL = "http://localhost:8081";

import "./login.scss";

export type elementData = {
  [key: string] : string 
}

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

    this.buttonLogin.onClickButton = async (e: Event) => this.onLogin(e);
    this.buttonRegister.onClickButton = async (e: Event) => this.onRegister(e);
  }

  onLogin = async (e: Event) => {
    e.preventDefault();
    const eMailElement = this.eMailInput.element as HTMLInputElement;
    const passElement = this.passInput.element as HTMLInputElement;

    const isValidate = this.onValidateEmail(eMailElement) && this.onValidatePass(passElement);

    console.log(isValidate);

  };

  onRegister = async (e: Event) => {
    e.preventDefault();
    const eMailElement = this.eMailInput.element as HTMLInputElement;
    const passElement = this.passInput.element as HTMLInputElement;

    const isValidate = this.onValidateEmail(eMailElement) && this.onValidatePass(passElement);
    if (isValidate) {
      const userData = this.onDataConstruct(eMailElement, passElement);
      
      const response = await this.onRegisterUser(userData);
      // console.log(response);
      // 6300d094b6e08c4e204166b5
      if (response.status !== 200) {
        // console.log("Error ---", response);
        eMailElement.value = "";
        eMailElement.placeholder = "This email is in use by another user";
      } else {
        const response = await this.onSignInUser(userData);
        if (response.status !== 200) {
          passElement.value = "";
          passElement.placeholder = "Wrong password or EMail";
        } else {
          localStorage.setItem("token", response.data.token);
        }
      }
    }
  };
  
  onValidateEmail: (elem: HTMLInputElement) => boolean = (elem) => {
    const isEmailValidate = EMAIL_REGEXP.test(elem.value);
    if (!isEmailValidate) {
      elem.value = "";
      elem.placeholder = "Invalid EMail";
    }
    return isEmailValidate;
  };

  onValidatePass: (elem: HTMLInputElement) => boolean = (elem) => {
    const isPassValidate = elem.value.length > 7;
    if (!isPassValidate) {
      elem.value = "";
      elem.placeholder = "Password length must be more then 7";
    }
    return isPassValidate;
  };
  
  onDataConstruct: (eMail: HTMLInputElement, pass: HTMLInputElement) => elementData = (eMail, pass) => {
    const userData: elementData = {};
    userData.email = eMail.value;
    userData.password = pass.value;
    return userData;
  };

  async onRegisterUser(userData: elementData) {
    const url = "/users";
    const method = {
      method : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData)
    };
    return await load(url, method);     
  }

  async onSignInUser(userData: elementData) {
    const url = "/signin";
    const method = {
      method : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData)
    };
    return await load(url, method);     
  }
}

