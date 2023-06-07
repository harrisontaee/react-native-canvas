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



export enum BrushRadii {
	Small = 0.002,
	Medium = 0.007,
	Large = 0.013,
	XLarge = 0.02
};



export enum EraserRadii {
	Small = 0.01,
	Medium = 0.02,
	Large = 0.03,
	XLarge = 0.04
};



export enum Colours {
	Transparent = "#00000000",
	Black = "#000000",
	White = "#ffffff",
	Grey = "#222222",
	Red = "#ff0000",
	Orange = "#ff8000",
	Yellow = "#ffff00",
	Green = "#00ff00",
	Blue = "#0000ff",
	Purple = "#8000ff"
};