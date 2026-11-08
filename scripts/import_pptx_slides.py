#!/usr/bin/env python3
"""Convert selected PowerPoint slide content into the presentation's JSON format."""

from __future__ import annotations

import argparse
import json
import math
import posixpath
import re
import shutil
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


P = "http://schemas.openxmlformats.org/presentationml/2006/main"
A = "http://schemas.openxmlformats.org/drawingml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS = {"p": P, "a": A, "r": R}
EMU_PER_INCH = 914400
STAGE_W = 1920
STAGE_H = 1080

PALETTE = {
    "dk1": "#E8EDF5",
    "lt1": "#0A0F1E",
    "dk2": "#A9BBD3",
    "lt2": "#111B31",
    "tx1": "#E8EDF5",
    "bg1": "#0A0F1E",
    "tx2": "#A9BBD3",
    "bg2": "#111B31",
    "accent1": "#60A5FA",
    "accent2": "#A78BFA",
    "accent3": "#22D3EE",
    "accent4": "#34D399",
    "accent5": "#FBBF24",
    "accent6": "#F472B6",
    "hlink": "#93C5FD",
    "folHlink": "#C4B5FD",
}


def local(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def color_luminance(color: str) -> float:
    raw = color.lstrip("#")
    try:
        r, g, b = (int(raw[i : i + 2], 16) / 255 for i in (0, 2, 4))
    except ValueError:
        return 0

    def channel(c: float) -> float:
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)


def mapped_color(raw: str, usage: str) -> str:
    color = raw.upper().lstrip("#")
    text_exact = {
        "000000": "#E8EDF5",
        "1F2937": "#E8EDF5",
        "0B1F3A": "#E8EDF5",
        "1F497D": "#E8EDF5",
        "073E87": "#93C5FD",
        "041069": "#93C5FD",
        "131FA8": "#93C5FD",
        "6866E1": "#A78BFA",
        "5527F5": "#A78BFA",
        "9B60EB": "#C4B5FD",
        "BF78FE": "#D8B4FE",
        "0E9AA7": "#2DD4BF",
        "6B7280": "#A9BBD3",
        "A9BBD3": "#A9BBD3",
        "FFFFFF": "#E8EDF5",
    }
    if usage == "text":
        if color in text_exact:
            return text_exact[color]
        lum = color_luminance(color)
        if lum < 0.32:
            return "#E8EDF5"
        if lum < 0.58:
            return "#A9BBD3"
        return f"#{color}"

    if usage == "fill":
        fill_exact = {
            "FFFFFF": "#111B31",
            "F8FAFC": "#111B31",
            "F3F6FA": "#111B31",
            "EEECE1": "#111B31",
            "E5E7EB": "#162238",
            "EBEBEB": "#162238",
            "E7E6E6": "#162238",
            "EEEEEE": "#162238",
            "DADADA": "#1A2942",
            "CBD5E1": "#1A2942",
            "000000": "#0F1629",
            "0B1F3A": "#111B31",
            "1F2937": "#111B31",
        }
        if color in fill_exact:
            return fill_exact[color]
        if color_luminance(color) > 0.88:
            return "#17243A"
        return f"#{color}"

    if color in {"000000", "1F2937", "0B1F3A", "1F497D"}:
        return "rgba(148, 163, 184, 0.42)"
    if color == "FFFFFF":
        return "rgba(148, 163, 184, 0.65)"
    return f"#{color}"


def emu(value: str | int | None, scale: float) -> float:
    try:
        return float(value) * scale
    except (TypeError, ValueError):
        return 0.0


def resolve_relationships(archive: zipfile.ZipFile, rel_path: str) -> dict[str, tuple[str, str]]:
    if rel_path not in archive.namelist():
        return {}
    root = ET.fromstring(archive.read(rel_path))
    base_dir = posixpath.dirname(posixpath.dirname(rel_path))
    result = {}
    for rel in root:
        target = rel.attrib.get("Target", "")
        mode = rel.attrib.get("TargetMode", "")
        resolved = target if mode == "External" else posixpath.normpath(posixpath.join(base_dir, target))
        result[rel.attrib["Id"]] = (resolved, rel.attrib.get("Type", ""))
    return result


