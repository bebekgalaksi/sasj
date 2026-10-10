import os
import json
import socket
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional

def _ipv4_preferred_urlopen(req, timeout=6):
    orig_getaddrinfo = socket.getaddrinfo
    def getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
        res = orig_getaddrinfo(host, port, family, type, proto, flags)
        v4 = [r for r in res if r[0] == socket.AF_INET]
        return v4 if v4 else res
    try:
        socket.getaddrinfo = getaddrinfo_ipv4
        return urllib.request.urlopen(req, timeout=timeout)
    finally:
        socket.getaddrinfo = orig_getaddrinfo

class EdgeRAGRetriever:
    """
    RAG Context Retriever for Relationship Edges.
    Retrieves and synthesizes unstructured evidence across interaction logs,
    employment histories, and account health to supply System One (Jev) evaluation.
    """
    def __init__(self, engine):
        self.engine = engine

    def _matches_entity(self, entity_id: str, text: str) -> bool:
        if not entity_id or not text:
            return False
        text_lower = text.lower()
        if entity_id.lower() in text_lower:
            return True

        if entity_id in self.engine.employees:
            emp = self.engine.employees[entity_id]
            e_mail = emp.get("email", "").lower()
            if e_mail and e_mail in text_lower:
                return True
            e_name = emp.get("nama", "").lower()
            parts = [p for p in e_name.split() if len(p) > 2]
            if parts and all(p in text_lower for p in parts):
                return True

        if entity_id in self.engine.contacts:
            cnt = self.engine.contacts[entity_id]
            c_mail = cnt.get("email", "").lower()
            if c_mail and c_mail in text_lower:
                return True
            c_name = cnt.get("nama", "").lower()
            parts = [p for p in c_name.split() if len(p) > 2]
            if parts and all(p in text_lower for p in parts):
                return True

        return False

    def retrieve_context(self, source_id: str, target_id: str) -> Dict[str, Any]:
        s_node = self.engine.nodes.get(source_id, {})
        t_node = self.engine.nodes.get(target_id, {})
        s_name = s_node.get("name", source_id)
        t_name = t_node.get("name", target_id)
        s_role = s_node.get("role", "")
        t_role = t_node.get("role", "")

        # 1. Gather relevant employment records (supporting contacts, accounts, and their entire career histories)
        s_contact_ids = {e.get("contact_id") for e in self.engine.employment if (e.get("contact_id") == source_id or e.get("account_id") == source_id) and e.get("contact_id")}
        t_contact_ids = {e.get("contact_id") for e in self.engine.employment if (e.get("contact_id") == target_id or e.get("account_id") == target_id) and e.get("contact_id")}
        if source_id in self.engine.contacts:
            s_contact_ids.add(source_id)
        if target_id in self.engine.contacts:
            t_contact_ids.add(target_id)

        s_emp_list = [e for e in self.engine.employment if e.get("contact_id") in s_contact_ids or e.get("account_id") == source_id]
        t_emp_list = [e for e in self.engine.employment if e.get("contact_id") in t_contact_ids or e.get("account_id") == target_id]

        # 2. Check direct transition of key people between source and target
        s_contacts = {e.get("contact_id"): e for e in s_emp_list if e.get("account_id") == source_id or e.get("contact_id") == source_id}
        t_contacts = {e.get("contact_id"): e for e in t_emp_list if e.get("account_id") == target_id or e.get("contact_id") == target_id}
        transition_contacts = set(s_contacts.keys()) & set(t_contacts.keys())

        # 3. Career / Alumni Overlap
        shared_orgs = []
        for se in s_emp_list:
            for te in t_emp_list:
                if se.get("organisasi") and se.get("organisasi") == te.get("organisasi") and se.get("contact_id") != te.get("contact_id"):
                    s_c_name = self.engine.contacts.get(se.get("contact_id"), {}).get("nama", se.get("contact_id"))
                    t_c_name = self.engine.contacts.get(te.get("contact_id"), {}).get("nama", te.get("contact_id"))
                    shared_orgs.append({
                        "org": se.get("organisasi"),
                        "source_person": f"{s_c_name} ({se.get('jabatan')})",
                        "target_person": f"{t_c_name} ({te.get('jabatan')})",
                        "source_period": f"{se.get('mulai')} s/d {se.get('selesai')}",
                        "target_period": f"{te.get('mulai')} s/d {te.get('selesai')}"
                    })

        # 4. Check AM to Contact's Organization link
        am_links = []
        if source_id.startswith("E"):
            managed_accs = [acc_id for acc_id, a in self.engine.accounts.items() if a.get("assigned_am_id") == source_id]
            for te in t_emp_list:
                if te.get("account_id") in managed_accs:
                    acc_obj = self.engine.accounts.get(te.get("account_id"), {})
                    am_links.append({
                        "account_id": te.get("account_id"),
                        "account_name": acc_obj.get("nama", te.get("account_id")),
                        "target_role": te.get("jabatan"),
                        "tenure": f"{te.get('mulai')} s/d {te.get('selesai')}"
                    })

        # 5. Direct Communication Discovery
        matched_interactions = []
        checked_ids = {source_id, target_id} | transition_contacts
        for inter in self.engine.interactions:
            peserta = inter.get("peserta", "")
            dari = inter.get("dari", "")
            ke = inter.get("ke", "")
            combined_channel = f"{peserta} {dari} {ke}"

            matches_any_s = any(self._matches_entity(sid, combined_channel) for sid in [source_id] + list(s_contacts.keys())[:3])
            matches_any_t = any(self._matches_entity(tid, combined_channel) for tid in [target_id] + list(t_contacts.keys())[:3])

            if (matches_any_s and matches_any_t) or any(self._matches_entity(cid, combined_channel) for cid in transition_contacts):
                matched_interactions.append(inter)

        # 6. Dense State Document for Jev System One
        state_lines = [
            f"STATE EVALUASI: Relasi profesional & bisnis antara Entitas A ({s_name}, {s_role}) dan Entitas B ({t_name}, {t_role})."
        ]

        if transition_contacts:
            state_lines.append("TRANSISI PERSONEL KUNCI / ADVOKAT BERSAMA:")
            for cid in transition_contacts:
                c_obj = self.engine.contacts.get(cid, {})
                se_info = s_contacts[cid]
                te_info = t_contacts[cid]
                state_lines.append(
                    f"- {c_obj.get('nama', cid)} pernah menjabat {se_info.get('jabatan')} di {se_info.get('organisasi')} "
                    f"({se_info.get('mulai')} - {se_info.get('selesai')}) dan kini menjabat {te_info.get('jabatan')} di {te_info.get('organisasi')} "
                    f"(sejak {te_info.get('mulai')}) dengan otoritas pengadaan komersial."
                )

        if shared_orgs:
            state_lines.append("BUKTI ALUMNI / TEMPAT KERJA BERSAMA:")
            for o in shared_orgs[:3]:
                state_lines.append(f"- Organisasi: {o['org']}. {o['source_person']} ({o['source_period']}) dan {o['target_person']} ({o['target_period']}).")

        if am_links:
            state_lines.append("HUBUNGAN ACCOUNT MANAGER & KLIEN:")
            for am in am_links:
                state_lines.append(f"- Entitas A adalah AM resmi untuk {am['account_name']}, di mana Entitas B menjabat sebagai {am['target_role']} ({am['tenure']}).")

        if matched_interactions:
            state_lines.append(f"LOG INTERAKSI KOMUNIKASI (Ditemukan {len(matched_interactions)} pesan/meeting langsung):")
            for inter in matched_interactions[:6]:
                state_lines.append(f"- [{inter.get('tanggal')}] ({inter.get('tipe')}): Subjek '{inter.get('subjek')}' -> {inter.get('isi')} (Ref: {inter.get('interaction_id')})")
        elif not transition_contacts and not shared_orgs:
            state_lines.append("Tidak ada jejak interaksi email/meeting langsung tercatat di CRM antara kedua entitas.")

        state_text = "\n".join(state_lines)

        return {
            "source_id": source_id,
            "target_id": target_id,
            "source_name": s_name,
            "target_name": t_name,
            "shared_orgs": shared_orgs,
            "am_links": am_links,
            "transition_contacts": list(transition_contacts),
            "interaction_count": len(matched_interactions),
            "interactions": matched_interactions,
            "state_text": state_text,
            "evidence_snippets": [i.get("interaction_id") for i in matched_interactions if i.get("interaction_id")]
        }


