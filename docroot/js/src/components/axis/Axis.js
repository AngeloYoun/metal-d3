import JSXComponent from 'metal-jsx';
import * as D3 from 'd3';

const RIGHT = 2;
const BOTTOM = 3;

class Axis extends JSXComponent {
    render() {
        return <g ref="axis" class="axis" />
    }

    attached() {
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
			.tickFormat(tickFormat)

        axis(
            D3.select(this.element)
        );
    }
}

export const RightAxis = class RightAxis extends JSXComponent {
    render () {
        const {
            orientation,
            ...otherProps
        } = this.props;

        return <Axis 
            d3Axis={D3.axisRight} 
            {...otherProps}
        />
    }
}

export const BottomAxis = class BottomAxis extends JSXComponent {
    render () {
        const {
            orientation,
            ...otherProps
        } = this.props;

        return <Axis 
            d3Axis={D3.axisBottom} 
            {...otherProps}
        />
    }
}