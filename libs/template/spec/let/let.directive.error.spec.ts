import { ChangeDetectorRef, Component, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { async, TestBed } from '@angular/core/testing';
import { LetDirective } from '../../src/lib/let';
import { MockChangeDetectorRef } from '../fixtures';
import { mockConsole } from '@test-helpers';

@Component({
  template: `
    <ng-container *rxLet="value$; $error as error">{{ error }}</ng-container>
  `
})
class LetDirectiveTestErrorComponent {
  value$: Observable<number> = of(42);
}

const setupLetDirectiveTestComponentError = (): void => {
  TestBed.configureTestingModule({
    declarations: [LetDirectiveTestErrorComponent, LetDirective],
    providers: [
      { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      TemplateRef,
      ViewContainerRef
    ]
  });

  fixtureLetDirectiveTestComponent = TestBed.createComponent(
    LetDirectiveTestErrorComponent
  );
  letDirectiveTestComponent =
    fixtureLetDirectiveTestComponent.componentInstance;
  componentNativeElement = fixtureLetDirectiveTestComponent.nativeElement;
};

let fixtureLetDirectiveTestComponent: any;
let letDirectiveTestComponent: {
  strategy: any;
  value$: Observable<any> | undefined | null;
};
let componentNativeElement: any;

describe('LetDirective when error', () => {
  beforeAll(() => mockConsole());
  beforeEach(async(setupLetDirectiveTestComponentError));

  it('should render the error to false if next or complete', () => {
    letDirectiveTestComponent.value$ = of(1);
    fixtureLetDirectiveTestComponent.detectChanges();
    expect(componentNativeElement.textContent).toBe('false');
  });

  it('should render the error to true if one occurs', () => {
    letDirectiveTestComponent.value$ = throwError(new Error('error message'));
    fixtureLetDirectiveTestComponent.detectChanges();
    expect(componentNativeElement.textContent).toBe('true');
  });
});
