# ngx-scroll-watcher-directive

## Usage

### Importing in module

```ts
...
import { ScrollWatcherDirective } from './scroll-watcher.directive';

@NgModule({
    declarations: [..., ScrollWatcherDirective],
    exports: [..., ScrollWatcherDirective],
    ...
})
export class AppModule { 
  ...
}
```

### Template
```html

...
<div class="container" [scrollWatcher]="both" (onScrollChange)="onMyScrollHandler($event)">
  ... scroll things
</div>
...

```

### Component Handling
```ts
...
import { IAxysScrollState, IEventOnChangeScroll } from 'scroll-watcher.directive';


export class AppComponent {
...

    async onMyScrollHandler(ev: IEventOnChangeScroll){
        this.vState = ev.vState;
        if(this.vState.positionProportion >= 40 && this.vState.changeProportion > 0){
            await this.fetchMore(this.take);
        }
        this.vStateLast = {...this.vState};

        return;
    }

...

}

```

