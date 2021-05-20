import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphAlgosComponent } from './graph-algos.component';

describe('GraphAlgosComponent', () => {
  let component: GraphAlgosComponent;
  let fixture: ComponentFixture<GraphAlgosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphAlgosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphAlgosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