def scheme_color(fill: ET.Element | None, usage: str) -> str | None:
    if fill is None:
        return None
    color_node = next((child for child in fill if local(child.tag) in ("srgbClr", "schemeClr", "sysClr", "prstClr")), None)
    if color_node is None:
        return None
    kind = local(color_node.tag)
    if kind == "schemeClr":
        value = color_node.attrib.get("val", "")
        mapped = PALETTE.get(value, "#A9BBD3" if usage == "text" else "#111B31")
        alpha_node = color_node.find("a:alpha", NS)
        if alpha_node is not None:
            alpha = int(alpha_node.attrib.get("val", "100000")) / 100000
            if alpha < 0.999:
                c = mapped.lstrip("#")
                r, g, b = (int(c[i : i + 2], 16) for i in (0, 2, 4))
                return f"rgba({r}, {g}, {b}, {alpha:.3f})"
        return mapped
    value = color_node.attrib.get("val", color_node.attrib.get("lastClr", "000000"))
    mapped = mapped_color(value, usage)
    alpha_node = color_node.find("a:alpha", NS)
    if alpha_node is not None:
        alpha = int(alpha_node.attrib.get("val", "100000")) / 100000
        if alpha < 0.999:
            c = mapped.lstrip("#")
            if len(c) == 6:
                r, g, b = (int(c[i : i + 2], 16) for i in (0, 2, 4))
                return f"rgba({r}, {g}, {b}, {alpha:.3f})"
    return mapped


def fill_style(parent: ET.Element | None, usage: str) -> str | None:
    if parent is None:
        return None
    solid = next((e for e in parent if local(e.tag) == "solidFill"), None)
    if solid is not None:
        return scheme_color(solid, usage)
    grad = next((e for e in parent if local(e.tag) == "gradFill"), None)
    if grad is not None:
        stops = []
        for stop in grad.findall("a:gsLst/a:gs", NS):
            color = scheme_color(stop, usage)
            if color:
                pos = int(stop.attrib.get("pos", "0")) / 1000
                stops.append(f"{color} {pos:g}%")
        if stops:
            lin = grad.find("a:lin", NS)
            angle = int(lin.attrib.get("ang", "0")) / 60000 if lin is not None else 0
            return f"linear-gradient({(angle + 90) % 360:g}deg, {', '.join(stops)})"
    if any(local(e.tag) == "noFill" for e in parent):
        return None
    return None


def transform_from_xfrm(xfrm: ET.Element | None, scale_x: float, scale_y: float, offset_x: float, offset_y: float) -> tuple[dict, float, float]:
    if xfrm is None:
        return {"x": 0, "y": 0, "w": 0, "h": 0}, scale_x, scale_y
    off = xfrm.find("a:off", NS)
    ext = xfrm.find("a:ext", NS)
    if off is None or ext is None:
        return {"x": 0, "y": 0, "w": 0, "h": 0}, scale_x, scale_y
    rect = {
        "x": offset_x + int(off.attrib.get("x", "0")) * scale_x,
        "y": offset_y + int(off.attrib.get("y", "0")) * scale_y,
        "w": int(ext.attrib.get("cx", "0")) * scale_x,
        "h": int(ext.attrib.get("cy", "0")) * scale_y,
    }
    rot = xfrm.attrib.get("rot")
    if rot:
        rect["rotation"] = round(int(rot) / 60000, 4)
    if xfrm.attrib.get("flipH") == "1":
        rect["flipH"] = True
    if xfrm.attrib.get("flipV") == "1":
        rect["flipV"] = True
    return rect, scale_x, scale_y


def para_align(ppr: ET.Element | None) -> str:
    value = ppr.attrib.get("algn", "l") if ppr is not None else "l"
    return {"l": "left", "ctr": "center", "r": "right", "just": "justify", "dist": "justify"}.get(value, "left")


def run_style(rpr: ET.Element | None, default_rpr: ET.Element | None, px_scale: float, base_color: str = "#E8EDF5") -> dict:
    chosen = rpr if rpr is not None else default_rpr
    style: dict = {"fontFamily": "IBM Plex Sans", "color": base_color}
    if chosen is not None:
        size = chosen.attrib.get("sz")
        if size:
            # DrawingML stores font sizes in hundredths of a point.
            style["fontSize"] = round((int(size) / 100) * 12700 * px_scale, 2)
        if chosen.attrib.get("b") == "1":
            style["fontWeight"] = 700
        elif chosen.attrib.get("b") == "0":
            style["fontWeight"] = 400
        if chosen.attrib.get("i") == "1":
            style["fontStyle"] = "italic"
        if chosen.attrib.get("u") not in (None, "none"):
            style["textDecoration"] = "underline"
        solid = chosen.find("a:solidFill", NS)
        color = scheme_color(solid, "text")
        if color:
            style["color"] = color
    return style


