import { Component } from "../../utils/component";

class AboutTeam extends Component {
  private title;
  private contentWrapper;
  private firstMemberCard;
  private secondMemberCard;
  private thirdMemberCard;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["about-team__page"]);

    this.title = new Component(this.element, "h3", ["about-team__title"], "About the team");
    this.contentWrapper = new Component(this.element, "div", ["about-team__wrapper"]);

    this.firstMemberCard = new TeamMemberCard(this.contentWrapper.element, "Vasiliy (Team Leader)", "https://github.com/kiselmen", "kiselmen",
      ["- Setting up the working environment", "- BackEnd deployment", "- Application framework", "- Header layout and functionality including burger menu", "- Authorization page layout and functionality", "- Dictionary functionality", "- General statistics functionality", "- Code refactoring", "- Project deployment"], "./public/about-images/kiselmen.png");
    this.secondMemberCard = new TeamMemberCard(this.contentWrapper.element, "Max", "https://github.com/maxomeleneckii", "maxomeleneckii",
      ["- Project analysis", "- Development of the project architecture", "- Dictionary layout", "- Layout of Audiocall mini-game", "- Functionality for Audiocall mini-game", "- Stylization of the project", "- Adaptive layout", "- Project presentation"], "./public/about-images/maxomeleneckii.jpg");
    this.thirdMemberCard = new TeamMemberCard(this.contentWrapper.element, "Alexander", "https://github.com/pitbrest", "pitbrest",
      ["- About layout, styling and adaptive", "- Sprint layout, styling and adaptive", "- Profile layout, styling and adaptive", "- Functionality for the Sprint mini-game", "- Implementation Profile statistics and graphs", "- Footer layout"], "./public/about-images/me.jpg");

    this.element.style.display = "none";
  }
}

class TeamMemberCard extends Component {
  private memberName;
  private ghLink;
  private roles;
  private memberPhoto;
  private rolesNames;

  constructor(parentNode: HTMLElement, name: string, link: string, linkContent: string, rolesNames: string[], img?: string) {
    super(parentNode, "div", ["team-member__card"]);

    this.memberPhoto = new Component(this.element, "img", ["member-card__img"]);
    this.memberName = new Component(this.element, "div", ["member-card__name"], name);
    this.ghLink = new Component(this.element, "a", ["member-gh__link"], linkContent);
    this.roles = new Component(this.element, "ul", ["member-roles"]);
    this.rolesNames = rolesNames;

    if(img) {
      this.memberPhoto.element.setAttribute("src", img);
    } else {
      this.memberPhoto.element.setAttribute("src", "./public/about-images/man.jpg");
    }

    this.ghLink.element.setAttribute("href", link);
    this.ghLink.element.setAttribute("target", "_blank");
    this.createRoles();
  }

  createRoles() {
    for(const role of this.rolesNames) {
      new Component(this.roles.element, "li", ["team-member-role"], role);
    }
  }
}

export {AboutTeam, TeamMemberCard};