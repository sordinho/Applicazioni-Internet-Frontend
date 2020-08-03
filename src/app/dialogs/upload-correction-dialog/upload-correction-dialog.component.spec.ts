import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCorrectionDialogComponent } from './upload-correction-dialog.component';

describe('UploadCorrectionDialogComponent', () => {
  let component: UploadCorrectionDialogComponent;
  let fixture: ComponentFixture<UploadCorrectionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadCorrectionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCorrectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
