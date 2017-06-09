import JSXComponent, {Config} from 'metal-jsx';
import * as D3 from 'd3';

import {readCSV} from "lib/util";

import {BottomAxis, RightAxis} from 'components/axis/Axis';

const BASE_HEIGHT = 500;

const BASE_WIDTH = 960;

const margin = {
	bottom: 30, 
	left: 20,
	right: 40, 
	top: 20
}

const WIDTH = BASE_WIDTH - margin.left - margin.right;

const HEIGHT = BASE_HEIGHT - margin.top - margin.bottom;

class AppComponent extends JSXComponent {
	created() {
		readCSV('/test-data/population.csv').then(
			data => {
				this.setState(
					{
						csvLoaded: true,
						data: data.map(
							({age, people, sex, year}) => (
								{
									age: +age,
									people: +people,
									sex,
									year: +year
								}
							)
						)
					}
				);
			}
		);
	}

	render() {
		const {
			data,
			csvLoaded
		} = this.state;

		return (
			<div class="app-component">
				<svg
					class="graph-svg"
					height={BASE_HEIGHT} 
					width={BASE_WIDTH}
				>
					{csvLoaded && data && (
						<RightAxis 
							d3Scale={D3.scaleLinear}
							domain={[
								0, 
								D3.max(data, entry => entry.people)
							]}
							range={[HEIGHT, 0]} 
							ticks={-WIDTH}
							tickFormat={
								domainValue => Math.round(domainValue / 1e6) + "M"
							}
						/>
					)}
				</svg>
			</div>
		);
	}
}

AppComponent.STATE = {
	data: Config.array(),
	csvLoaded: Config.bool().value(false)
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