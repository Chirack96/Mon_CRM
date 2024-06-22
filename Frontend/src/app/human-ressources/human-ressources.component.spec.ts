import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanRessourcesComponent } from './human-ressources.component';

describe('HumanRessourcesComponent', () => {
  let component: HumanRessourcesComponent;
  let fixture: ComponentFixture<HumanRessourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanRessourcesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanRessourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
