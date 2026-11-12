#!/usr/bin/env python3
"""Compare chapter 4 text independently with the supplied PowerPoint XML.

Uses only Python's standard library. No whitespace, punctuation, case, or Unicode
normalization is applied to source paragraphs or their imported/rendered copies.
"""

from __future__ import annotations

import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import posixpath
import sys
from xml.etree import ElementTree as ET
import zipfile


ROOT = Path(__file__).resolve().parent.parent
SOURCE_SHA256 = "9f5f41cd28ef54658b571a057e8094b8dde5e80616c66da0d0c4928204ed9360"
NS = {
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}
VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}


def relationships(archive: zipfile.ZipFile, part: str) -> dict[str, dict]:
    if part not in archive.namelist():
        return {}
    base = posixpath.dirname(posixpath.dirname(part))
    result = {}
    for relationship in ET.fromstring(archive.read(part)):
        attrs = relationship.attrib
        external = attrs.get("TargetMode") == "External"
        target = attrs["Target"] if external else posixpath.normpath(
            posixpath.join(base, attrs["Target"])
        )
        result[attrs["Id"]] = {
            "target": target,
            "type": attrs.get("Type", ""),
            "external": external,
        }
    return result


def raw_xml_text(xml: bytes) -> dict:
    tree = ET.fromstring(xml)
    all_paragraphs = []
    for index, paragraph in enumerate(tree.findall(".//a:p", NS)):
        runs = []
        for child in paragraph:
            name = child.tag.rsplit("}", 1)[-1]
            if name in {"r", "fld"}:
                runs.extend(node.text or "" for node in child.findall(".//a:t", NS))
            elif name == "br":
                runs.append("\n")
            elif name == "tab":
                runs.append("\t")
        text = "".join(runs)
        all_paragraphs.append({"xmlParagraphIndex": index, "text": text, "runs": runs})
    return {
        "allParagraphs": all_paragraphs,
        "paragraphs": [paragraph for paragraph in all_paragraphs if paragraph["text"] != ""],
        "textElementCount": len(tree.findall(".//a:t", NS)),
        "breakCount": len(tree.findall(".//a:br", NS)),
        "fieldCount": len(tree.findall(".//a:fld", NS)),
        "tableCount": len(tree.findall(".//a:tbl", NS)),
    }


def raw_slides(pptx: Path) -> list[dict]:
    slides = []
    with zipfile.ZipFile(pptx) as archive:
        presentation = ET.fromstring(archive.read("ppt/presentation.xml"))
        presentation_rels = relationships(archive, "ppt/_rels/presentation.xml.rels")
        for index, slide_id in enumerate(presentation.findall("p:sldIdLst/p:sldId", NS)):
            rid = slide_id.attrib[f"{{{NS['r']}}}id"]
            part = presentation_rels[rid]["target"]
            slide = raw_xml_text(archive.read(part))
            rel_part = posixpath.join(
                posixpath.dirname(part), "_rels", posixpath.basename(part) + ".rels"
            )
            notes = [
                {"xmlPart": rel["target"], **raw_xml_text(archive.read(rel["target"]))}
                for rel in relationships(archive, rel_part).values()
                if rel["type"].endswith("/notesSlide") and not rel["external"]
            ]
            slide.update(order=index + 1, xmlPart=part, notes=notes)
            slides.append(slide)
    return slides


def imported_paragraphs(slide: dict) -> list[dict]:
    paragraphs = []
    for node in slide.get("nodes", []):
        text_bodies = []
        if node.get("kind") == "text":
            text_bodies.append(node["text"])
        elif node.get("kind") == "table":
            text_bodies.extend(
                cell["text"]
                for row in node["rows"]
                for cell in row["cells"]
                if cell.get("text") is not None
            )
        for text_body in text_bodies:
            for paragraph in text_body["paragraphs"]:
                runs = [run["text"] for run in paragraph["runs"]]
                text = "".join(runs)
                if text != "":
                    paragraphs.append({"text": text, "runs": runs})
    return paragraphs


