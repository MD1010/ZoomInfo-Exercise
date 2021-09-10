import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { EMPTY, Observable, of, race, Subject, timer } from "rxjs";
import { finalize, repeat, repeatWhen, scan, startWith, switchMap, takeUntil, takeWhile, tap } from "rxjs/operators";

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.scss"],
})
export class TimerComponent implements OnInit {
  constructor() {}

  @Output() timeExpired = new EventEmitter();
  // @Output() timerStarted = new EventEmitter();
  @Input() timerSeconds: number;
  timer$: Observable<number> = new Observable<number>();
  @Input() shouldStop: boolean;
  countdown$: Observable<number> = new Observable<number>();
  restartTimer$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.timer$ = timer(1000, 1000).pipe(
      startWith(this.timerSeconds),
      scan((acc) => --acc, this.timerSeconds + 1),
      // this is called when the timer is restarted

      finalize(() => {
        console.log("!@#!@#!@#!@#");
        this.timeExpired.emit();
      }),
      takeWhile((x) => x >= 0)
    );
    this.countdown$ = race(this.timeExpired, this.restartTimer$).pipe(
      startWith(EMPTY),
      takeWhile(() => !this.shouldStop),
      switchMap(() => this.timer$)
    );
  }
}
