import {Injectable,Optional} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';

declare var i18next: any;

export class I18nServiceConfig {
  use: any[];
  config: any;
}

/* see I18nDirective for more information */
@Injectable()
export class I18nService {
  i18n: any;
  private init;
  use:any[];
  config:any;

  whenReady$: Observable<boolean>;
  private whenReadyObserver: any;

  constructor() {
    this.init = false;
    this.i18n = i18next;
    this.whenReady$ = new Observable(observer => {
      this.whenReadyObserver = observer;
      if (this.use) {
        for (let i = 0; i < this.use.length; i++) {
          this.i18n.use(this.use[i]);
        }
      }
      this.i18n.init(
        this.config,
        (err, t) => {
          this.init = true;
          this.whenReadyObserver.next(true);
        });
    }).share();
  }

  t(s: string, opts: any = undefined) {
    return this.i18n.t(s, opts);
  }

  setUse(use:any[]){
      this.use = use;
      for (let i = 0; i < this.use.length; i++) {
        this.i18n.use(this.use[i]);
      }
  }

  setConfig(config:any){
      this.config = config;
      this.i18n.init(
        this.config,
        (err, t) => {
          this.init = true;
        });
  }

  tPromise(s: string, opts: any = undefined) {
    return new Promise((resolve, reject) => {
      if (this.init) {
        resolve(this.i18n.t(s, opts));
      } else {
        reject(s);
      }
    });
  }
}