def parse_text_body(tx_body: ET.Element | None, scale_x: float, scale_y: float, shape_font_scale: float = 1.0) -> dict | None:
    if tx_body is None:
        return None
    body = tx_body.find("a:bodyPr", NS)
    body_data = {
        "paddingLeft": emu(body.attrib.get("lIns", 0) if body is not None else 0, scale_x),
        "paddingRight": emu(body.attrib.get("rIns", 0) if body is not None else 0, scale_x),
        "paddingTop": emu(body.attrib.get("tIns", 0) if body is not None else 0, scale_y),
        "paddingBottom": emu(body.attrib.get("bIns", 0) if body is not None else 0, scale_y),
        "anchor": {"t": "top", "ctr": "middle", "b": "bottom"}.get(body.attrib.get("anchor", "t") if body is not None else "t", "top"),
        "autoFit": body is not None and (body.find("a:spAutoFit", NS) is not None or body.find("a:normAutofit", NS) is not None),
    }
    if body is not None:
        norm = body.find("a:normAutofit", NS)
        if norm is not None and norm.attrib.get("fontScale"):
            shape_font_scale *= int(norm.attrib["fontScale"]) / 100000
    paragraphs = []
    list_style = tx_body.find("a:lstStyle/a:lvl1pPr/a:defRPr", NS)
    for p in tx_body.findall("a:p", NS):
        ppr = p.find("a:pPr", NS)
        default_rpr = ppr.find("a:defRPr", NS) if ppr is not None else None
        if default_rpr is None:
            default_rpr = list_style
        margin_left = emu(ppr.attrib.get("marL", 0) if ppr is not None else 0, scale_x)
        indent = emu(ppr.attrib.get("indent", 0) if ppr is not None else 0, scale_x)
        bullet = ""
        if ppr is not None:
            bullet_node = next((c for c in ppr if local(c.tag) == "buChar"), None)
            if bullet_node is not None:
                bullet = bullet_node.attrib.get("char", "•") + " "
            elif any(local(c.tag) == "buAutoNum" for c in ppr):
                bullet = "• "
        runs = []
        for child in list(p):
            name = local(child.tag)
            if name in ("r", "fld"):
                rpr = child.find("a:rPr", NS)
                text_node = child.find("a:t", NS)
                if text_node is not None and text_node.text is not None:
                    style = run_style(rpr, default_rpr, scale_x, "#E8EDF5")
                    if shape_font_scale != 1:
                        style["fontSize"] = round(style.get("fontSize", 28) * shape_font_scale, 2)
                    runs.append({"text": text_node.text, "style": style})
            elif name == "br":
                runs.append({"text": "\n", "style": run_style(child.find("a:rPr", NS), default_rpr, scale_x)})
        if runs or bullet:
            paragraphs.append({"align": para_align(ppr), "marginLeft": margin_left, "indent": indent, "bullet": bullet, "runs": runs})
    return {"body": body_data, "paragraphs": paragraphs}


def shape_preset(sp: ET.Element) -> str:
    prst = sp.find("p:spPr/a:prstGeom", NS)
    if prst is None:
        return "rect"
    return prst.attrib.get("prst", "rect")


def line_style(sp_pr: ET.Element | None, scale_x: float) -> tuple[str | None, float]:
    if sp_pr is None:
        return None, 1
    line = sp_pr.find("a:ln", NS)
    if line is None or line.find("a:noFill", NS) is not None:
        return None, 1
    color = scheme_color(line.find("a:solidFill", NS), "line")
    width = emu(line.attrib.get("w", 6350), scale_x)
    return color or "rgba(96, 165, 250, 0.55)", max(1, width)


def get_shape_xfrm(shape: ET.Element) -> ET.Element | None:
    sp_pr = shape.find("p:spPr", NS)
    if sp_pr is not None:
        xfrm = sp_pr.find("a:xfrm", NS)
        if xfrm is not None:
            return xfrm
    return shape.find("p:xfrm", NS)


