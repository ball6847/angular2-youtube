import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { window } from 'ng2-bootstrap/utils/facade/browser';
import { AppModule } from './app/';

if (environment.production) {
  enableProdMode();
}

window.__theme = 'bs4';

platformBrowserDynamic().bootstrapModule(AppModule);
