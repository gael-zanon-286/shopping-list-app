import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { AppRoutingModule } from './app-routing.module';

/* const I18NSERVICE_MODULES = [
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: createTranslateLoader,
      deps: [HttpClient],
    },
  }),
]; */

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, IonicModule.forRoot(), AmplifyAuthenticatorModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
