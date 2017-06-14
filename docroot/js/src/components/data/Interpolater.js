import JSXComponent, {Config} from 'metal-jsx';
import {omit} from 'lodash';
import {interpolate, timer} from 'd3';

const timingFnMap = {
    'ease-in-out': easeInOut
}

export function easeInOut(t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
}

class Interpolater extends JSXComponent {
    render() {
        const {
            children: [wrappedComponent],
            data, 
            renderer, 
            ...otherProps
        } = this.props;

        const {
            currentTween
        } = this.state;
        
        const WrappedComponent = wrappedComponent.tag;
        const mergedData = {...data, ...currentTween}

        return (
            <WrappedComponent 
                {...mergedData}
                {...wrappedComponent.props}
            >
                {wrappedComponent.props.children}
            </WrappedComponent>
        )
    }

    syncData(newProp = {}, oldProp = {}) {
        const {
            interpolate,
            normalizeInterpolation,
            transition,
            timing
        } = this.props;

        const interpolater = interpolate(oldProp, newProp)

        const timerHandler = timer(
            elapsed => {
                let currentTween = newProp;

                if (elapsed > transition) {
                    timerHandler.stop();
                }
                else {
                    const timingFn = (typeof timing === 'string') ? timingFnMap[timing] : timing;

                    currentTween = normalizeInterpolation(
                        interpolater(
                            timingFn(elapsed, 0, transition, transition) / transition
                        )
                    );
                }

                this.setState(
                    {
                        currentTween
                    }
                )
            }
        )
    }
}

Interpolater.PROPS = {
    data: Config.object(),
    normalizeInterpolation: Config.func().value(f => f),
    interpolate: Config.func().value(interpolate),
    timing: Config.value(f => f)
}

Interpolater.STATE = {
    currentTween: Config.value(null),
    interpolater: Config.func()
}

Interpolater.SYNC_UPDATES = true;

export default Interpolater;