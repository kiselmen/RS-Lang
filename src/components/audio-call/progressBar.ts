import ProgressBar from "progressbar.js";

export const progressBarMixin = (barContainer: HTMLElement) => {
  return new ProgressBar.Circle(barContainer, {
    strokeWidth: 6,
    easing: "easeInOut",
    duration: 1400,
    color: "#494a69",
    trailColor: "#9cd2ff",
    trailWidth: 4,
    svgStyle: null,
    step: function (state, circle) {
      const value = Math.round(circle.value() * 100);
      if (value === 0) {
        document.querySelectorAll(".master-progressbar__count").forEach( el => el.innerHTML = "0%");
      } else {
        document.querySelectorAll(".master-progressbar__count").forEach( el => el.innerHTML = `${value}%`);
      }
    },
  });
};