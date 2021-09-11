import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { EMPTY, Observable, Subject, timer } from "rxjs";
import { finalize, scan, startWith, switchMap, takeUntil, takeWhile, tap } from "rxjs/operators";

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit {
  constructor() {}

  @Output() timeExpired = new EventEmitter();
  @Input() timerSeconds: number;
  timer$: Observable<number> = new Observable<number>();

  timerControl$ = new Subject<number>();
  stopTimer$ = new Subject<void>();

  ngOnInit(): void {
    this.timer$ = this.timerControl$.pipe(
      startWith(EMPTY),
      switchMap(() =>
        timer(0, 1000).pipe(
          scan((acc) => --acc, this.timerSeconds + 1),
          tap((sec) => sec < 0 && this.timeExpired.emit()),
          takeWhile((x) => x >= 0)
        )
      ),
      takeUntil(this.stopTimer$)
    );
  }
}
