import JSXComponent, {Config} from 'metal-jsx';
import * as D3 from 'd3';

import {readCSV} from "lib/util";

import {BottomAxis, RightAxis} from 'components/axis/Axis';

import {
  BASE_HEIGHT,
  BASE_WIDTH,
  HEIGHT,
  WIDTH
} from './config'


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
		let domain;

		const barWidth = Math.floor(WIDTH / 19) - 1;

		return (
			<div class="app-component">
				<svg
					class="graph-svg"
					height={BASE_HEIGHT} 
					width={BASE_WIDTH}
				>
					{csvLoaded && data && (
						<BottomAxis 
							d3Scale={D3.scaleLinear}
							domain={[100, 0]}
							range={[barWidth, WIDTH - barWidth]}
							ticks={20}
							tickFormat={
								domainValue => Math.round(domainValue / 5) * 5
							}
							transform={`translate(0, ${HEIGHT})`}
						/>
					) && (
						<RightAxis 
							d3Scale={D3.scaleLinear}
							domain={[
								0, 
								D3.max(data, entry => entry.people)
							]}
							range={[HEIGHT, 0]} 
							ticks={HEIGHT / 100}
							tickFormat={
								domainValue => Math.round(domainValue / 1e6) + "M"
							}
							transform={`translate(${WIDTH}, 0)`}
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