import JSXComponent from 'metal-jsx';

class SVG extends JSXComponent {
    render() {
        const {
            children,
            ...otherProps
        } = this.props;

        return (
            <svg {...otherProps}>
                {children}
            </svg>
        )
    }
}

export default SVG;