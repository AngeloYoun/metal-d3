import JSXComponent, {Config} from 'metal-jsx';
import {interpolate, timer} from 'd3';

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

        return (
            <WrappedComponent 
                data={{...data, ...currentTween}}
                {...wrappedComponent.props}
            />
        )
    }

    syncData(newProp, oldProp) {
        const {
            transition
        } = this.props;

        const interpolater = interpolate(oldProp, newProp)

        const timerHandler = timer(
            elapsed => {
                let currentTween = newProp;

                if (elapsed > transition) {
                    timerHandler.stop();
                }
                else {
                     currentTween = interpolater(elapsed / transition)
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
    interpolate: Config.func()
}

Interpolater.STATE = {
    currentTween: Config.object(),
    interpolater: Config.func()
}

Interpolater.SYNC_UPDATES = true;

export default Interpolater;