class ParagraphHTMLParser(HTMLParser):
    """Extract exact text inside indexed source wrappers or reference paragraphs."""

    def __init__(self, reference: bool = False):
        super().__init__(convert_charrefs=True)
        self.reference = reference
        self.stack = []
        self.paragraphs = []
        self.all_text = []
        self.unwrapped_text = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        source_index = attrs.get("data-source-paragraph")
        is_reference = self.reference and "chapter3-paragraph" in attrs.get("class", "").split()
        owner = None
        if source_index is not None or is_reference:
            if any(frame["owner"] is not None for frame in self.stack):
                self.errors.append("Nested source paragraph wrappers")
            owner = {
                "index": len(self.paragraphs) if is_reference else source_index,
                "text": "",
            }
            self.paragraphs.append(owner)
        ignored = (
            attrs.get("aria-hidden") == "true"
            or "data-chrome" in attrs
            or tag in {"script", "style"}
            or any(frame["ignored"] for frame in self.stack)
        )
        if tag not in VOID_TAGS:
            self.stack.append({"tag": tag, "owner": owner, "ignored": ignored})

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID_TAGS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index]["tag"] == tag:
                del self.stack[index:]
                return

    def handle_data(self, data):
        if any(frame["ignored"] for frame in self.stack):
            return
        self.all_text.append(data)
        owners = [frame["owner"] for frame in self.stack if frame["owner"] is not None]
        if owners:
            for owner in owners:
                owner["text"] += data
        else:
            self.unwrapped_text.append(data)


class EmbeddedSlidesParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.reading = False
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "script" and dict(attrs).get("id") == "slide-source":
            self.reading = True

    def handle_endtag(self, tag):
        if tag == "script":
            self.reading = False

    def handle_data(self, data):
        if self.reading:
            self.parts.append(data)


def rendered_check(html: str, expected: list[str]) -> dict:
    parser = ParagraphHTMLParser()
    parser.feed(html)
    indices = [paragraph["index"] for paragraph in parser.paragraphs]
    expected_indices = [str(index) for index in range(len(expected))]
    index_counts_exact = sorted(indices) == sorted(expected_indices)
    differences = []
    for index, text in enumerate(expected):
        matches = [paragraph for paragraph in parser.paragraphs if paragraph["index"] == str(index)]
        if len(matches) != 1 or matches[0]["text"] != text:
            differences.append({
                "paragraph": index,
                "expected": text,
                "actual": [paragraph["text"] for paragraph in matches],
            })
    unwrapped_copy = [text for text in parser.unwrapped_text if text.strip()]
    return {
        "passed": index_counts_exact and not differences and not parser.errors and not unwrapped_copy,
        "paragraphCount": len(parser.paragraphs),
        "eachSourceParagraphExactlyOnce": index_counts_exact,
        "differences": differences,
        "parserErrors": parser.errors,
        "additionalUnwrappedCopy": unwrapped_copy,
        "fullTextSha256": hashlib.sha256("".join(parser.all_text).encode()).hexdigest(),
    }


