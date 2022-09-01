import { Component } from "../utils/component";
import { LoginForm } from "../components/forms/login";
import { elementData, statisticsData } from "../interfaces";
import { registerUser, signInUser, getUserStatistics, createUserStatistics } from "../utils/loader";

const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

export class Login extends Component{
  loginForm : LoginForm;
  onUpdateRouter: () => void;

  constructor(parentNode: HTMLElement, updateRouter: () => void) {
    super(parentNode, "div", ["container", "container-login"], "");
    this.onUpdateRouter = () => updateRouter();

    this.loginForm = new LoginForm(this.element);

    this.loginForm.buttonLogin.onClickButton = async (e: Event) => this.onLogin(e);
    this.loginForm.buttonRegister.onClickButton = async (e: Event) => this.onRegister(e);
  }

  onLogin = async (e: Event) => {
    e.preventDefault();
    const eMailElement = this.loginForm.eMailInput.element as HTMLInputElement;
    const passElement = this.loginForm.passInput.element as HTMLInputElement;
    const message = this.loginForm.message.element as HTMLElement;

    const isValidate = this.onValidateEmail(eMailElement) && this.onValidatePass(passElement);

    if (isValidate) {
      const userData = this.onDataConstruct(eMailElement, passElement);
      const response = await signInUser(userData);
      if (response.status !== 200) {
        message.textContent = "Wrong password or EMail";
      } else {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("userId", response.data.userId);
        
        message.textContent = "";
  
        const responseStatistics = await getUserStatistics(response.data.userId);
        this.setUserStatistics(responseStatistics.data);
        
        window.location.hash = "#/profile";
        this.onUpdateRouter();
      }
    }  
  };

  onRegister = async (e: Event) => {
    e.preventDefault();
    const eMailElement = this.loginForm.eMailInput.element as HTMLInputElement;
    const passElement = this.loginForm.passInput.element as HTMLInputElement;
    const message = this.loginForm.message.element as HTMLElement;

    const isValidate = this.onValidateEmail(eMailElement) && this.onValidatePass(passElement);
    if (isValidate) {
      const userData = this.onDataConstruct(eMailElement, passElement);
      
      const response = await registerUser(userData);
      const optional = {page : "0", chapter : "0", audiocall : JSON.stringify({}), sprint : JSON.stringify({}), words : JSON.stringify({})} as elementData;
      const statistics = {learnedWords : "0", optional : optional} as statisticsData;
      const responseStatistics = await createUserStatistics(statistics);
      this.setUserStatistics(responseStatistics.data);

      if (response.status !== 200) {
        message.textContent = "This email is in use by another user";
      } else {
        const responseSign = await signInUser(userData);
        if (responseSign.status !== 200) {
          message.textContent = "Wrong password or EMail";
        } else {
          localStorage.setItem("token", responseSign.data.token);
          localStorage.setItem("refreshToken", responseSign.data.refreshToken);
          localStorage.setItem("userId", responseSign.data.userId);
  
          window.location.hash = "#/profile";
          this.onUpdateRouter();
        }
      }
    }
  };
  
  setUserStatistics(statistics: statisticsData) {
    statistics.optional.page ? localStorage.setItem("page", statistics.optional.page) : localStorage.setItem("page", "0");
    statistics.optional.chapter ? localStorage.setItem("chapter", statistics.optional.chapter) : localStorage.setItem("chapter", "0");
    statistics.optional.audiocall ? localStorage.setItem("audiocall", statistics.optional.audiocall) : localStorage.setItem("audiocall", JSON.stringify({}));
    statistics.optional.sprint ? localStorage.setItem("sprint", statistics.optional.sprint) : localStorage.setItem("sprint", JSON.stringify({}));
    statistics.optional.sprint ? localStorage.setItem("words", statistics.optional.sprint) : localStorage.setItem("words", JSON.stringify({}));
  }

  onValidateEmail: (elem: HTMLInputElement) => boolean = (elem) => {
    const isEmailValidate = EMAIL_REGEXP.test(elem.value);
    if (!isEmailValidate) {
      this.loginForm.message.element.textContent = "Invalid EMail";
    }
    return isEmailValidate;
  };

  onValidatePass: (elem: HTMLInputElement) => boolean = (elem) => {
    const isPassValidate = elem.value.length > 7;
    if (!isPassValidate) {
      this.loginForm.message.element.textContent = "Password length must be more then 7";
    }
    return isPassValidate;
  };
  
  onDataConstruct: (eMail: HTMLInputElement, pass: HTMLInputElement) => elementData = (eMail, pass) => {
    const userData: elementData = {};
    userData.email = eMail.value;
    userData.password = pass.value;
    return userData;
  };
}
