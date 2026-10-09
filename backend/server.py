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
            self.send_json_response(graph_engine.get_full_graph_payload())

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

        elif path == "/api/parameter-analysis":
            analysis = {
                "tim": "Tim 3 - Relationship Path Finder (Sales Track)",
                "goal": "Lewat siapa jalur terbaik menuju decision maker? + Draft Pesan Intro",
                "included_datasets": [
                    {
                        "file": "crm_accounts.csv",
                        "purpose": "Identifikasi entitas prospek (P01, P04) dan akun aktif (C01, C06)"
                    },
                    {
                        "file": "crm_contacts.csv",
                        "purpose": "Profil kontak, nama, email, nomor HP, dan posisi/jabatan resmi"
                    },
                    {
                        "file": "contact_employment_history.csv",
                        "purpose": "Mendeteksi perpindahan karir (ex-C01 to P01) dan alumni bersama di PT Sentosa Abadi Group"
                    },
                    {
                        "file": "crm_deals.csv",
                        "purpose": "Mengukur stage deal, nilai komersial annual, dan durasi bottleneck di stage"
                    },
                    {
                        "file": "employees.csv",
                        "purpose": "Tim internal KasirNusa (Account Managers E03/E04 & Sales Executive E06)"
                    },
                    {
                        "file": "interactions.jsonl",
                        "purpose": "Sentimen interaksi, riwayat percakapan email, dan kedekatan hubungan (13+ interaksi)"
                    },
                    {
                        "file": "decision_log.csv",
                        "purpose": "Preseden komersial VP Sales Andi Wiratama (D-2025-11 approval 15% diskon volume 40+ outlet)"
                    }
                ],
                "excluded_datasets": [
                    {
                        "file": "bugs.csv",
                        "reason": "Parameter bug teknis adalah domain CS Churn (Tim 1) / Engineering. Tidak relevan untuk pemetaan hubungan pemegang keputusan sales."
                    },
                    {
                        "file": "features.csv",
                        "reason": "Roadmap fitur tidak memodifikasi bobot jalur koneksi antar manusia / alumni."
                    },
                    {
                        "file": "support_tickets.csv",
                        "reason": "Tiket komplain operasional tidak memberikan jalur akses ke C-level pengambil keputusan prospek baru."
                    },
                    {
                        "file": "product_usage_daily.csv",
                        "reason": "Log transaksi kasir harian digunakan untuk pemantauan kesehatan akun aktif, bukan pemetaan prospek."
                    }
                ],
                "mathematical_formula": {
                    "edge_weight": "W = f(Overlapping_Years, Interaction_Count, Seniority_Level)",
                    "path_score": "Path_Score = (Sum(W_edge) / Hop_Count) * Role_Authority_Multiplier",
                    "golden_paths": {
                        "P01": "Sari Puspita (E03, AM C01) ➔ Rina Hapsari (K017, GM Ops P01 ex-C01) ➔ Steven Wijaya (K089, Dirut P01) [Score: 9.2]",
                        "P04": "Wahyu Nugroho (E04, AM C06) ➔ Budi Santoso (K116, CFO C06) ➔ Hartono Gunawan (K028, Dirut P04 ex-PT Sentosa Abadi) [Score: 8.5]"
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
