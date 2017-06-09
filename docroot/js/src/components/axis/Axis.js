import JSXComponent, {Config} from 'metal-jsx';
import * as D3 from 'd3';

const RIGHT = 2;
const BOTTOM = 3;

class Axis extends JSXComponent {
    render() {
        const {
            d3Axis,
            d3Scale,
            domain,
            range,
            ticks,
            tickFormat,
            ...otherProps
        } = this.props;

        return <g ref="axis" class="axis" {...otherProps} />
    }

    rendered() {
        const {
            d3Axis,
            d3Scale,
            domain,
            range,
            ticks,
            tickFormat
        } = this.props;

        const scale = d3Scale().range(range).domain(domain);
        
        const axis = d3Axis(scale)
            .ticks(ticks)
			.tickFormat(tickFormat)

        axis(
            D3.select(this.refs.axis)
        );
    }
}

Axis.PROPS = {
    range: Config.array().value([]),
    domain: Config.array().value([]),
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