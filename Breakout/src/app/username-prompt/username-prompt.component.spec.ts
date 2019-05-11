import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UsernamePromptComponent} from './username-prompt.component';

describe('UsernamePromptComponent', () => {
  let component: UsernamePromptComponent;
  let fixture: ComponentFixture<UsernamePromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsernamePromptComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernamePromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
