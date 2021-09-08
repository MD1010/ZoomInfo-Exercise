import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UIModule } from "../ui.module";
import { TimerComponent } from "./components/timer/timer.component";
import { TimePipe } from "./pipes/time.pipe";
@NgModule({
  imports: [CommonModule],
  declarations: [TimerComponent, TimePipe],
  exports: [TimerComponent, TimePipe, UIModule],
})
export class SharedModule {}
