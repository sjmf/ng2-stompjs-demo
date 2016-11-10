/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RawDataComponent } from './components/rawdata/rawdata.component';
import { StatusComponent } from './components/status/status.component';
import { ConfigService } from './services/config/config.service';

describe('App: Ng2StompjsDemo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        RawDataComponent,
        StatusComponent
      ],
      imports: [
        HttpModule
      ],
      providers: [ConfigService]
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
