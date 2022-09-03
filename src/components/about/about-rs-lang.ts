import {Component} from "../../utils/component";

class AboutRsLang extends Component {
  private title;
  private dictionary;
  private audioCall;
  private sprint;
  private img1;
  private img2;
  private img3;
  private img4;
  private img5;

  constructor(parentNode: HTMLElement) {
    super(parentNode, "div", ["about-rsLang__page"]);        
    this.title = new Component(this.element, "div", ["about-RsLang-title", "aboutRsLang-section"]);
    this.img1 = new Component(this.element, "img", ["about-RsLang__image2"]);
    this.img2 = new Component(this.element, "img", ["about-RsLang__image1", "aboutRsLang-section"]);
    this.dictionary = new Component(this.element, "div", ["about-RsLan__dictionary", "aboutRsLang-section"]);
    this.audioCall = new Component(this.element, "div", ["about-RsLan__audioCall", "aboutRsLang-section"]);
    this.img3 = new Component(this.element, "img", ["about-RsLang__image3", "aboutRsLang-section"]);
    this.sprint = new Component(this.element, "div", ["about-RsLan__sprint", "aboutRsLang-section"]);
    this.img4 = new Component(this.element, "img", ["about-RsLang__image4", "aboutRsLang-section"]);
    this.img5 = new Component(this.element, "img", ["about-RsLang__image5", "aboutRsLang-section"]);
    
    this.title.element.innerHTML = `<p>RS Lang</p><p>will help you dive into the wonderful world of learning English</p>`;
    this.dictionary.element.innerHTML = `<p>Dictionary</p><p>help you increase your vocabulary by memorizing new English words</p>`;      
    this.audioCall.element.innerHTML = `<p>Audio call</p><p>help with pronunciation of sounds, words, and ligatures in phrases</p>`;      
    this.sprint.element.innerHTML = `<p>Sprint</p><p>will help maintain vocabulary, train attention</p>`;      
    this.img1.element.setAttribute("src", "./public/about-images/play-and-learn.png");
    this.img2.element.setAttribute("src", "./public/about-images/vocabruary.png");
    this.img3.element.setAttribute("src", "./public/about-images/words.png");
    this.img4.element.setAttribute("src", "./public/about-images/kliaksa.svg");
    this.img5.element.setAttribute("src", "./public/about-images/kliaksa1.svg");
  }

}

export default AboutRsLang;