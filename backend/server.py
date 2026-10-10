import http.server
import socketserver
import json
import urllib.parse
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

try:
    from graph_engine import DynamicGraphEngine
except ImportError:
    from backend.graph_engine import DynamicGraphEngine

PORT = int(os.environ.get("PORT", 8081))
FRONTEND_DIR = BASE_DIR / "frontend"

graph_engine = DynamicGraphEngine(BASE_DIR)

class RESTRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(FRONTEND_DIR), **kwargs)

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        # Allow /frontend/... requests to map directly to frontend static files
        if path.startswith("/frontend/"):
            self.path = self.path[len("/frontend"):]
            parsed_url = urllib.parse.urlparse(self.path)
            path = parsed_url.path

        # API Endpoints
        if path == "/api/prospects":
            self.send_json_response(list(graph_engine.accounts.values()))

        elif path == "/api/contacts":
            self.send_json_response(list(graph_engine.contacts.values()))

        elif path == "/api/entities":
            self.send_json_response(graph_engine.get_entities())

        elif path == "/api/graph":
            filter_param = query.get("filter", query.get("prospect_id", [None]))[0]
            self.send_json_response(graph_engine.get_full_graph_payload(filter_param))

        elif path == "/api/pathfinder":
            prospect_id = query.get("prospect_id", ["P01"])[0]
            result = graph_engine.solve_relationship_path(prospect_id)
            self.send_json_response(result)

        elif path == "/api/custom-pathfinder":
            mode = query.get("mode", ["company_to_company"])[0]
            source = query.get("source", ["C01"])[0]
            target = query.get("target", ["P01"])[0]
            result = graph_engine.solve_custom_path(mode, source, target)
            self.send_json_response(result)

        elif path == "/api/deals":
            deals = []
            for d in graph_engine.deals.values():
                if d.get("account_id", "").startswith("P") and d.get("status") == "Terbuka":
                    acc = graph_engine.accounts.get(d["account_id"], {})
                    pf = graph_engine.solve_relationship_path(d["account_id"])
                    score = pf.get("best_path", {}).get("score", 0.0)
                    path_nodes = pf.get("best_path", {}).get("path_nodes", [])
                    hops = len(path_nodes) - 1 if len(path_nodes) > 0 else 0
                    deals.append({
                        "id": d["account_id"],
                        "deal_id": d["deal_id"],
                        "name": acc.get("nama", acc.get("nama_perusahaan", d["account_id"])),
                        "nilai_tahunan": int(float(d.get("nilai_tahunan", 0))),
                        "outlets": int(d.get("outlet", 0)),
                        "score": score,
                        "stage": d.get("stage", ""),
                        "hops": hops
                    })
            self.send_json_response(deals)

        elif path == "/api/parameter-analysis":
            analysis = {
                "team": "Team 3 - Relationship Path Finder (Sales Track)",
                "goal": "Identify the highest-confidence warm path to decision makers + Generate Contextual Intro Messages",
                "included_datasets": [
                    {
                        "file": "crm_accounts.csv",
                        "purpose": "Identify target prospect accounts (P01, P04) and active client accounts (C01, C06)"
                    },
                    {
                        "file": "crm_contacts.csv",
                        "purpose": "Contact profiles, verified names, official titles, emails, and phone numbers"
                    },
                    {
                        "file": "contact_employment_history.csv",
                        "purpose": "Detect career transitions (ex-C01 to P01) and alumni overlaps at PT Sentosa Abadi Group"
                    },
                    {
                        "file": "crm_deals.csv",
                        "purpose": "Measure deal stages, annual contract value, and bottleneck stalled duration"
                    },
                    {
                        "file": "employees.csv",
                        "purpose": "Internal KasirNusa team roster (Account Managers E03/E04 & Sales Reps E06)"
                    },
                    {
                        "file": "interactions.jsonl",
                        "purpose": "Interaction sentiment, email correspondence history, and relationship depth (13+ interactions)"
                    },
                    {
                        "file": "decision_log.csv",
                        "purpose": "Commercial precedents from VP/CEO Andi Wiratama (D-2025-11 approving 15% volume discount for 40+ outlets)"
                    }
                ],
                "excluded_datasets": [
                    {
                        "file": "bugs.csv",
                        "reason": "Technical bug telemetry belongs to CS Churn (Team 1) / Engineering. Irrelevant for executive sales relationship mapping."
                    },
                    {
                        "file": "features.csv",
                        "reason": "Product roadmap features do not modify interpersonal connection weights or alumni affinities."
                    },
                    {
                        "file": "support_tickets.csv",
                        "reason": "Operational complaints do not provide access paths to enterprise C-level decision makers."
                    },
                    {
                        "file": "product_usage_daily.csv",
                        "reason": "Daily POS transaction telemetry monitors active account health, not prospect pathfinding."
                    }
                ],
                "mathematical_formula": {
                    "edge_weight": "W = f(Overlapping_Years, Interaction_Count, Seniority_Level)",
                    "path_score": "Path_Score = (Sum(W_edge) / Hop_Count) * Role_Authority_Multiplier",
                    "golden_paths": {
                        "P01": "Sari Puspita (E03, AM C01) ➔ Rina Hapsari (K017, GM Ops P01 ex-C01) ➔ Steven Wijaya (K089, CEO P01) [Score: 9.2]",
                        "P04": "Wahyu Nugroho (E04, AM C06) ➔ Budi Santoso (K116, CFO C06) ➔ Hartono Gunawan (K028, CEO P04 ex-PT Sentosa Abadi) [Score: 8.5]"
                    }
                }
            }
            self.send_json_response(analysis)

        else:
            return super().do_GET()

    def send_json_response(self, data):
        body = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

def run_server():
    os.chdir(str(FRONTEND_DIR))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("0.0.0.0", PORT), RESTRequestHandler) as httpd:
        print(f"Server started on http://0.0.0.0:{PORT} (accessible at http://localhost:{PORT})")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
