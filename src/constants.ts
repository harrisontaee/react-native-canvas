export const CELLS_PER_ROW = 5;
export const CELL_SIZE = 1 / CELLS_PER_ROW;
export const InitialDiff = {created: {}, updated: {}, deleted: {}};
export type Selected = {[id: string]: any};
export type Segment = [Point, Point];
export type Paths = {[id: string]: Path};
export type Point = [number, number];
export type Cell = [number, number];
export type Grid = {[pathId: string]: Segment[]}[][];
export type Path = {
	path: string;
	width: number;
	radius: number;
	colour: string | null;
	opacity: number;
};



export interface Canvas {
	grid: Grid;
	paths: Paths;
	selected: Selected;
};



export type Diff = {
	created: Paths,
	updated: Paths,
	deleted: Paths,
};



export type State = {
	canvases: {[id: string]: Canvas};
	actions: {
		createCanvas: (id: string) => void;
		deleteCanvas: (id: string) => void;
		createPaths: (canvasId: string, paths: Paths) => boolean;
		updatePaths: (canvasId: string, paths: Paths) => boolean;
		deletePaths: (canvasId: string, paths: Paths) => boolean;
		setSelected: (canvasId: string, selected: Selected) => void;	
		createGrid: (canvasId: string) => void;
		getPaths: (canvasId: string) => Paths;
		diff: (canvasId: string, diff: Diff) => void;
	};
};



export enum Tools {
	Brush = "Brush",
	Eraser = "Eraser",
	Lasso = "Lasso"
};



export enum Colours {
	Transparent = "#00000000",
	Black = "#000000",
	White = "#ffffff",
	Grey = "#222222",
	Red = "#e5474b",
	Orange = "#ff8000",
	Yellow = "#f4d153",
	Green = "#77d576",
	Blue = "#3b7cf3",
	Purple = "#8000ff"
};