class Timer {
  timeout: number;
  parentNode: HTMLElement;
  timer: ReturnType<typeof setInterval> | undefined;

  constructor (parentNode: HTMLElement, timeout = 60) {
    this.parentNode = parentNode;
    this.timeout = timeout;
  }

  timerRun = () => {

    const startTimer = () => {
      this.parentNode.innerHTML = this.timeout.toString();
      this.timeout -= 1;

      this.timer = setTimeout(startTimer, 1000);
      if(this.timeout < 0) {
        clearTimeout(this.timer);
      }
    };
    startTimer();
  };

  timerStop() {
    clearTimeout(this.timer);
  }
}

export default Timer;

