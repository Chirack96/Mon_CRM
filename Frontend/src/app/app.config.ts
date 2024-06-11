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

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      FormsModule,
      BrowserAnimationsModule,
      DragDropModule,
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right', // vous pouvez modifier la position ici
        timeOut: 5000, // durée d'affichage de la notification
        closeButton: true,
        progressBar: true,
      })
    ),
    provideAnimations(),
    provideHttpClient()
  ]
};
