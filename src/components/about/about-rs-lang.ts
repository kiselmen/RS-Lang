import {Component} from "../../utils/component";

class AboutRsLang extends Component {
  private title;
  private dictionary;
  private audioCall;
  private sprint;
  private img1;
  private img2;
  // private img3;
  // private img4;

    constructor(parentNode: HTMLElement) {
      super(parentNode, "div", ["about-rsLang__page"]);        
        this.title = new Component(this.element, "div", ["about-RsLang-title", "aboutRsLang-section"]);
        this.img2 = new Component(this.element, "img", ["about-RsLang__image2"]);
        this.img1 = new Component(this.element, "img", ["about-RsLang__image1", "aboutRsLang-section"]);
        this.dictionary = new Component(this.element, "div", ["about-RsLan__dictionary", "aboutRsLang-section"]);
        this.audioCall = new Component(this.element, "div", ["about-RsLan__audioCall", "aboutRsLang-section"]);
        this.sprint = new Component(this.element, "div", ["about-RsLan__sprint", "aboutRsLang-section"]);
        
        
        // this.img3 = new Component(this.supportImgContainer.element, "img", ["about-RsLang__image3"]);
        // this.img4 = new Component(this.supportImgContainer.element, "img", ["about-RsLang__image4"]);
      
        this.title.element.innerHTML = `<p>RS Lang</p><p>поможет вам окунуться в удивительный мир изучения английского языка</p>`;
        this.dictionary.element.innerHTML = `<p>Dictionary</p><p>поможет увеличить ваш словарный запас, запоминая новые английские слова</p>`;      
        this.audioCall.element.innerHTML = `<p>Audio call</p><p>поможет разобраться с произношением звуков, слов и связок во фразах</p>`;      
        this.sprint.element.innerHTML = `<p>Sprint</p><p>поможет поддерживать в тонусе словарный запас, тренирует внимание</p>`;      
        this.img1.element.setAttribute("src", "./public/about-images/kliaksa.svg");
        this.img2.element.setAttribute("src", "./public/about-images/play-and-learn.png")
        // this.img3.element.setAttribute("src", "./public/about-images/kliaksa2.svg")
        // this.img4.element.setAttribute("src", "./public/about-images/kliaksa2.svg")
    }

}

export default AboutRsLang;