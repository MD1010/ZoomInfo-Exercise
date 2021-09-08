import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpService } from "./services/http.service";
import { UIModule } from "../ui.module";

@NgModule({
  declarations: [],
  providers: [HttpService],
  imports: [CommonModule, UIModule],
})
export class CoreModule {}
