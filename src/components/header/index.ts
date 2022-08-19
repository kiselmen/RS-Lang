import { Component } from "../../utils/component";
import { Burger } from "../burger";
import { Logo } from "../logo";
import { Nav } from "../nav";
import "./styles.scss";

export class Header extends Component {
  private logo: Logo;
  private burger: Burger;
  private nav: Nav;
  
  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["header"]);
    
    this.logo = new Logo(this.element);
    this.nav = new Nav(this.element);
    this.burger = new Burger(this.element);

    this.nav.element.addEventListener("click", (e) => this.onNavClick(e));
    this.burger.element.addEventListener("click", () => this.onBurgerClick());
    this.nav.navItems.map(item => item.element.addEventListener("click", (e: Event) => this.onLinkClick(e)));
  }

  onNavClick = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target === this.nav.element) {
      this.burger.onBurgerClick();
      this.nav.onNavClose();
    }
  };

  onBurgerClick = () => {
    this.burger.onBurgerClick();
    this.nav.onNavToggle();
  };

  onLinkClick = (e: Event) => {
    this.burger.onBurgerClose();
    this.nav.onNavClose();
    const target = e.target as HTMLElement;
    console.log(target);
    
  };
}