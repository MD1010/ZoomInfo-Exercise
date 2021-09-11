import { NgModule } from "@angular/core";
import { CarouselModule } from "primeng/carousel";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
@NgModule({
  declarations: [],
  exports: [CarouselModule, ButtonModule, RippleModule],
})
export class UIModule {}
