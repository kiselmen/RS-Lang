import { Component } from "../../utils/component";

class AboutTeam extends Component {
  private title;
  private contentWrapper;
  private firstMemberCard;
  private secondMemberCard;
  private thirdMemberCard;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["about-team__page"]);

    this.title = new Component(this.element, "h3", ["about-team__title"], "О Нашей команде");
    this.contentWrapper = new Component(this.element, "div", ["about-team__wrapper"]);

    this.firstMemberCard = new TeamMemberCard(this.contentWrapper.element, "Василий", "kiselmen",
     ["Настройка рабочей среды", "Развертывание Back-End", "Каркас приложения", "Авторизация"]);
    this.secondMemberCard = new TeamMemberCard(this.contentWrapper.element, "Максим", "maxomeleneckii",
     ["Анализ проекта", "Каркас Dictionary", "Каркас Audio Call"]);
    this.thirdMemberCard = new TeamMemberCard(this.contentWrapper.element, "Александр", "pitbrest",
     ["Футер", "Каркас Sprint", "Страница About"]);
  }
}



class TeamMemberCard extends Component {
    private memberName;
    private ghLink;
    private roles;

    constructor(parentNode: HTMLElement, name: string, link: string, roles: string[]) {
    super(parentNode, "div", ["team-member__card"]);

    this.memberName = new Component(this.element, "div", ["member-card__name"], name);
    this.ghLink = new Component(this.element, "a", ["member-gh__link"], link);
    this.roles = new Component(this.element, "ul", ["member-roles"]);

    this.createRoles();
  }

  createRoles() {
    for(let role in this.roles) {
      const newRole = new Component(this.roles.element, "li", ["team-member-role"], role);
    }
  }
}

export {AboutTeam, TeamMemberCard};