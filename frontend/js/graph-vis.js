// ===== Vis.js Dynamic Context Graph Renderer =====

let visNetwork = null;
let graphNodesDataSet = null;
let graphEdgesDataSet = null;

document.addEventListener('DOMContentLoaded', () => {
    initDynamicVisGraph();
});

async function initDynamicVisGraph() {
    const container = document.getElementById('vis-container');
    if (!container) return;

    try {
        const response = await fetch('/api/graph');
        const data = await response.json();

        // Color mapping by node type
        const typeColors = {
            kasirnusa: { background: '#2563EB', border: '#1D4ED8', font: '#FFFFFF' },
            dm: { background: '#9333EA', border: '#7E22CE', font: '#FFFFFF' },
            prospect: { background: '#059669', border: '#047857', font: '#FFFFFF' },
            customer: { background: '#0284C7', border: '#0369A1', font: '#FFFFFF' },
            org: { background: '#F59E0B', border: '#D97706', font: '#FFFFFF' },
            contact: { background: '#64748B', border: '#475569', font: '#FFFFFF' },
            deal: { background: '#E11D48', border: '#BE123C', font: '#FFFFFF' }
        };

        const visNodes = data.nodes.map(n => {
            const colors = typeColors[n.type] || typeColors.contact;
            return {
                id: n.id,
                label: `${n.label}\n(${n.role})`,
                shape: n.type === 'dm' || n.type === 'prospect' ? 'diamond' : 'box',
                color: {
                    background: colors.background,
                    border: colors.border,
                    highlight: { background: '#3B82F6', border: '#1D4ED8' }
                },
                font: { color: colors.font, face: 'Plus Jakarta Sans', size: 11, bold: true },
                margin: 10,
                shadow: true
            };
        });

        const visEdges = data.edges.map(e => ({
            from: e.from,
            to: e.to,
            label: e.label,
            color: e.type === 'alumni' ? '#F59E0B' : e.type === 'strong' ? '#2563EB' : '#CBD5E1',
            width: e.weight ? Math.max(1, e.weight / 2) : 1,
            arrows: 'to',
            font: { face: 'Plus Jakarta Sans', size: 9, color: '#64748B' }
        }));

        graphNodesDataSet = new vis.DataSet(visNodes);
        graphEdgesDataSet = new vis.DataSet(visEdges);

        const options = {
            nodes: {
                borderWidth: 2,
                shadow: true
            },
            edges: {
                smooth: {
                    type: 'continuous'
                }
            },
            physics: {
                solver: 'forceAtlas2Based',
                forceAtlas2Based: {
                    gravitationalConstant: -40,
                    centralGravity: 0.01,
                    springLength: 90,
                    springConstant: 0.08
                },
                maxVelocity: 50,
                minVelocity: 0.1,
                stabilization: { iterations: 150 }
            },
            interaction: {
                hover: true,
                tooltipDelay: 200,
                navigationButtons: true,
                keyboard: true
            }
        };

        visNetwork = new vis.Network(container, { nodes: graphNodesDataSet, edges: graphEdgesDataSet }, options);

    } catch (err) {
        console.error("Error initializing vis graph:", err);
    }
}

window.highlightCustomNodes = function(nodeIds) {
    if (!visNetwork || !graphNodesDataSet || !nodeIds || nodeIds.length === 0) return;

    const validNodes = nodeIds.filter(id => graphNodesDataSet.get(id));
    if (validNodes.length > 0) {
        visNetwork.selectNodes(validNodes);
        visNetwork.focus(validNodes[0], {
            scale: 1.2,
            animation: { duration: 800, easingFunction: 'easeInOutQuad' }
        });
    }
};

function resetGraphView() {
    if (!visNetwork) return;
    visNetwork.unselectAll();
    visNetwork.fit({ animation: { duration: 800 } });
}
