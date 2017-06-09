import JSXComponent from 'metal-jsx';

class AppComponent extends JSXComponent {
	render() {
		return (
			<div>
				{"Metal D3"}
			</div>
		);
	}
}

export const App = {
	run(initialState = {}, id) {
		this.app = new AppComponent(
			{
				initialState
			},
			document.getElementById(id)
		);
	}
};