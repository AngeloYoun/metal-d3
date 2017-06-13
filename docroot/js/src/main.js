import JSXComponent, {Config} from 'metal-jsx';
import {max, min, nest, range, scaleLinear} from 'd3';

import {readCSV} from "lib/util";

import {BottomAxis, RightAxis} from 'components/axis/Axis';
import Interpolater from 'components/data/Interpolater';
import Model from 'components/data/Model';

import {
	BASE_HEIGHT,
	BASE_WIDTH,
	HEIGHT,
	WIDTH
} from './config';

class AppComponent extends JSXComponent {
	created() {
		readCSV('/test-data/population.csv').then(
			data => {
				const mappedData = data.map(
					({age, people, sex, year}) => (
						{
							age: +age,
							people: +people,
							sex,
							year: +year
						}
					)
				)

				const maxAge = max(mappedData, function(d) { return d.age; });
				const minYear = min(mappedData, function(d) { return d.year; });
				const maxYear = max(mappedData, function(d) { return d.year; });

				this.setState(
					{
						csvLoaded: true,
						currentYear: maxYear,
						data: mappedData,
						maxAge,
						maxYear,
						minYear,
						nestedData: nest()
							.key(data => data.year)
							.key(data => data.year - data.age)
							.rollup(value => value.map(data => data.people))
							.object(mappedData)
					}
				);
			}
		);
	}

	render() {
		const {
			data,
			csvLoaded,
			nestedData,
			currentYear,
			prevYear,
			maxAge,
			maxYear,
			minYear
		} = this.state;

		const barWidth = Math.floor(WIDTH / 19) - 1;

		let component;

		if (data) {
			const xScale = scaleLinear().range([barWidth / 2, WIDTH - barWidth / 2]).domain([maxYear - maxAge, maxYear]);
			const yScale = scaleLinear().range([HEIGHT, 0]).domain([0, max(data, entry => entry.people)]);

			const prefilledData = range(minYear - maxAge, maxYear + 1, 5).reduce(
				(accum, f) => (
					{
						[f]: [0,0], 
						...accum
					}
				),
				{}
			);
			 
			const currentBirthYears = {
				...prefilledData,
				...nestedData[currentYear]
			};

			component = (
				<div 
					class="app-component"
				>
					<svg
						class="graph-svg"
						height={BASE_HEIGHT} 
						width={BASE_WIDTH} 
					>	
						<g transform="translate(20, 20)">
							<Interpolater
								data={{currentBirthYears, currentYear}}
								transition={200}
							>
								<Model
									renderer={({currentBirthYears, currentYear}) => (
										<g class="birthyears" transform={`translate(${(xScale(maxYear) - xScale(currentYear))}, 0)`}>
											{range(minYear - maxAge, maxYear + 1, 5).map(
												birthyear => (
													<g 
														class="birthyear" 
														transform={`translate(${xScale(birthyear)}, 0)`}
													>
														{(birthyear in currentBirthYears ? currentBirthYears[birthyear] : []).map(
															(amount, index) => (
																<rect 
																	class={index ? 'female' : 'male'}  
																	x={-barWidth / 2}
																	width={barWidth}
																	y={yScale(amount)}
																	height={HEIGHT - yScale(amount)}
																/>
															)
														)}

														<text y={HEIGHT-4}>{birthyear}</text>
													</g>
												)
											)}
										</g>
									)}
								/>
							</Interpolater>

							<text 
								class="title" 
								dy=".71"
								transform="translate(0, 70)"
							>
								{currentYear}
							</text>
							
							<BottomAxis 
								scale={scaleLinear().range([barWidth / 2, WIDTH - barWidth / 2]).domain([90, 0])}
								ticks={BASE_WIDTH / barWidth}
								tickFormat={
									domainValue => Math.round(domainValue / 5) * 5
								}
								transform={`translate(0, ${HEIGHT})`}
							/>

							<RightAxis 
								elementClasses="y axis"
								renderer={element => {
									element.selectAll("g")
										.filter(value => !value)
										.classed("zero", true);
								}}
								scale={yScale}
								tickSize={-WIDTH}
								tickFormat={
									domainValue => Math.round(domainValue / 1e6) + "M"
								}
								transform={`translate(${WIDTH}, 0)`}
							/>
						</g>
					</svg>
				</div>
			);
		}

		return component;
	}

	rendered(first) {
		document.addEventListener('keydown', this._handleKeydown)
	}

	_handleKeydown = event => {
		const keyCode = event.keyCode;

		if (keyCode === 37) {
			this._update(this.state.currentYear + 10);
		}
		else if (keyCode === 39) {
			this._update(this.state.currentYear - 10);
		}
	}

	_update(year) {
		const {
			maxYear,
			minYear,
			nestedData
		} = this.state;
		
		if (year <= maxYear && year >= minYear) {
			this.setState(
				{
					currentYear: year,
					prevYear: this.state.currentYear
				}
			);
		}
	}
}

AppComponent.STATE = {
	data: Config.array(),
	currentYear: Config.number(),
	prevYear: Config.number(),
	nestedData: Config.object(),
	csvLoaded: Config.bool().value(false),
	maxAge: Config.number(),
	maxYear: Config.number(),
	minYear: Config.number()
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