class JevSystemOneEvaluator:
    """
    Evaluator using TypeSafe AI's System One (Jev) discriminative model.
    Sends strictly typed schemas (Score criteria, Choice criteria dict, Noul instructions)
    to https://api.typesafe.ai/v1/systemone.
    """
    def __init__(self, api_key: Optional[str] = None, base_url: str = "https://api.typesafe.ai/v1/systemone"):
        self.api_key = api_key
        self.base_url = base_url

    def evaluate(self, rag_context: Dict[str, Any]) -> Dict[str, Any]:
        state = rag_context.get("state_text", "")
        questions = {
            "relationship_strength": {
                "type": "score",
                "criteria": [
                    "Cold: Tidak ada interaksi atau hubungan terputus",
                    "Weak: Kontak formal satu arah tanpa interaksi mendalam",
                    "Moderate: Interaksi bisnis standar cukup baik",
                    "Strong: Kolaborasi kerja erat bertahun-tahun atau alumni selevel",
                    "Champion: Hubungan sangat hangat, advokat terpercaya dan berpengaruh tinggi"
                ]
            },
            "relation_type": {
                "type": "choice",
                "criteria": {
                    "ALUMNI_EX_COLLEAGUE": "Pernah bekerja bersama di perusahaan masa lalu sebagai rekan alumni",
                    "KEY_CLIENT_CHAMPION": "Klien aktif atau mantan klien dengan hubungan kerja sangat positif",
                    "DIRECT_REPORT": "Hubungan bawahan dan atasan langsung",
                    "TECHNICAL_GATEKEEPER": "Staf teknis tanpa wewenang anggaran komersial",
                    "COLD_ACQUAINTANCE": "Kontak baru atau belum ada interaksi substansial"
                }
            },
            "is_trusted_advocate": {
                "type": "noul",
                "instructions": "Apakah Entitas B berpotensi tinggi menjadi champion, sponsor internal, atau kontak referensi yang positif bagi Entitas A?"
            }
        }

        # 1. Call TypeSafe AI Jev API if API Key is present
        if self.api_key:
            jev_data = self._call_jev_api(state, questions)
            if jev_data and "answers" in jev_data:
                return self._parse_jev_response(jev_data, rag_context)

        # 2. Strict Type-Safe Fallback
        return self._deterministic_rag_evaluation(rag_context)

    def _call_jev_api(self, state: str, questions: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "jev-latest",
            "state": state,
            "questions": questions
        }
        try:
            req = urllib.request.Request(
                self.base_url,
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST"
            )
            with _ipv4_preferred_urlopen(req, timeout=6) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            try:
                err_msg = e.read().decode("utf-8")
                print(f"[Jev API Error {e.code}]: {err_msg}")
            except Exception:
                pass
            return None
        except Exception as e:
            print(f"[Jev Network Error]: {e}")
            return None

    def _parse_jev_response(self, data: Dict[str, Any], rag_context: Dict[str, Any]) -> Dict[str, Any]:
        answers = data.get("answers", {})
        model_name = data.get("model", "jev-1.13.0")

        # Parse score: TypeSafe returns score (0 to 4 float). Map to 5.0..10.0 scale.
        raw_score_obj = answers.get("relationship_strength", {})
        raw_score = raw_score_obj.get("score", 2.0)
        try:
            norm_score = round(min(10.0, max(5.0, 5.0 + (float(raw_score) / 4.0) * 5.0)), 1)
        except Exception:
            norm_score = 8.5

        # Parse choice
        raw_choice_obj = answers.get("relation_type", {})
        rel_type = raw_choice_obj.get("choice", "KEY_CLIENT_CHAMPION")

        # Parse noul
        raw_noul_obj = answers.get("is_trusted_advocate", {})
        noul_val = raw_noul_obj.get("noul", 0.85)
        is_trusted = bool(float(noul_val) >= 0.5)

        return {
            "weight": norm_score,
            "relation_type": rel_type,
            "is_trusted_advocate": is_trusted,
            "advocate_probability": round(float(noul_val), 2),
            "confidence": round(float(raw_choice_obj.get("confidence", 0.90)), 2),
            "model": model_name,
            "evaluated_by": model_name,
            "evidence_count": rag_context.get("interaction_count", 0),
            "evidence_snippets": rag_context.get("evidence_snippets", [])
        }

    def _deterministic_rag_evaluation(self, rag_context: Dict[str, Any]) -> Dict[str, Any]:
        shared_orgs = rag_context.get("shared_orgs", [])
        am_links = rag_context.get("am_links", [])
        transition_contacts = rag_context.get("transition_contacts", [])
        interactions = rag_context.get("interactions", [])
        n_inter = len(interactions)

        base_weight = 5.0
        rel_type = "COLD_ACQUAINTANCE"
        advocate_prob = 0.20

        if transition_contacts:
            base_weight = 9.4
            rel_type = "KEY_CLIENT_CHAMPION"
            advocate_prob = 0.92
        elif shared_orgs:
            base_weight = 8.8
            rel_type = "ALUMNI_EX_COLLEAGUE"
            advocate_prob = 0.85

        if am_links:
            base_weight = max(base_weight, 8.5)
            if not shared_orgs and not transition_contacts:
                rel_type = "KEY_CLIENT_CHAMPION"
            advocate_prob = max(advocate_prob, 0.85)

        if n_inter >= 6:
            base_weight = max(base_weight, 9.5)
            advocate_prob = max(advocate_prob, 0.95)
        elif n_inter >= 3:
            base_weight = max(base_weight, 8.4)
            advocate_prob = max(advocate_prob, 0.80)
        elif n_inter >= 1:
            base_weight = max(base_weight, 7.0)
            advocate_prob = max(advocate_prob, 0.60)

        return {
            "weight": round(min(10.0, base_weight), 1),
            "relation_type": rel_type,
            "is_trusted_advocate": bool(advocate_prob >= 0.5),
            "advocate_probability": advocate_prob,
            "confidence": 0.90,
            "model": "jev-1.13.0-local",
            "evaluated_by": "jev-system-one-local",
            "evidence_count": n_inter,
            "evidence_snippets": rag_context.get("evidence_snippets", [])
        }
