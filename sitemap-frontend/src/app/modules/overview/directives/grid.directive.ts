import {
  Directive,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnInit,
  Input,
  EventEmitter,
} from '@angular/core';
import {
  OverviewChartComponent,
  TopPerformingPagesComponent,
  EarningChartComponent,
} from '../components';

const COMPONENTS = new Map()
  .set('overview-chart', OverviewChartComponent)
  .set('top-performance', TopPerformingPagesComponent)
  .set('revenue', EarningChartComponent);

@Directive({
  selector: '[gridItem]',
})
export class GridItemDirective implements OnInit {
  @Input() name: string;
  @Input() onResize: EventEmitter<any>;
  constructor(
    public viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<
      any
    >(COMPONENTS.get(this.name));

    this.viewContainerRef.clear();

    const componentRef = this.viewContainerRef.createComponent(
      componentFactory
    );
    componentRef.instance.onResize = this.onResize;
  }
}
