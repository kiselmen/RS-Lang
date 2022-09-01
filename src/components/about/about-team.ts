import { Component } from "../../utils/component";

class AboutTeam extends Component {
  private title;
  private contentWrapper;
  private firstMemberCard;
  private secondMemberCard;
  private thirdMemberCard;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["about-team__page"]);

    this.title = new Component(this.element, "h3", ["about-team__title"], "О команде");
    this.contentWrapper = new Component(this.element, "div", ["about-team__wrapper"]);

    this.firstMemberCard = new TeamMemberCard(this.contentWrapper.element, "Василий", "https://github.com/kiselmen", "kiselmen",
      ["Настройка рабочей среды", "Развертывание Back-End", "Каркас приложения", "Авторизация"], "../../../public/about-images/kiselmen.png");
    this.secondMemberCard = new TeamMemberCard(this.contentWrapper.element, "Максим", "https://github.com/maxomeleneckii", "maxomeleneckii",
      ["Анализ проекта", "Каркас Dictionary", "Каркас Audio Call"], "../../../public/about-images/maxomeleneckii.jpg");
    this.thirdMemberCard = new TeamMemberCard(this.contentWrapper.element, "Александр", "https://github.com/pitbrest", "pitbrest",
      ["Футер", "Каркас Sprint", "Страница About"], "../../../public/about-images/pitbrest.jpg");

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