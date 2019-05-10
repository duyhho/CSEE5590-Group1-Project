import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRendererComponent } from './game-renderer.component';

describe('GameRendererComponent', () => {
  let component: GameRendererComponent;
  let fixture: ComponentFixture<GameRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
