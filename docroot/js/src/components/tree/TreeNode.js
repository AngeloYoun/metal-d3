const AVATAR_RADIUS = 24;

const NODE_PADDING = 12;
const NODE_HEIGHT = 72;
const NODE_WIDTH = 310;

function TreeNode({treeNode, onClick}) {
    const nodeHeightHalf = NODE_HEIGHT / 2;

    return (
        <g class="tree-node-container">
            <g 
                class="node" 
                onClick={() => onClick(treeNode)}
                transform={`translate(${treeNode.y}, ${treeNode.x})`} 
            >
                <rect 
                    class="node-container"
                    height={NODE_HEIGHT} 
                    rx={nodeHeightHalf}
                    ry={nodeHeightHalf}
                    width={NODE_WIDTH}
                    y={-nodeHeightHalf}
                />

                <text 
                    class="name"
                    x={AVATAR_RADIUS + NODE_PADDING}
                    y={5}
                >
                    {treeNode.data.name}
                </text>
            </g>

            {treeNode.children && treeNode.children.map(
                childNode => {
                    const {parent, x, y} = childNode;                                                

                    const parentY = parent.y + NODE_WIDTH;

                    return [
                        <path 
                            class="link"
                            d={`M ${parentY} ${parent.x} C ${(parentY + y) / 2}, ${parent.x} ${(parentY + y) / 2}, ${x} ${y}, ${x}`} 
                        />,
                        <TreeNode 
                            onClick={onClick} 
                            treeNode={childNode} 
                        />
                    ];
                }
            )}
        </g>
    )
}

export default TreeNode