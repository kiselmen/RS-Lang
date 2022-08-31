class Timer {
  timeout: number;
  parentNode: HTMLElement;
  timer: ReturnType<typeof setInterval> | undefined;
  specialFunc: () => void = () => console.log("to do something");

  constructor (parentNode: HTMLElement, timeout = 60) {
    this.parentNode = parentNode;
    this.timeout = timeout;
  }

  timerRun = () => {

    const startTimer = () => {
      (  this.parentNode as HTMLInputElement).innerText = this.timeout.toString();
      this.timeout -= 1;

      this.timer = setTimeout(startTimer, 1000);
      if(this.timeout < 0) {
        this.timerStop();
        this.specialFunc();
      }
    };
    startTimer();
  };

  timerStop() {
    clearTimeout(this.timer);
  }
}

export default Timer;

