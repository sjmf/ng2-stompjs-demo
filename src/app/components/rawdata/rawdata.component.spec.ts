/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RawDataComponent } from './rawdata.component';
import { StatusComponent } from '../../components/status/status.component';
import { STOMPService } from '../../services/stomp';
import { ConfigService } from '../../services/config/config.service';

describe('RawDataComponent', () => {
  let component: RawDataComponent;
  let fixture: ComponentFixture<RawDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RawDataComponent,
        StatusComponent
      ],
      imports: [
        HttpModule
      ],
      providers: [
        STOMPService,
        ConfigService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
