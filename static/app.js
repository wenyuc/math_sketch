const canvas = document.getElementById("drawing-canvas");
const layer = document.getElementById("geometry-layer");
const previewLayer = document.getElementById("preview-layer");
const emptyState = document.getElementById("empty-state");
const selectionStatus = document.getElementById("selection-status");
const canvasCount = document.getElementById("canvas-count");
const lineWidthInput = document.getElementById("line-width");
const lineWidthValue = document.getElementById("line-width-value");
const curveControls = document.getElementById("curve-controls");
const curveOpeningInput = document.getElementById("curve-opening");
const curveOpeningValue = document.getElementById("curve-opening-value");
const curveOpeningLabel = document.getElementById("curve-opening-label");
const curveLengthInput = document.getElementById("curve-length");
const curveLengthValue = document.getElementById("curve-length-value");
const curveLengthLabel = document.getElementById("curve-length-label");

const shapes = {
  point: {
    name: "点",
    markup: '<circle class="solid-dot" cx="0" cy="0" r="6"/><text x="12" y="-10">A</text>',
  },
  numberline: {
    name: "数轴",
    markup: '<path class="axis shape-no-fill" d="M-125 0H125m-10-8 10 8-10 8"/><path class="mark shape-no-fill" d="M-100-8v16m-50-8h200m-150-5v10m50-10v10m50-10v10m50-10v10"/><text x="-105" y="29">−2</text><text x="-55" y="29">−1</text><text x="-3" y="29">0</text><text x="47" y="29">1</text><text x="97" y="29">2</text>',
  },
  scalene: {
    name: "斜三角形",
    markup: '<polygon class="shape-fill" points="-90,72 -22,-78 92,72"/>',
  },
  isosceles: {
    name: "等腰三角形",
    markup: '<polygon class="shape-fill" points="-88,72 0,-78 88,72"/>',
  },
  equilateral: {
    name: "等边三角形",
    markup: '<polygon class="shape-fill" points="-87,50 0,-100 87,50"/>',
  },
  rightTriangle: {
    name: "直角三角形",
    markup: '<path class="shape-fill" d="M-85 75V-75L90 75Z"/><path class="shape-no-fill mark" d="M-85 55h20v20"/>',
  },
  rightIsosceles: {
    name: "等腰直角三角形",
    markup: '<path class="shape-fill" d="M-75 75V-75L75 75Z"/><path class="shape-no-fill mark" d="M-75 52h23v23"/>',
  },
  obtuseTriangle: {
    name: "钝角三角形",
    markup: '<path class="shape-fill" d="M-110 45L110 45 0-25Z"/>',
  },
  rectangle: {
    name: "矩形",
    markup: '<rect class="shape-fill" x="-100" y="-65" width="200" height="130"/>',
  },
  tallRectangle: {
    name: "高矩形",
    markup: '<rect class="shape-fill" x="-55" y="-90" width="110" height="180"/>',
  },
  square: {
    name: "正方形",
    markup: '<rect class="shape-fill" x="-75" y="-75" width="150" height="150"/>',
  },
  rightTrapezoid: {
    name: "直角梯形",
    markup: '<path class="shape-fill" d="M-85-70H40L85 70H-85Z"/>',
  },
  isoscelesTrapezoid: {
    name: "等腰梯形",
    markup: '<path class="shape-fill" d="M-52-70H52L90 70H-90Z"/>',
  },
  quadrilateral: {
    name: "一般凸四边形",
    markup: '<path class="shape-fill" d="M-90-48L32-78 93 48-40 78Z"/>',
  },
  circle: {
    name: "圆",
    markup: '<circle class="shape-fill" cx="0" cy="0" r="78"/>',
  },
  ellipse: {
    name: "椭圆",
    markup: '<ellipse class="shape-fill" cx="0" cy="0" rx="112" ry="66"/>',
  },
  ellipseVertical: {
    name: "椭圆（焦点在y轴）",
    markup: '<ellipse class="shape-fill" cx="0" cy="0" rx="66" ry="112"/>',
  },
  hyperbolaHorizontal: {
    name: "双曲线（焦点在x轴）",
    markup: "",
  },
  hyperbolaVertical: {
    name: "双曲线（焦点在y轴）",
    markup: "",
  },
  parabolaUp: {
    name: "向上抛物线",
    markup: '<path class="shape-no-fill" d="M-105 78Q0-150 105 78"/>',
  },
  parabolaDown: {
    name: "向下抛物线",
    markup: '<path class="shape-no-fill" d="M-105-78Q0 150 105-78"/>',
  },
  parabolaLeft: {
    name: "向左抛物线",
    markup: '<path class="shape-no-fill" d="M78-105Q-150 0 78 105"/>',
  },
  parabolaRight: {
    name: "向右抛物线",
    markup: '<path class="shape-no-fill" d="M-78-105Q150 0-78 105"/>',
  },
  coordinates: {
    name: "直角坐标系",
    markup: '<g class="axis-draggable geometry-part" data-axis="x"><path class="axis-hit" d="M-120 0H125"/><path class="axis shape-no-fill" d="M-120 0H125m-10-8 10 8-10 8"/><path class="mark shape-no-fill" d="M-100-5v10m20-5v-5m20 5v-5m20 5v-5m20 5v-5m20 5v-5m20 5v-5m20 5v-5m20 5v-5"/><text x="128" y="5">x</text></g><g class="axis-draggable geometry-part" data-axis="y"><path class="axis-hit" d="M0 95V-100"/><path class="axis shape-no-fill" d="M0 95V-100m-8 10 8-10 8 10"/><path class="mark shape-no-fill" d="M-5 80h10m-5-20h5m-5-20h5m-5-20h5m-5-20h5m-5-20h5m-5-20h5"/><text x="5" y="-105">y</text></g><circle class="solid-dot axis-origin" cx="0" cy="0" r="4"/>',
  },
};

