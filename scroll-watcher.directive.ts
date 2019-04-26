import { Directive, ElementRef, HostListener, Output, EventEmitter, Input } from "@angular/core";

export interface IAxysScrollState {
    position: number;
    size: number;
    edge: number;
    direction: "horizontal" | "vertical";
    isOnEnd: boolean;
    isOnStart: boolean;
    changedSize: number;
    changeProportion: number;
    positionProportion: number;
};

export interface IPadding{
    top: number;
    left: number;
    right: number;
    bottom: number;
}

export interface IAxysScrollOptions{
    direction?: "horizontal" | "vertical";
    margins?: number | IPadding;
}



export interface IEventOnChangeScroll{
    el: ElementRef;
    vState: IAxysScrollState;
    hState: IAxysScrollState;
}


function getAxysState(el: ElementRef, argOptions?: "horizontal" | "vertical" | IAxysScrollOptions, lastState?: IAxysScrollState): IAxysScrollState{

    let opt: IAxysScrollOptions = {};
    
    if(typeof (argOptions || "vertical") == "string"){
        const direction = argOptions== "vertical"? "vertical" : "horizontal";
        opt = {
            direction: direction,
            margins: {top:0, left: 0, right: 0, bottom: 0}
        }
    }else{
        opt = <IAxysScrollOptions> argOptions;
    }

    const container = el.nativeElement;

    const position = (opt.direction == "vertical" ? container.scrollTop : container.scrollLeft);
    const size = (opt.direction == "vertical" ? container.clientHeight : container.clientWidth);
    const edge = (opt.direction == "vertical" ? container.scrollHeight - container.clientHeight : container.scrollWidth - container.clientWidth);
    const isOnEnd = position == edge;
    const isOnStart = position == 0;
    const changedSize = (lastState ? position - lastState.position : 0 );
    const changeProportion = (lastState ? (changedSize * 100) / edge : 0 );
    const positionProportion = (position * 100) / (edge);
    

    const result: IAxysScrollState = {
        direction: opt.direction,
        position, size, edge,
        isOnEnd, isOnStart,

        changedSize,
        changeProportion,
        positionProportion
    };

    return result;
}

@Directive({
    selector: '[scrollWatcher]',
})
export class ScrollWatcherDirective {
    
    vStateLast: IAxysScrollState;
    hStateLast: IAxysScrollState;

    constructor(private el: ElementRef) { }
    @Input() scrollWatcher: 'both' | 'horizontal' | 'vertical';
    @Output() onScrollChange: EventEmitter<IEventOnChangeScroll> = new EventEmitter<IEventOnChangeScroll>();
    


    @HostListener('scroll', ['$event'])
    elScroll(event) { 
        const container = this.el.nativeElement;
        let vState: IAxysScrollState;
        let hState: IAxysScrollState;

        if(this.scrollWatcher == "both" || this.scrollWatcher == "vertical"){
            vState = getAxysState(this.el, "vertical", this.vStateLast);
        }
        if(this.scrollWatcher == "both" || this.scrollWatcher == "horizontal"){
            hState = getAxysState(this.el, "horizontal", this.vStateLast);
        }

        this.onScrollChange.emit({el: this.el, vState: vState, hState: hState})

        this.vStateLast = vState;
        this.hStateLast = hState;        
    }

}