def relationship_image(relations: dict[str, tuple[str, str]], rid: str | None) -> str | None:
    if not rid or rid not in relations:
        return None
    target, typ = relations[rid]
    if not typ.endswith("/image") or target.startswith("http"):
        return None
    return target


def image_crop(blip_fill: ET.Element | None) -> tuple[str, str]:
    src = blip_fill.find("a:srcRect", NS) if blip_fill is not None else None
    if src is None:
        return "cover", "50% 50%"
    left = int(src.attrib.get("l", "0")) / 1000
    right = int(src.attrib.get("r", "0")) / 1000
    top = int(src.attrib.get("t", "0")) / 1000
    bottom = int(src.attrib.get("b", "0")) / 1000
    x = 100 * left / max(0.001, left + right) if left + right else 50
    y = 100 * top / max(0.001, top + bottom) if top + bottom else 50
    return "cover", f"{x:.1f}% {y:.1f}%"


class DeckConverter:
    def __init__(self, deck_id: str, section: str, pptx: Path, output_assets: Path, first_slide: int = 1, last_slide: int | None = None):
        self.deck_id = deck_id
        self.section = section
        self.pptx = pptx
        self.output_assets = output_assets
        self.first_slide = first_slide
        self.last_slide = last_slide
        self.archive = zipfile.ZipFile(pptx)
        self.current_layout_placeholders: dict[tuple[str, str], ET.Element] = {}
        presentation = ET.fromstring(self.archive.read("ppt/presentation.xml"))
        size = presentation.find("p:sldSz", NS)
        self.width_emu = int(size.attrib["cx"])
        self.height_emu = int(size.attrib["cy"])
        self.sx = STAGE_W / self.width_emu
        self.sy = STAGE_H / self.height_emu
        rels = resolve_relationships(self.archive, "ppt/_rels/presentation.xml.rels")
        self.slide_paths = []
        for slide_id in presentation.find("p:sldIdLst", NS):
            rid = slide_id.attrib[f"{{{R}}}id"]
            self.slide_paths.append(rels[rid][0])
        self.media_names: dict[str, str] = {}

    def extract_image(self, part_path: str) -> str:
        if part_path in self.media_names:
            return self.media_names[part_path]
        suffix = Path(part_path).suffix.lower()
        if suffix not in (".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"):
            suffix = ".png"
        filename = f"{Path(part_path).stem}{suffix}"
        relative = Path(self.deck_id) / filename
        destination = self.output_assets / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(self.archive.read(part_path))
        src = "/slides/imported/" + relative.as_posix()
        self.media_names[part_path] = src
        return src

    def notes_for(self, slide_path: str) -> str:
        rel_path = posixpath.join("ppt/slides/_rels", posixpath.basename(slide_path) + ".rels")
        relations = resolve_relationships(self.archive, rel_path)
        notes_part = next((part for part, typ in relations.values() if typ.endswith("/notesSlide")), None)
        if not notes_part or notes_part not in self.archive.namelist():
            return ""
        root = ET.fromstring(self.archive.read(notes_part))
        content = []
        for shape in root.findall(".//p:sp", NS):
            placeholder = shape.find(".//p:ph", NS)
            if placeholder is None or placeholder.attrib.get("type") != "body":
                continue
            for para in shape.findall("./p:txBody/a:p", NS):
                text = "".join(t.text or "" for t in para.findall(".//a:t", NS)).strip()
                if text and not re.fullmatch(r"\d+", text):
                    content.append(text)
        return "\n".join(content)

    def parse_shape_tree(self, parent: ET.Element, relations: dict, nodes: list, path: str, ox: float = 0, oy: float = 0, gx: float = 1, gy: float = 1):
        for shape in list(parent):
            tag = local(shape.tag)
            if tag == "grpSp":
                xfrm = shape.find("p:grpSpPr/a:xfrm", NS)
                if xfrm is None:
                    self.parse_shape_tree(shape, relations, nodes, path, ox, oy, gx, gy)
                    continue
                off = xfrm.find("a:off", NS); ext = xfrm.find("a:ext", NS)
                child_off = xfrm.find("a:chOff", NS); child_ext = xfrm.find("a:chExt", NS)
                if None in (off, ext, child_off, child_ext):
                    self.parse_shape_tree(shape, relations, nodes, path, ox, oy, gx, gy)
                    continue
                group_sx = int(ext.attrib["cx"]) / max(1, int(child_ext.attrib["cx"]))
                group_sy = int(ext.attrib["cy"]) / max(1, int(child_ext.attrib["cy"]))
                nox = ox + gx * int(off.attrib["x"]) - gx * group_sx * int(child_off.attrib["x"])
                noy = oy + gy * int(off.attrib["y"]) - gy * group_sy * int(child_off.attrib["y"])
                self.parse_shape_tree(shape, relations, nodes, path, nox, noy, gx * group_sx, gy * group_sy)
                continue
            if tag == "sp":
                self.parse_sp(shape, relations, nodes, path, ox, oy, gx, gy)
            elif tag == "pic":
                self.parse_pic(shape, relations, nodes, path, ox, oy, gx, gy)
            elif tag == "cxnSp":
                self.parse_sp(shape, relations, nodes, path, ox, oy, gx, gy, connector=True)
            elif tag == "graphicFrame":
                self.parse_graphic_frame(shape, nodes, ox, oy, gx, gy)

    def parse_sp(self, sp: ET.Element, relations: dict, nodes: list, path: str, ox: float, oy: float, gx: float, gy: float, connector: bool = False):
        nv = sp.find("p:nvSpPr/p:cNvPr", NS) if not connector else sp.find("p:nvCxnSpPr/p:cNvPr", NS)
        name = nv.attrib.get("name", "Shape") if nv is not None else "Shape"
        shape_id = nv.attrib.get("id", str(len(nodes))) if nv is not None else str(len(nodes))
        ph = sp.find("p:nvSpPr/p:nvPr/p:ph", NS) if not connector else sp.find("p:nvCxnSpPr/p:nvPr/p:ph", NS)
        if ph is not None and ph.attrib.get("type") == "sldNum":
            return
        xfrm = get_shape_xfrm(sp)
        if xfrm is None and ph is not None:
            key = (ph.attrib.get("type", "obj"), ph.attrib.get("idx", "0"))
            xfrm = self.current_layout_placeholders.get(key)
        local_rect, _, _ = transform_from_xfrm(xfrm, gx, gy, ox, oy)
        if not local_rect["w"] and not local_rect["h"]:
            return
        sp_pr = sp.find("p:spPr", NS)
        preset = "line" if connector else shape_preset(sp)
        fill = fill_style(sp_pr, "fill")
        stroke, stroke_width = line_style(sp_pr, self.sx * gx)
        blip_fill = sp_pr.find("a:blipFill", NS) if sp_pr is not None else None
        if blip_fill is not None:
            blip = blip_fill.find("a:blip", NS)
            src_part = relationship_image(relations, blip.attrib.get(f"{{{R}}}embed") if blip is not None else None)
            if src_part:
                fit, pos = image_crop(blip_fill)
                nodes.append({"kind": "image", "rect": local_rect, "src": self.extract_image(src_part), "id": f"{self.deck_id}-{shape_id}-image", "alt": name, "fit": fit, "objectPosition": pos, "rotation": local_rect.get("rotation")})
        elif fill:
            nodes.append({"kind": "shape", "rect": local_rect, "preset": preset, "fill": fill, "stroke": stroke, "strokeWidth": round(stroke_width, 2), "id": f"{self.deck_id}-{shape_id}"})
        tx_body = sp.find("p:txBody", NS)
        if tx_body is not None:
            text = parse_text_body(tx_body, self.sx * gx, self.sy * gy)
            if text and text["paragraphs"]:
                rotation = local_rect.get("rotation")
                nodes.append({"kind": "text", "rect": {k:v for k,v in local_rect.items() if k in ("x","y","w","h")}, "text": text, "id": f"{self.deck_id}-{shape_id}-text", "rotation": rotation})

    def parse_pic(self, pic: ET.Element, relations: dict, nodes: list, path: str, ox: float, oy: float, gx: float, gy: float):
        nv = pic.find("p:nvPicPr/p:cNvPr", NS)
        name = nv.attrib.get("name", "Image") if nv is not None else "Image"
        alt = nv.attrib.get("descr", "") if nv is not None else ""
        shape_id = nv.attrib.get("id", str(len(nodes))) if nv is not None else str(len(nodes))
        xfrm = pic.find("p:spPr/a:xfrm", NS)
        rect, _, _ = transform_from_xfrm(xfrm, gx, gy, ox, oy)
        blip_fill = pic.find("p:blipFill", NS)
        blip = blip_fill.find("a:blip", NS) if blip_fill is not None else None
        src_part = relationship_image(relations, blip.attrib.get(f"{{{R}}}embed") if blip is not None else None)
        if not src_part or not rect["w"] or not rect["h"]:
            return
        fit, pos = image_crop(blip_fill)
        nodes.append({"kind": "image", "rect": rect, "src": self.extract_image(src_part), "id": f"{self.deck_id}-{shape_id}", "alt": alt or name, "fit": fit, "objectPosition": pos, "rotation": rect.get("rotation")})

    def parse_graphic_frame(self, frame: ET.Element, nodes: list, ox: float, oy: float, gx: float, gy: float):
        table = frame.find(".//a:tbl", NS)
        if table is None:
            return
        xfrm = frame.find("p:xfrm", NS)
        rect, _, _ = transform_from_xfrm(xfrm, gx, gy, ox, oy)
        grid = [emu(col.attrib.get("w", 0), self.sx * gx) for col in table.findall("a:tblGrid/a:gridCol", NS)]
        rows = []
        for row in table.findall("a:tr", NS):
            height = emu(row.attrib.get("h", 0), self.sy * gy)
            cells = []
            for cell in row.findall("a:tc", NS):
                text = parse_text_body(cell.find("a:txBody", NS), self.sx * gx, self.sy * gy)
                props = cell.find("a:tcPr", NS)
                fill = fill_style(props, "fill") or "#111B31"
                cells.append({"text": text, "fill": fill})
            rows.append({"h": height, "cells": cells})
        nodes.append({"kind": "table", "rect": rect, "cols": grid, "rows": rows, "id": f"{self.deck_id}-table-{len(nodes)}"})

    def convert(self) -> list[dict]:
        slides = []
        end = min(len(self.slide_paths), self.last_slide or len(self.slide_paths))
        for source_index in range(self.first_slide, end + 1):
            path = self.slide_paths[source_index - 1]
            root = ET.fromstring(self.archive.read(path))
            relpath = posixpath.join("ppt/slides/_rels", posixpath.basename(path) + ".rels")
            relations = resolve_relationships(self.archive, relpath)
            layout_part = next((part for part, typ in relations.values() if typ.endswith("/slideLayout")), None)
            self.current_layout_placeholders = {}
            if layout_part and layout_part in self.archive.namelist():
                layout = ET.fromstring(self.archive.read(layout_part))
                for placeholder in layout.findall(".//p:sp", NS):
                    ph = placeholder.find("p:nvSpPr/p:nvPr/p:ph", NS)
                    if ph is None:
                        continue
                    key = (ph.attrib.get("type", "obj"), ph.attrib.get("idx", "0"))
                    xfrm = get_shape_xfrm(placeholder)
                    if xfrm is not None:
                        self.current_layout_placeholders[key] = xfrm
            shape_tree = root.find("p:cSld/p:spTree", NS)
            nodes = []
            if shape_tree is not None:
                self.parse_shape_tree(shape_tree, relations, nodes, path, 0, 0, self.sx, self.sy)
            slides.append({
                "sourceSlide": source_index,
                "background": {"color": "#0A0F1E"},
                "nodes": nodes,
                "notes": self.notes_for(path),
            })
        return slides


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--chapter3", type=Path, required=True)
    parser.add_argument("--chapter4", type=Path, required=True)
    parser.add_argument("--chapter6", type=Path, required=True)
    parser.add_argument("--consciousness", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path("slides/imported-pptx.json"))
    parser.add_argument("--assets", type=Path, default=Path("public/slides/imported"))
    args = parser.parse_args()

    decks = [
        ("chapter3", "3-р бүлэг", args.chapter3, 1, 10),
        ("chapter4", "4-р бүлэг", args.chapter4, 1, None),
        ("chapter6", "6-р бүлэг", args.chapter6, 1, None),
        ("consciousness", "Ухамсар", args.consciousness, 1, None),
    ]
    data = {}
    if args.assets.exists():
        shutil.rmtree(args.assets)
    for deck_id, section, pptx, first, last in decks:
        converter = DeckConverter(deck_id, section, pptx, args.assets, first, last)
        data[deck_id] = converter.convert()
        converter.archive.close()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print("Wrote", args.output, "with", sum(map(len, data.values())), "slides")
    print("Extracted image assets to", args.assets)


if __name__ == "__main__":
    main()