const coordinateAxesMarkup = '<g class="geometry-part axis-draggable" data-axis="x" data-offset="0"><path class="axis-hit" d="M-145 0H145"/><path class="axis shape-no-fill" d="M-145 0H145m-8-6 8 6-8 6"/><path class="mark shape-no-fill" d="M-120-5v10m40-10v10m40-10v10m80-10v10m40-10v10"/><text class="axis-label" x="150" y="4">x</text></g><g class="geometry-part axis-draggable" data-axis="y" data-offset="0"><path class="axis-hit" d="M0 125V-125"/><path class="axis shape-no-fill" d="M0 125V-125m-6 8 6-8 6 8"/><path class="mark shape-no-fill" d="M-5-85h10m-10 40h10m-10 80h10m-10 40h10m-10 40h10"/><text class="axis-label" x="5" y="-130">y</text></g>';

let selected = null;
let selectedPart = null;
let nextId = 1;
let addOffset = 0;
let dragging = null;
let currentLineWidth = Number(lineWidthInput.value);
let lineToolActive = false;
let lineToolType = "segment";
let activeToolButton = null;
let lineFirstPoint = null;

function isParabola(type) {
  return type.startsWith("parabola");
}

function isHyperbola(type) {
  return type.startsWith("hyperbola");
}

