import JSXComponent, {Config} from 'metal-jsx';
import * as D3 from 'd3';

import {BottomAxis, RightAxis} from 'components/axis/Axis';
import Interpolater from 'components/data/Interpolater';
import TreeNode from 'components/tree/TreeNode';
import Model from 'components/data/Model';

const HEIGHT = 400;
const WIDTH = 900;

const NODE_HEIGHT = 72;
const MARGIN = 24;
const NODE_WIDTH = 310;
const HORZ_MARGIN = 128;

class Chart extends JSXComponent{
    render() {
        const {chartX, chartY, chartZ, children} = this.props;
        
        return (
            <g 
                ref="tree" 
                transform={`translate(${chartX}, ${chartY}) scale(${chartZ})`}
            >
                {children}
            </g>
        )
    }
}

class OrgChart extends JSXComponent {    
    created() {
        const {
            data
        } = this.props;

        const expandedNodes = {1:true}

        this._tree = D3.tree().nodeSize([NODE_HEIGHT + MARGIN, NODE_WIDTH + HORZ_MARGIN]);

        const treeData = this._createData(expandedNodes)

        this.setState(
            {
                expandedNodes,
                treeData
            }
        )
    }

	render() {
        const {
            chartX,
            chartY,
            chartZ,
            expandedNodes,
            treeData
        } = this.state;
        
        const nodeHeightHalf = this._nodeHeight / 2;

        const textRight = (this._avatarRadius + this._nodePadding) * 2;

		return (
			<div class="org-chart-container">
				<div class="svg-wrapper">
					<svg 
                        class="org-chart" 
                        height={HEIGHT} 
                        ref="chartSVG"
                        width={WIDTH}
                    >
                        <Interpolater
                            data={{chartX, chartY, chartZ}}
                            timing={'ease-in-out'}
                            transition={300}
                        >
                           <Chart>
                                <TreeNode 
                                    onClick={this._handleOnClick} 
                                    treeNode={treeData}
                                />
                           </Chart>
                        </Interpolater>
					</svg>
				</div>

				<div class="zoom-controls">
					

					<span ref="zoomPercent">{`${(1 / chartZ) * 100}%`}</span>

					
				</div>
			</div>
		);
	}

    rendered() {
        const svg = D3.select(this.refs.chartSVG);

        const zoom = D3.zoom().scaleExtent([0.25, 2]).on(
			'zoom',
			event => {
                const {k, x, y} = D3.event.transform;

                this._currentScale = k;

                this.setState(
                    {
                        chartX: x,
                        chartY: y,
                        chartZ: k
                    }
                );
            }
		);

        svg.call(zoom);
    }

    _createData(expandedNodes) {
        const {
            data
        } = this.props;

        const root = D3.hierarchy(data.division, data => expandedNodes[data.id] ? data.childDivisions : null);

        return this._tree(root);
    }

    _handleOnClick = node => {
        const {
            chartZ,
            expandedNodes
        } = this.state; 
        
        const id = node.data.id;

        const updatedExpandedNodes = {
            ...expandedNodes,
            [id]: expandedNodes.hasOwnProperty(id) ? !expandedNodes[id] : true
        }
        
        const treeData = this._createData(updatedExpandedNodes);

        let chartX;
        let chartY;

        treeData.each(
            node => {
                if (node.data.id === id) {
                    chartX = WIDTH / 2 - node.y * chartZ;
                    chartY = HEIGHT / 2 - node.x * chartZ;
                }
            }
        )

        this.setState(
            {
                chartX,
                chartY,
                expandedNodes: updatedExpandedNodes,
                treeData
            }
        );
    }
}

OrgChart.STATE = {
    chartX: Config.number().value(MARGIN),
    chartY: Config.number().value(NODE_HEIGHT * 2),
    chartZ: Config.number().value(1),
    expandedNodes: Config.object(),
    selected: Config.string(),
    treeData: Config.object()
}

OrgChart.PROPS = {
    data: Config.object().required(),
}

OrgChart.SYNC_UPDATES = true;

export default OrgChart;