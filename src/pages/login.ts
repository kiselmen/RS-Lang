import { Component } from "../utils/component";
import { LoginForm } from "../components/forms/login";
// import { load } from "../utils/loader";
import { elementData } from "../interfaces";
import { registerUser, signInUser } from "../utils/loader";

const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

export class Login extends Component{
  loginForm : LoginForm;
  onUpdateRouter: () => void;

  constructor(parentNode: HTMLElement, updateRouter: () => void) {
    super(parentNode, "div", ["container"], "");
    this.onUpdateRouter = () => updateRouter();

    this.loginForm = new LoginForm(this.element);

    this.loginForm.buttonLogin.onClickButton = async (e: Event) => this.onLogin(e);
    this.loginForm.buttonRegister.onClickButton = async (e: Event) => this.onRegister(e);
  }

  onLogin = async (e: Event) => {
    e.preventDefault();
    const eMailElement = this.loginForm.eMailInput.element as HTMLInputElement;
    const passElement = this.loginForm.passInput.element as HTMLInputElement;

    const isValidate = this.onValidateEmail(eMailElement) && this.onValidatePass(passElement);

    if (isValidate) {
      const userData = this.onDataConstruct(eMailElement, passElement);
      const response = await signInUser(userData);
      if (response.status !== 200) {
        passElement.value = "";
        passElement.placeholder = "Wrong password or EMail";
      } else {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("userId", response.data.userId);
        window.location.hash = "#/profile";
        this.onUpdateRouter();
      }
    }  
  };

  onRegister = async (e: Event) => {
    e.preventDefault();
    const eMailElement = this.loginForm.eMailInput.element as HTMLInputElement;
    const passElement = this.loginForm.passInput.element as HTMLInputElement;

    const isValidate = this.onValidateEmail(eMailElement) && this.onValidatePass(passElement);
    if (isValidate) {
      const userData = this.onDataConstruct(eMailElement, passElement);
      
      const response = await registerUser(userData);
      if (response.status !== 200) {
        eMailElement.value = "";
        eMailElement.placeholder = "This email is in use by another user";
      } else {
        const responseSign = await signInUser(userData);
        if (responseSign.status !== 200) {
          passElement.value = "";
          passElement.placeholder = "Wrong password or EMail";
        } else {
          localStorage.setItem("token", responseSign.data.token);
          localStorage.setItem("refreshToken", responseSign.data.refreshToken);
          localStorage.setItem("userId", responseSign.data.userId);
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

  // async onRegisterUser(userData: elementData) {
  //   const url = "users";
  //   const method = {
  //     method : "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(userData)
  //   };
  //   return await load(url, method);     
  // }

  // async onSignInUser(userData: elementData) {
  //   const url = "signin";
  //   const method = {
  //     method : "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(userData)
  //   };
  //   return await load(url, method);     
  // }
}
