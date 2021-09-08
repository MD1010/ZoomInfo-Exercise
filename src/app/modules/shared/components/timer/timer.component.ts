import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { EMPTY, Observable, of, Subject, timer } from "rxjs";
import { finalize, repeat, repeatWhen, scan, startWith, switchMap, takeWhile, tap } from "rxjs/operators";

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.scss"],
})
export class TimerComponent implements OnInit {
  constructor() {}

  @Output() timeExpired = new EventEmitter();
  @Input() timerSeconds: number;
  timer$: Observable<number> = new Observable<number>();
  countdown$: Observable<number> = new Observable<number>();

  ngOnInit(): void {
    this.timer$ = timer(1000, 1000).pipe(
      startWith(this.timerSeconds),
      scan((acc) => --acc, this.timerSeconds + 1),
      finalize(() => this.timeExpired.emit()),
      takeWhile((x) => x >= 0)
    );
    this.countdown$ = this.timeExpired.pipe(
      startWith(EMPTY),
      switchMap(() => this.timer$)
    );
  }
}
