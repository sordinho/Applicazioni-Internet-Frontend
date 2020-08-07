import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeContComponent } from './home-cont.component';

describe('HomeContComponent', () => {
  let component: HomeContComponent;
  let fixture: ComponentFixture<HomeContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
