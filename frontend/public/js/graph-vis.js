// ===== Vis.js Dynamic Context Graph Renderer (Anti-Collision & High Readability) =====

let visNetwork = null;
let graphNodesDataSet = null;
let graphEdgesDataSet = null;
let currentGraphFilter = 'ALL';

function formatEdgeLabel(label, type, weight) {
    if (!label) return '';
    if (label.includes('Alumni')) {
        const score = weight ? ` • ${weight}` : '';
        if (label.includes('Sentosa')) return `Alumni Sentosa${score}`;
        return `Alumni${score}`;
    }
    if (label.includes('KOMUNIKASI')) {
        const countMatch = label.match(/\((\d+x)\)/);
        const count = countMatch ? countMatch[1] : '';
        const score = weight ? ` • ${weight}` : '';
        return `Communication ${count}${score}`.trim();
    }
    if (label.includes('BEKERJA_DI')) {
        const roleMatch = label.match(/\((.*?)\)/);
        return roleMatch ? roleMatch[1] : 'Works At';
    }
    if (label.includes('ACCOUNT_MANAGER')) {
        return 'Account Manager';
    }
    return label.length > 22 ? label.slice(0, 20) + '...' : label;
}

function formatNodeLabel(name, role) {
    let cleanRole = role || '';
    cleanRole = cleanRole.replace(' @ PT KasirNusa Teknologi', '');
    cleanRole = cleanRole.replace(' @ KasirNusa', '');
    cleanRole = cleanRole.replace(' @ Grup Ritel Mandala', '');
    cleanRole = cleanRole.replace(' @ Nirwana Hotel & Resto', '');
    cleanRole = cleanRole.replace(' @ Saiyo Group', '');
    cleanRole = cleanRole.replace('Penyedia SaaS POS & Inventory', 'SaaS POS Vendor');
    cleanRole = cleanRole.replace('ex-Head of Ops C01', 'ex-Ops C01');
    cleanRole = cleanRole.replace('ex-GM Sentosa Abadi', 'ex-Sentosa');
    
    return `${name}\n[${cleanRole}]`;
}