function curveMarkup(type, opening, length) {
  if (isParabola(type)) {
    if (type === "parabolaUp") {
      return `<path class="shape-no-fill" d="M${-opening} ${length}Q0 ${-length} ${opening} ${length}"/>`;
    }
    if (type === "parabolaDown") {
      return `<path class="shape-no-fill" d="M${-opening} ${-length}Q0 ${length} ${opening} ${-length}"/>`;
    }
    if (type === "parabolaLeft") {
      return `<path class="shape-no-fill" d="M${length} ${-opening}Q${-length} 0 ${length} ${opening}"/>`;
    }
    return `<path class="shape-no-fill" d="M${-length} ${-opening}Q${length} 0 ${-length} ${opening}"/>`;
  }

  const focusDistance = 90;
  const transverseAxis = opening;
  const vertexDistance = Math.sqrt((focusDistance ** 2) - (transverseAxis ** 2));
  const maxParameter = 0.25 + (length / 100) * 0.85;
  const sampleCount = 64;
  const paths = [-1, 1].map((direction) => {
    const points = [];
    for (let index = 0; index <= sampleCount; index += 1) {
      const parameter = -maxParameter + ((2 * maxParameter * index) / sampleCount);
      const x = direction * vertexDistance * Math.cosh(parameter);
      const y = transverseAxis * Math.sinh(parameter);
      points.push(`${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return `<path class="shape-no-fill" d="${points.join("")}"/>`;
  }).join("");
  return type === "hyperbolaVertical" ? `<g transform="rotate(90)">${paths}</g>` : paths;
}

function updateCurveControls() {
  const curveSelected = selected && (isParabola(selected.dataset.type) || isHyperbola(selected.dataset.type));
  curveControls.hidden = !curveSelected;
  if (!curveSelected) return;

  curveOpeningInput.value = selected.dataset.opening;
  curveOpeningValue.value = selected.dataset.opening;
  const parabolaSelected = isParabola(selected.dataset.type);
  curveOpeningInput.min = parabolaSelected ? "30" : "20";
  curveOpeningInput.max = parabolaSelected ? "160" : "80";
  curveOpeningLabel.textContent = parabolaSelected ? "开口宽窄" : "开口宽窄（焦点固定）";
  curveLengthLabel.textContent = parabolaSelected ? "抛物线延伸长度" : "双曲线延伸长度";
  curveLengthInput.value = selected.dataset.length;
  curveLengthValue.value = selected.dataset.length;
}

function updateStatus() {
  const items = layer.querySelectorAll(".geometry");
  emptyState.classList.toggle("hidden", items.length > 0);
  canvasCount.textContent = `${items.length} 个图形`;
  if (lineToolActive) {
    const toolName = lineToolType === "dashSegment" ? "虚线段工具" : "线段工具";
    selectionStatus.textContent = lineFirstPoint
      ? `${toolName}：已确定第一个点，请点击第二个点`
      : `${toolName}：请在画布点击第一个点`;
  } else if (selected) {
    const partName = selectedPart?.dataset.axis === "x"
      ? "x 轴"
      : selectedPart?.dataset.axis === "y"
        ? "y 轴"
        : selectedPart?.dataset.part === "graph"
          ? selected.dataset.name
          : null;
    const hint = partName
      ? `${partName}已选中，拖动移动`
      : selected.dataset.type === "coordinates"
        ? "拖动图形移动，拖动坐标轴调整位置"
        : "拖动移动，滚轮缩放";
    selectionStatus.textContent = `已选中：${selected.dataset.name} · ${hint}`;
  } else {
    selectionStatus.textContent = items.length > 0
      ? "点击图形以选中，拖动移动"
      : "选择一个图形开始创作";
  }
}

function selectShape(element, part = null) {
  if (selected) {
    selected.classList.remove("is-selected", "has-part-selection");
  }
  if (selectedPart) selectedPart.classList.remove("is-part-selected");
  selected = element;
  selectedPart = part;
  if (selected) selected.classList.add("is-selected");
  if (selected) selected.classList.toggle("has-part-selection", Boolean(selectedPart));
  if (selectedPart) selectedPart.classList.add("is-part-selected");
  updateCurveControls();
  updateStatus();
}

function geometryMarkup(markup, withAxes) {
  return withAxes
    ? `<g class="geometry-part graph-part" data-part="graph" data-x="0" data-y="0">${markup}</g>${coordinateAxesMarkup}`
    : markup;
}

function createGeometry(type, name, markup, x, y, withAxes = false) {
  const opening = isHyperbola(type) ? 45 : 100;
  const length = 100;
  if (isParabola(type) || isHyperbola(type)) markup = curveMarkup(type, opening, length);
  markup = geometryMarkup(markup, withAxes);
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "geometry");
  group.dataset.id = String(nextId++);
  group.dataset.name = name;
  group.dataset.type = type;
  group.dataset.x = String(x);
  group.dataset.y = String(y);
  group.dataset.scale = "1";
  group.dataset.withAxes = String(withAxes);
  if (isParabola(type) || isHyperbola(type)) {
    group.dataset.opening = String(opening);
    group.dataset.length = String(length);
  }
  group.style.setProperty("--line-width", String(currentLineWidth));
  group.setAttribute("transform", `translate(${x} ${y})`);
  group.innerHTML = markup;
  layer.append(group);
  selectShape(group);
  return group;
}

function addShape(type, withAxes = false) {
  const definition = shapes[type];
  if (!definition) return;
  const bounds = canvas.viewBox.baseVal;
  const x = bounds.width * (0.36 + ((addOffset % 4) * 0.095));
  const y = bounds.height * (0.37 + ((addOffset % 3) * 0.11));
  addOffset += 1;
  createGeometry(type, definition.name, definition.markup, x, y, withAxes);
}

function setScale(element, scale) {
  const clampedScale = Math.min(3, Math.max(0.35, scale));
  element.dataset.scale = String(clampedScale);
  element.setAttribute("transform", `translate(${element.dataset.x} ${element.dataset.y}) scale(${clampedScale})`);
}

function pointInCanvas(event) {
  const point = canvas.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(canvas.getScreenCTM().inverse());
}

function pointInShape(element, point) {
  const scale = Number(element.dataset.scale);
  return {
    x: (point.x - Number(element.dataset.x)) / scale,
    y: (point.y - Number(element.dataset.y)) / scale,
  };
}

function axisPosition(element, axis, axisElement) {
  if (element.dataset.type === "coordinates") {
    return Number(axis === "x" ? element.dataset.axisY || 0 : element.dataset.axisX || 0);
  }
  return Number(axisElement.dataset.offset || 0);
}

function setAxisPosition(element, axis, value, axisElement = element.querySelector(`[data-axis="${axis}"]`)) {
  const offset = Math.max(-85, Math.min(85, value));
  axisElement.dataset.offset = String(offset);
  if (element.dataset.type === "coordinates") {
    if (axis === "x") {
      element.dataset.axisY = String(offset);
    } else {
      element.dataset.axisX = String(offset);
    }
  }
  if (axis === "x") {
    axisElement.setAttribute("transform", `translate(0 ${offset})`);
  } else {
    axisElement.setAttribute("transform", `translate(${offset} 0)`);
  }
  if (element.dataset.type === "coordinates") {
    const x = Number(element.dataset.axisX || 0);
    const y = Number(element.dataset.axisY || 0);
    element.querySelector(".axis-origin").setAttribute("transform", `translate(${x} ${y})`);
  }
}

function setPartPosition(part, x, y) {
  part.dataset.x = String(x);
  part.dataset.y = String(y);
  part.setAttribute("transform", `translate(${x} ${y})`);
}

function makeSegmentMarkup(type, first, second) {
  const centerX = (first.x + second.x) / 2;
  const centerY = (first.y + second.y) / 2;
  const p1x = first.x - centerX;
  const p1y = first.y - centerY;
  const p2x = second.x - centerX;
  const p2y = second.y - centerY;
  const dashClass = type === "dashSegment" ? " dashed-line" : "";
  return {
    x: centerX,
    y: centerY,
    markup: `<path class="shape-no-fill${dashClass}" d="M${p1x} ${p1y}L${p2x} ${p2y}"/><circle class="solid-dot" cx="${p1x}" cy="${p1y}" r="3"/><circle class="solid-dot" cx="${p2x}" cy="${p2y}" r="3"/>`,
  };
}

function updateLinePreview(point) {
  previewLayer.replaceChildren();
  if (!lineToolActive || !lineFirstPoint) return;
  const preview = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const dashClass = lineToolType === "dashSegment" ? " dashed-line" : "";
  preview.setAttribute("class", `line-preview${dashClass}`);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", `M${lineFirstPoint.x} ${lineFirstPoint.y}L${point.x} ${point.y}`);
  preview.append(path);
  for (const marker of [lineFirstPoint, point]) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", String(marker.x));
    circle.setAttribute("cy", String(marker.y));
    circle.setAttribute("r", "4");
    preview.append(circle);
  }
  previewLayer.append(preview);
}

function cancelLineTool() {
  lineToolActive = false;
  lineFirstPoint = null;
  if (activeToolButton) {
    activeToolButton.classList.remove("tool-active");
    activeToolButton.setAttribute("aria-pressed", "false");
    activeToolButton = null;
  }
  previewLayer.replaceChildren();
}

function activateLineTool(type, button) {
  if (lineToolActive && activeToolButton === button) {
    cancelLineTool();
    selectShape(null);
    return;
  }
  cancelLineTool();
  lineToolActive = true;
  lineToolType = type;
  activeToolButton = button;
  activeToolButton.classList.add("tool-active");
  activeToolButton.setAttribute("aria-pressed", "true");
  selectShape(null);
  updateStatus();
}

function installCoordinateButtons() {
  document.querySelectorAll("#shape-grid [data-coordinate-option]").forEach((shapeButton) => {
    const item = document.createElement("div");
    item.className = "shape-item has-axes";
    shapeButton.before(item);
    item.append(shapeButton);

    const shapeName = shapeButton.querySelector("span:last-child").textContent;
    const axesButton = document.createElement("button");
    axesButton.type = "button";
    axesButton.className = "axes-add-button";
    axesButton.dataset.addWithAxes = shapeButton.dataset.shape;
    axesButton.title = `添加带直角坐标系的${shapeName}`;
    axesButton.setAttribute("aria-label", axesButton.title);
    axesButton.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 15h13m-4-4 4 4-4 4M6 17V3m-3 3 3-3 3 3"/></svg>';
    item.append(axesButton);
  });
}

installCoordinateButtons();

document.getElementById("shape-grid").addEventListener("click", (event) => {
  const axesButton = event.target.closest("[data-add-with-axes]");
  if (axesButton) {
    cancelLineTool();
    addShape(axesButton.dataset.addWithAxes, true);
    return;
  }

  const button = event.target.closest("[data-shape]");
  if (!button) return;
  if (button.dataset.shape === "segment" || button.dataset.shape === "dashSegment") {
    activateLineTool(button.dataset.shape, button);
    return;
  }
  cancelLineTool();
  addShape(button.dataset.shape);
});

canvas.addEventListener("pointerdown", (event) => {
  const point = pointInCanvas(event);
  if (lineToolActive) {
    if (!lineFirstPoint) {
      lineFirstPoint = point;
      updateLinePreview(point);
      updateStatus();
    } else if (Math.hypot(point.x - lineFirstPoint.x, point.y - lineFirstPoint.y) < 2) {
      selectionStatus.textContent = "请点击与第一个点不同的位置";
    } else {
      const segment = makeSegmentMarkup(lineToolType, lineFirstPoint, point);
      const name = lineToolType === "dashSegment" ? "虚线段" : "线段";
      createGeometry(lineToolType, name, segment.markup, segment.x, segment.y);
      cancelLineTool();
      updateStatus();
    }
    event.preventDefault();
    return;
  }

  const axisTarget = event.target.closest(".axis-draggable");
  const partTarget = event.target.closest(".geometry-part");
  const target = event.target.closest(".geometry");
  if (!target) {
    selectShape(null);
    return;
  }
  selectShape(target, partTarget || axisTarget);
  if (axisTarget) {
    const axis = axisTarget.dataset.axis;
    const localPoint = pointInShape(target, point);
    dragging = {
      element: target,
      axisElement: axisTarget,
      axis,
      startPointer: axis === "x" ? localPoint.y : localPoint.x,
      startOffset: axisPosition(target, axis, axisTarget),
    };
  } else if (partTarget?.dataset.part === "graph") {
    const localPoint = pointInShape(target, point);
    dragging = {
      element: target,
      part: partTarget,
      dx: localPoint.x - Number(partTarget.dataset.x || 0),
      dy: localPoint.y - Number(partTarget.dataset.y || 0),
    };
  } else {
    dragging = {
      element: target,
      dx: point.x - Number(target.dataset.x),
      dy: point.y - Number(target.dataset.y),
    };
  }
  canvas.setPointerCapture(event.pointerId);
  event.preventDefault();
});

canvas.addEventListener("pointermove", (event) => {
  const point = pointInCanvas(event);
  if (lineToolActive && lineFirstPoint) updateLinePreview(point);
  if (!dragging) return;

  if (dragging.axis) {
    const localPoint = pointInShape(dragging.element, point);
    const currentPointer = dragging.axis === "x" ? localPoint.y : localPoint.x;
    setAxisPosition(
      dragging.element,
      dragging.axis,
      dragging.startOffset + currentPointer - dragging.startPointer,
      dragging.axisElement,
    );
    return;
  }
  if (dragging.part) {
    const localPoint = pointInShape(dragging.element, point);
    setPartPosition(dragging.part, localPoint.x - dragging.dx, localPoint.y - dragging.dy);
    return;
  }
  dragging.element.dataset.x = String(point.x - dragging.dx);
  dragging.element.dataset.y = String(point.y - dragging.dy);
  setScale(dragging.element, Number(dragging.element.dataset.scale));
});

function stopDragging() {
  dragging = null;
}
canvas.addEventListener("pointerup", stopDragging);
canvas.addEventListener("pointercancel", stopDragging);

canvas.addEventListener("wheel", (event) => {
  if (lineToolActive) return;
  const target = event.target.closest(".geometry");
  if (!target) return;
  event.preventDefault();
  selectShape(target);
  const factor = event.deltaY < 0 ? 1.08 : 1 / 1.08;
  setScale(target, Number(target.dataset.scale) * factor);
}, { passive: false });

lineWidthInput.addEventListener("input", () => {
  currentLineWidth = Number(lineWidthInput.value);
  lineWidthValue.value = String(currentLineWidth);
  layer.querySelectorAll(".geometry").forEach((shape) => {
    shape.style.setProperty("--line-width", String(currentLineWidth));
  });
});

function updateSelectedCurve() {
  if (!selected || (!isParabola(selected.dataset.type) && !isHyperbola(selected.dataset.type))) return;
  selected.dataset.opening = curveOpeningInput.value;
  curveOpeningValue.value = curveOpeningInput.value;
  selected.dataset.length = curveLengthInput.value;
  curveLengthValue.value = curveLengthInput.value;
  const markup = curveMarkup(
    selected.dataset.type,
    Number(selected.dataset.opening),
    Number(selected.dataset.length),
  );
  if (selected.dataset.withAxes === "true") {
    selected.querySelector(".graph-part").innerHTML = markup;
  } else {
    selected.innerHTML = markup;
  }
}

curveOpeningInput.addEventListener("input", updateSelectedCurve);
curveLengthInput.addEventListener("input", updateSelectedCurve);

document.getElementById("scale-up").addEventListener("click", () => {
  if (selected) setScale(selected, Number(selected.dataset.scale) * 1.15);
});
document.getElementById("scale-down").addEventListener("click", () => {
  if (selected) setScale(selected, Number(selected.dataset.scale) / 1.15);
});
document.getElementById("delete-shape").addEventListener("click", () => {
  if (!selected) return;
  selected.remove();
  selectShape(null);
});
document.getElementById("clear-canvas").addEventListener("click", () => {
  cancelLineTool();
  layer.replaceChildren();
  selectShape(null);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    cancelLineTool();
    selectShape(null);
  }
  if ((event.key === "Delete" || event.key === "Backspace") && selected && !lineToolActive) {
    selected.remove();
    selectShape(null);
  }
});

updateStatus();
