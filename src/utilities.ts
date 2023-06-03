import {Geometry} from "@harrisontaee/library";
import {Skia} from "@shopify/react-native-skia";

import {CELLS_PER_ROW, CELL_SIZE, Cell, Diff, Grid, Path, Point, Segment, Selected} from "./constants";

export const getSegments = (path: Path): Segment[] => {
	const skPath = Skia.Path.MakeFromSVGString(path.path);
	if (!skPath) return [];

	const segments: Segment[] = [];
	const points = skPath.countPoints();
	const width = path.width;
	let a = skPath.getPoint(0);

	for (let i = 1; i < points; i++) {
		const b = skPath.getPoint(i);
		if (!b) break;
		segments.push([[a.x / width, a.y / width], [b.x / width, b.y / width]]);
		a = b;
	};

	return segments;
};





export const getCellsIntersectingSegment = (a: Point, b: Point): Cell[] => {
	const dx = b[0] - a[0],
			dy = b[1] - a[1];

	let [row, col] = getCell(a);
	const [endRow, endCol] = getCell(b);
	const cells: Cell[] = [[row, col]];

	while (row !== endRow || col !== endCol) {
		const tl: Point = [col * CELL_SIZE, row * CELL_SIZE],
				tr: Point = [tl[0] + CELL_SIZE, tl[1]],
				bl: Point = [tl[0], tl[1] + CELL_SIZE],
				br: Point = [tl[0] + CELL_SIZE, tl[1] + CELL_SIZE];

		if (dx === 0) {
			if (dy > 0) row++;
			else row--;
		} else if (dy === 0) {
			if (dx > 0) col++;
			else col--;
		} else if (dx > 0) {
			let intersect = getSegmentsIntersection(a, b, tr, br);
			if (intersect) {
				col++;
				if (intersect[0] === tr[0]) {
					if (intersect[1] === tr[1]) row--;
					else if (intersect[1] === br[1]) row++;
				};
			} else if (dy > 0) row++;
			else row--;
		} else {
			let intersect = getSegmentsIntersection(a, b, tl, bl);
			if (intersect) {
				col--;
				if (intersect[0] === tl[0]) {
					if (intersect[1] === tl[1]) row--;
					else if (intersect[1] === bl[1]) row++;
				};
			} else if (dy > 0) row++;
			else row--;
		}

		cells.push([row, col]);
	};

	return cells;
};





export const mergeDiffs = (prev: Diff, next: Diff): Diff => {
	const created = {...prev.created, ...next.created};
	const updated = {...prev.updated, ...next.updated};
	const deleted = {...prev.deleted, ...next.deleted};

	for (let id in created) {
		if (id in updated) {
			created[id] = updated[id];
			delete updated[id];
		};
		
		if (id in deleted) {
			delete created[id];
			delete deleted[id];
		};
	};

	for (let id in updated) {
		if (id in deleted) delete updated[id];
	};

	return {created, updated, deleted};
};





export const findPathIdsIntersectingCircle = (grid: Grid, circle: Geometry.Circle, selected: Selected): Selected => {
	const [row, col] = getCell([circle.x, circle.y]);
	if (!grid[row] || !grid[row][col]) return {};

	const ids: Selected = {...selected};
	const p: Point = [circle.x, circle.y];

	outer:
	for (let id in grid[row][col]) {
		if (id in ids) continue;
		for (let [a, b] of grid[row][col][id]) {
			if (getDistanceBetweenPointAndSegment(p, a, b) <= circle.r) {
				ids[id] = true;
				continue outer;
			};
		};
	};

	return ids;
};





const getCell = (point: Point): Cell => {
	return [Math.floor(point[1] / CELL_SIZE), Math.floor(point[0] / CELL_SIZE)];
};





const getDistanceBetweenPointAndSegment = (p: Point, a: Point, b: Point): number => {
	return Geometry.getDistanceBetweenPointAndSegment(
		{x: p[0], y: p[1]},
		{x: a[0], y: a[1]},
		{x: b[0], y: b[1]},
	);
};





const getSegmentsIntersection = (a: Point, b: Point, c: Point, d: Point): Point | null => {
	const result = Geometry.getSegmentsIntersection(
		{x: a[0], y: a[1]},
		{x: b[0], y: b[1]},
		{x: c[0], y: c[1]},
		{x: d[0], y: d[1]},
	);
	if (!result) return null;
	return [result.x, result.y];
};