async function initDynamicVisGraph(filterMode = 'ALL') {
    const container = document.getElementById('vis-container');
    if (!container) return;

    currentGraphFilter = filterMode;
    updateFilterButtonsUI(filterMode);

    try {
        const queryParam = filterMode !== 'ALL' ? `?filter=${filterMode}` : '';
        const response = await fetch(`/api/graph${queryParam}`);
        const data = await response.json();

        // High-contrast, premium color scheme by entity type
        const typeColors = {
            kasirnusa: { background: '#1E293B', border: '#3B82F6', font: '#FFFFFF' },
            dm:        { background: '#3B0764', border: '#C084FC', font: '#FFFFFF' },
            prospect:  { background: '#064E3B', border: '#34D399', font: '#FFFFFF' },
            customer:  { background: '#0C4A6E', border: '#38BDF8', font: '#FFFFFF' },
            org:       { background: '#451A03', border: '#FBBF24', font: '#FFFFFF' },
            contact:   { background: '#1E293B', border: '#94A3B8', font: '#FFFFFF' },
            deal:      { background: '#4C0519', border: '#FB7185', font: '#FFFFFF' }
        };

        const visNodes = data.nodes.map(n => {
            const colors = typeColors[n.type] || typeColors.contact;
            const isDM = n.type === 'dm';
            const isTarget = n.id === 'P01' || n.id === 'P04';
            const isCompany = n.type === 'prospect' || n.type === 'customer' || n.id === 'KASIRNUSA';

            return {
                id: n.id,
                label: formatNodeLabel(n.label, n.role),
                title: `<strong>${n.label}</strong><br/>Role: ${n.role}<br/>Type: ${n.type.toUpperCase()}<br/>ID: ${n.id}`,
                shape: isCompany ? 'box' : 'dot',
                size: isDM ? 28 : (isTarget ? 30 : 22),
                borderRadius: isCompany ? 12 : undefined,
                margin: isCompany ? 12 : undefined,
                color: {
                    background: colors.background,
                    border: colors.border,
                    highlight: { background: '#0F172A', border: colors.border }
                },
                font: {
                    face: 'Plus Jakarta Sans',
                    size: isDM || isTarget ? 13 : 11,
                    bold: true,
                    color: '#FFFFFF',
                    strokeWidth: 4,
                    strokeColor: '#0B0F19' // Text Halo prevents collision with lines
                },
                borderWidth: isDM || isTarget ? 3 : 2,
                shadow: {
                    enabled: true,
                    color: 'rgba(0, 0, 0, 0.6)',
                    size: 8,
                    x: 2,
                    y: 2
                }
            };
        });

        const visEdges = data.edges.map(e => {
            const isAlumni = e.type === 'alumni' || (e.label && e.label.includes('Alumni'));
            const isDirectComm = e.type === 'interaction' || (e.label && e.label.includes('KOMUNIKASI'));
            
            const edgeColor = isAlumni ? '#F59E0B' : (isDirectComm ? '#60A5FA' : '#64748B');
            const edgeWidth = isAlumni ? 3.5 : (isDirectComm ? 2.5 : 1.5);
            const shortLabel = formatEdgeLabel(e.label, e.type, e.weight);

            return {
                from: e.from,
                to: e.to,
                label: shortLabel,
                title: `<strong>${e.label}</strong><br/>Relationship Weight: ${e.weight ? e.weight + '/10' : 'Standard'}`,
                color: {
                    color: edgeColor,
                    highlight: '#38BDF8',
                    hover: '#FBBF24'
                },
                width: edgeWidth,
                arrows: {
                    to: { enabled: true, scaleFactor: 0.85 }
                },
                font: {
                    face: 'Plus Jakarta Sans',
                    size: 10,
                    color: '#F1F5F9',
                    background: '#1E293B', // Solid background pill prevents text colliding with edge lines!
                    strokeWidth: 0,
                    align: 'middle'
                },
                smooth: {
                    type: 'cubicBezier',
                    forceDirection: 'none',
                    roundness: 0.25
                }
            };
        });

        const options = {
            nodes: {
                borderWidth: 2,
                chosen: true
            },
            edges: {
                selectionWidth: 2,
                hoverWidth: 1.5
            },
            physics: {
                solver: 'forceAtlas2Based',
                forceAtlas2Based: {
                    gravitationalConstant: -180, // High negative gravity pushes nodes far apart!
                    centralGravity: 0.005,       // Very gentle center attraction prevents clumping
                    springLength: 230,           // 230px space between connected nodes
                    springConstant: 0.04,
                    damping: 0.7,
                    avoidOverlap: 1              // STRICT NO OVERLAP
                },
                maxVelocity: 40,
                minVelocity: 0.1,
                stabilization: {
                    iterations: 300,
                    updateInterval: 25,
                    fit: true
                }
            },
            interaction: {
                hover: true,
                tooltipDelay: 100,
                navigationButtons: true,
                keyboard: true,
                zoomView: true,
                dragView: true
            }
        };

        if (!visNetwork) {
            graphNodesDataSet = new vis.DataSet(visNodes);
            graphEdgesDataSet = new vis.DataSet(visEdges);
            visNetwork = new vis.Network(container, { nodes: graphNodesDataSet, edges: graphEdgesDataSet }, options);
        } else {
            graphNodesDataSet.clear();
            graphEdgesDataSet.clear();
            graphNodesDataSet.add(visNodes);
            graphEdgesDataSet.add(visEdges);
            visNetwork.setOptions(options);
            setTimeout(() => {
                visNetwork.fit({ animation: { duration: 600, easingFunction: 'easeInOutQuad' } });
            }, 150);
        }

    } catch (err) {
        console.error("Error initializing vis graph:", err);
    }
}

function updateFilterButtonsUI(filterMode) {
    const btnAll = document.getElementById('graph-btn-all');
    const btnP01 = document.getElementById('graph-btn-p01');
    const btnP04 = document.getElementById('graph-btn-p04');

    const activeClass = "cursor-pointer px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-white text-blue-700 shadow-md";
    const inactiveClass = "cursor-pointer px-4 py-1.5 rounded-full text-xs font-bold transition-all text-white/80 hover:text-white";

    if (btnAll) btnAll.className = filterMode === 'ALL' ? activeClass : inactiveClass;
    if (btnP01) btnP01.className = filterMode === 'P01' ? activeClass : inactiveClass;
    if (btnP04) btnP04.className = filterMode === 'P04' ? activeClass : inactiveClass;
}

window.filterGraph = function(filterMode) {
    initDynamicVisGraph(filterMode);
};

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

window.resetGraphView = function() {
    if (!visNetwork) return;
    visNetwork.unselectAll();
    visNetwork.fit({ animation: { duration: 800 } });
};

window.initDynamicVisGraph = initDynamicVisGraph;
