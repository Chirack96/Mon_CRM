import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastrModule } from 'ngx-toastr';
import { CalendarModule, CalendarDateFormatter, DateAdapter as AngularCalendarDateAdapter } from 'angular-calendar';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {routes} from "./app.routes";

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: AngularCalendarDateAdapter, useFactory: adapterFactory },
    CalendarDateFormatter,
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      FormsModule,
      BrowserAnimationsModule,
      DragDropModule,
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
        timeOut: 5000,
        closeButton: true,
        progressBar: true,
      }),
      MatDatepickerModule,
      MatNativeDateModule,
      CalendarModule.forRoot({ provide: AngularCalendarDateAdapter, useFactory: adapterFactory })
    ),
    provideAnimations(),
    provideHttpClient()
  ]
};
