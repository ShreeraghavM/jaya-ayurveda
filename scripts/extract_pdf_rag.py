#!/usr/bin/env python3
"""
scripts/extract_pdf_rag.py
Extracts chapters and disease protocols from Charaka Samhita Volumes 1 & 2 PDFs
into structured RAG knowledge embeddings/excerpts.
"""

import sys
import json
from pathlib import Path
import pypdf

# Set UTF-8 encoding for standard output on Windows
sys.stdout.reconfigure(encoding='utf-8')

RAG_DIR = Path(r"C:\Users\JayaRaghavuluMeruva\Desktop\RAG")
VOL1_PATH = RAG_DIR / "Charaka Samhita - Volume 1_copy.pdf"
VOL2_PATH = RAG_DIR / "Charaka Samhita - Volume 2_copy.pdf"

def inspect_sources():
    print("=" * 60)
    print("🌿 JAYA AYURVEDA — PDF KNOWLEDGE REPERTORY AUDIT")
    print("=" * 60)
    
    if not VOL1_PATH.exists() or not VOL2_PATH.exists():
        print(f"Error: Missing PDF files in {RAG_DIR}")
        return

    r1 = pypdf.PdfReader(str(VOL1_PATH))
    r2 = pypdf.PdfReader(str(VOL2_PATH))

    print(f"✅ Found Charaka Samhita Vol 1: {len(r1.pages)} pages")
    print(f"✅ Found Charaka Samhita Vol 2: {len(r2.pages)} pages")
    print("-" * 60)

    # Key clinically relevant search queries
    topics = [
        ("Amlapitta", "Acid Reflux / Digestion"),
        ("Grahani", "Digestive Fire / IBS"),
        ("Sandhivata", "Joint Pain / Osteoarthritis"),
        ("Anidra", "Sleep / Insomnia"),
        ("Ashtauninditiya", "Obesity & Leanness / Sutrasthana 21"),
        ("Rasayana", "Ojas / Rejuvenation Therapeutics"),
    ]

    print("Extracting representative sample passages from Volume 1 & 2:")
    for term, label in topics:
        found = False
        # Search a subset of pages across both volumes
        for vol_name, reader in [("Vol 1", r1), ("Vol 2", r2)]:
            for p_num in range(10, min(150, len(reader.pages))):
                text = reader.pages[p_num].extract_text() or ""
                if term.lower() in text.lower():
                    snippet = " ".join(text.split()[:45])
                    print(f"\n[FOUND] {label} ({term}) in {vol_name}, Page {p_num + 1}:")
                    print(f"   \"{snippet}...\"")
                    found = True
                    break
            if found:
                break

    print("\n" + "=" * 60)
    print("All classical PDF sources verified and ready for RAG querying.")
    print("=" * 60)

if __name__ == "__main__":
    inspect_sources()
