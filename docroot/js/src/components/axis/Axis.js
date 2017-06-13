import JSXComponent, {Config} from 'metal-jsx';
import lodash from 'lodash';
import * as D3 from 'd3';

const RIGHT = 2;
const BOTTOM = 3;

class Axis extends JSXComponent {
    render() {
        const {
            elementClasses,
            d3Axis,
            scale,
            tickSize,
            ticks,
            tickFormat,
            renderer,
            ...otherProps
        } = this.props;

        return <g ref="axis" class="axis" {...otherProps} />
    }

    rendered() {
        const {
            d3Axis,
            scale,
            tickSize,
            ticks,
            tickFormat,
            renderer
        } = this.props;
        
        const axis = d3Axis(scale)
            .tickSize(tickSize)
            .ticks(ticks)
			.tickFormat(tickFormat)

        D3.select(this.refs.axis).call(axis).call(renderer)
    }
}

Axis.PROPS = {
    range: Config.array().value([]),
    domain: Config.array().value([]),
    tickSize: Config.number().value(6),
    ticks: Config.value(10),
    tickFormat: Config.func().value(f => f),
    renderer: Config.func().value(f => f),
}

export const RightAxis = class RightAxis extends JSXComponent {
    render () {
        return <Axis 
            d3Axis={D3.axisRight} 
            {...this.props}
        />
    }
}

export const BottomAxis = class BottomAxis extends JSXComponent {
    render () {
        return <Axis 
            d3Axis={D3.axisBottom} 
            {...this.props}
        />
    }
}