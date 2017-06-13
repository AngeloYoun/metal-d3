import JSXComponent, {Config} from 'metal-jsx';

class Model extends JSXComponent {
    render() {
        const {
            data, 
            renderer, 
            ...otherProps
        } = this.props;

        return (
            <g class="model-container" ref="data" {...otherProps}>
                {renderer(data)}
            </g>
        )
    }
}

Model.PROPS = {
    data: Config.object(),
    renderer: Config.func()
}

export default Model;