def main() -> int:
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--pptx", type=Path, default=ROOT / "slides/sources/Life_3.0_Chapter_4_Presentation.pptx")
    args = cli.parse_args()
    original_sha256 = hashlib.sha256(args.pptx.read_bytes()).hexdigest()
    raw = raw_slides(args.pptx)
    imported = json.loads((ROOT / "slides/imported-pptx.json").read_text())["chapter4"]
    frozen = json.loads((ROOT / "slides/content.source.json").read_text())
    design = json.loads((ROOT / "slides/design.json").read_text())
    export_parser = EmbeddedSlidesParser()
    export_parser.feed((ROOT / "dist/life3.html").read_text())
    exported = json.loads("".join(export_parser.parts))

    expected_ids = [f"chapter4-{number:02d}" for number in range(1, 14)]
    frozen_by_id = {slide["id"]: slide for slide in frozen}
    exported_by_id = {slide["id"]: slide for slide in exported}
    structure = {
        "rawSlideCount": len(raw),
        "importedSlideCount": len(imported),
        "deckSlideCount": len(frozen),
        "exportedSlideCount": len(exported),
        "chapter4IdsAtPositions36Through48": [slide["id"] for slide in frozen[35:48]],
        "exportedIdsAtPositions36Through48": [slide["id"] for slide in exported[35:48]],
        "allChapter4Ids": [slide["id"] for slide in frozen if slide["id"].startswith("chapter4-")],
        "allDesignedChapter4Ids": sorted(key for key in design if key.startswith("chapter4-")),
    }
    structure["passed"] = (
        len(raw) == len(imported) == 13
        and len(frozen) == len(exported) == 77
        and structure["chapter4IdsAtPositions36Through48"] == expected_ids
        and structure["exportedIdsAtPositions36Through48"] == expected_ids
        and structure["allChapter4Ids"] == expected_ids
        and structure["allDesignedChapter4Ids"] == expected_ids
    )

    slides = []
    for index, raw_slide in enumerate(raw):
        slide_id = f"chapter4-{index + 1:02d}"
        expected = [paragraph["text"] for paragraph in raw_slide["paragraphs"]]
        expected_runs = [paragraph["runs"] for paragraph in raw_slide["paragraphs"]]
        actual = imported_paragraphs(imported[index]) if index < len(imported) else []
        frozen_slide = frozen_by_id.get(slide_id, {})
        exported_slide = exported_by_id.get(slide_id, {})
        reference_parser = ParagraphHTMLParser(reference=True)
        reference_parser.feed(frozen_slide.get("html", ""))
        actual_reference = [paragraph["text"] for paragraph in reference_parser.paragraphs]
        imported_text_exact = [paragraph["text"] for paragraph in actual] == expected
        imported_runs_exact = [paragraph["runs"] for paragraph in actual] == expected_runs
        design_result = rendered_check(design.get(slide_id, ""), expected)
        export_result = rendered_check(exported_slide.get("html", ""), expected)
        notes_unchanged = not raw_slide["notes"] and (
            imported[index].get("notes", "") == frozen_slide.get("notes", "")
            == exported_slide.get("notes", "") == ""
        ) if index < len(imported) else False
        check = {
            "id": slide_id,
            "sourceOrder": index + 1,
            "deckOrder": index + 36,
            "sourceXmlPart": raw_slide["xmlPart"],
            "sourceParagraphCountIncludingEmpty": len(raw_slide["allParagraphs"]),
            "sourceNonemptyParagraphCount": len(expected),
            "sourceTextElementCount": raw_slide["textElementCount"],
            "sourceBreakCount": raw_slide["breakCount"],
            "sourceFieldCount": raw_slide["fieldCount"],
            "sourceTableCount": raw_slide["tableCount"],
            "sourceNotesPartCount": len(raw_slide["notes"]),
            "importedParagraphsExactlyMatch": imported_text_exact,
            "importedRunBoundariesAndWhitespaceExactlyMatch": imported_runs_exact,
            "frozenReferenceParagraphsExactlyMatch": actual_reference == expected,
            "notesExactlyMatch": notes_unchanged,
            "design": design_result,
            "export": export_result,
            "designAndExportFullTextExactlyMatch": design_result["fullTextSha256"] == export_result["fullTextSha256"],
        }
        if not imported_text_exact:
            check["importedParagraphDifferences"] = {"expected": expected, "actual": [p["text"] for p in actual]}
        check["passed"] = all([
            imported_text_exact, imported_runs_exact, actual_reference == expected,
            notes_unchanged, design_result["passed"], export_result["passed"],
            check["designAndExportFullTextExactlyMatch"],
        ])
        slides.append(check)

    last_text = [paragraph["text"] for paragraph in raw[-1]["paragraphs"]] if raw else []
    duplicate_footer = {
        "sourceFooterLabelOccurrences": last_text.count("LIFE 3.0  •  4-Р БҮЛЭГ"),
        "sourcePage13Occurrences": last_text.count("13"),
        "preservedByParagraphChecks": bool(slides and slides[-1]["passed"]),
    }
    duplicate_footer["passed"] = (
        duplicate_footer["sourceFooterLabelOccurrences"] == 2
        and duplicate_footer["sourcePage13Occurrences"] == 2
        and duplicate_footer["preservedByParagraphChecks"]
    )
    report = {
        "date": "2026-11-12",
        "sourceFile": str(args.pptx),
        "originalFileSha256": original_sha256,
        "expectedOriginalFileSha256": SOURCE_SHA256,
        "originalFileExactlyMatches": original_sha256 == SOURCE_SHA256,
        "comparison": "Independent raw ZIP/XML extraction in presentation relationship order. Exact Unicode strings and run boundaries; no whitespace, punctuation, case, or Unicode normalization. Blank source paragraphs contain no visible text and are excluded only after extraction.",
        "structure": structure,
        "duplicateFooterOnFinalSourceSlide": duplicate_footer,
        "slides": slides,
    }
    report["passed"] = (
        report["originalFileExactlyMatches"] and structure["passed"]
        and len(slides) == 13 and all(slide["passed"] for slide in slides)
        and duplicate_footer["passed"]
    )
    report_path = ROOT / "reports/chapter4-source-verification.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({
        "report": str(report_path.relative_to(ROOT)),
        "passed": report["passed"],
        "structurePassed": structure["passed"],
        "sourceSlideCount": len(raw),
        "failedSlides": [slide["id"] for slide in slides if not slide["passed"]],
    }, ensure_ascii=False, indent=2))
    return 0 if report["passed"] else 1


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (OSError, ValueError, KeyError, zipfile.BadZipFile, ET.ParseError) as error:
        print(f"Chapter 4 verification failed: {error}", file=sys.stderr)
        sys.exit(1)
