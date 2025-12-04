import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { AppRoutingModule } from './app-routing.module';
import { provideTranslateService, TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHttpClient } from '@angular/common/http';
import { LAMBDA_FUNCTION_NAME, LAMBDA_REGION } from '../tokens';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    AmplifyAuthenticatorModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: provideTranslateHttpLoader({prefix:"./i18n/", suffix:".json"}),
    })
  ],
  providers: [
    { provide: LAMBDA_REGION, useValue: 'eu-west-3' },
    { provide: LAMBDA_FUNCTION_NAME, useValue: 'invite-user' },
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'en',
      lang: 'en'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export { LAMBDA_REGION, LAMBDA_FUNCTION_NAME };

