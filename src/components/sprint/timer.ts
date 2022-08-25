class Timer {
  timeout: number;
  parentNode: HTMLElement;
  timer: ReturnType<typeof setInterval> | undefined; 

  constructor (parentNode: HTMLElement, timeout = 60) {
    this.parentNode = parentNode;
    this.timeout = timeout;
  }

  timerRun() {
    const myThis = this;    

    function startTimer(): void {
      myThis.parentNode.innerHTML = myThis.timeout.toString();
      myThis.timeout -= 1;

      myThis.timer = setTimeout(startTimer, 1000);
      if(myThis.timeout < 0) {
        clearTimeout(myThis.timer);
      }
    }
    startTimer();
  }

  timerStop() {
    clearTimeout(this.timer)
  }
}


export default Timer;

