import { Component } from "../../utils/component";
import "./styles.scss";

export class Footer extends Component {
  private footerLeftSideContainer;
  private schoolLink;
  private schoolLinkImg;
  private yearOfProductionContainer;
  private footerRightSideContainer;
  private firstTeamMemberLink;
  private secondTeamMemberLink;
  private thirdTeamMemberLink;


  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["footer"]);

    this.footerLeftSideContainer = new Component(this.element, "div", ["footer__item", "footer-left"]);
    this.schoolLink = new Component(this.footerLeftSideContainer.element, "a", ["school-link"]);
    this.schoolLinkImg = new Component(this.schoolLink.element, "img", ["rs-link__logo"]);
    this.yearOfProductionContainer = new Component(this.footerLeftSideContainer.element, "div", ["production-year"], "2022");
    this.footerRightSideContainer = new Component(this.element, "div", ["footer__item", "footer-right"]);
    this.firstTeamMemberLink = new Component(this.footerRightSideContainer.element, "a", ["firstTeamMemberLink"], "Vasili Kisialevich");
    this.secondTeamMemberLink = new Component(this.footerRightSideContainer.element, "a", [ "secondTeamMemberLink"], "maxomeleneckii");
    this.thirdTeamMemberLink = new Component(this.footerRightSideContainer.element, "a", ["thirdTeamMemberLink"], "pitbrest");

    this.schoolLink.element.setAttribute("href", "https://rs.school/");
    this.schoolLinkImg.element.setAttribute("src", "./public/rs-logo.svg");
    this.firstTeamMemberLink.element.setAttribute("href", "https://github.com/kiselmen");
    this.secondTeamMemberLink.element.setAttribute("href", "https://github.com/maxomeleneckii");
    this.thirdTeamMemberLink.element.setAttribute("href", "https://github.com/pitbrest");
  }
}
