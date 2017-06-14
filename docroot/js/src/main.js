import JSXComponent, {Config} from 'metal-jsx';

import PopulationGraph from './demos/PopulationGraph';
import OrgChart from './demos/OrgChart';

import testData from "../../test-data/organization";

class AppComponent extends JSXComponent {
	render() {
		return (
			<div class="root">
				<PopulationGraph />

				<OrgChart data={testData} />
			</div>
		)
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