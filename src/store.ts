import {createWithEqualityFn} from "zustand/traditional";
import {immer} from "zustand/middleware/immer";
import {shallow} from "zustand/shallow";

import {CELLS_PER_ROW, Canvas, Diff, Grid, Path, Paths, Selected, State} from "./constants";
import {getCellsIntersectingSegment, getSegments} from "./utilities";

export const usePathIds = (canvasId: string): string[] => useStore(state => {
	if (!(canvasId in state.canvases)) return [];
	return Object.keys(state.canvases[canvasId].paths);
});



export const useSelected = (canvasId: string) => useStore(state => {
	if (!(canvasId in state.canvases)) return [];
	return state.canvases[canvasId].selected;
});



export const usePath = (canvasId: string, pathId: string) => useStore(state => {
	if (!(canvasId in state.canvases) || !(pathId in state.canvases[canvasId].paths)) return;
	return state.canvases[canvasId].paths[pathId];
});



export const useActions = () => useStore(state => state.actions);
export const useStore = createWithEqualityFn(immer<State>((set, get) => ({
	canvases: {},
	actions: {

		/* Adds a Canvas to the Store */
		createCanvas: (id: string) => set((state) => {
			if (id in state.canvases) return;
			state.canvases[id] = {grid: [], paths: {}, selected: {}};
		}),


		/* Deletes a Canvas from the Store */
		deleteCanvas: (id: string) => set((state) => {
			if (!(id in state.canvases)) return;
			delete state.canvases[id];
		}),


		/* Adds Paths to the canvas */
		createPaths: (canvasId: string, paths: Paths) => {
			let shouldRecreateGrid = false;
			set((state: State) => {
				if (!(canvasId in state.canvases)) return;
				const canvas = state.canvases[canvasId];
				for (let pathId in paths) {
					if (pathId in canvas.paths) continue;
					let path = paths[pathId];
					state.canvases[canvasId].paths[pathId] = path;
					shouldRecreateGrid = true;
				};
			});
			return shouldRecreateGrid;
		},


		/* Updates Paths in the canvas */
		updatePaths: (canvasId: string, paths: Paths) => {
			let shouldRecreateGrid = false;
			set(state => {
				if (!(canvasId in state.canvases)) return;
				const canvas: Canvas = state.canvases[canvasId];
				for (let pathId in paths) {
					if (!(pathId in canvas.paths)) continue;
					let prev = state.canvases[canvasId].paths[pathId];
					let next = paths[pathId];
					if (!shouldRecreateGrid && prev.path !== next.path) shouldRecreateGrid = true;
 					state.canvases[canvasId].paths[pathId] = next;
				};
			});
			return shouldRecreateGrid;
		},


		/* Deletes Paths from the canvas */
		deletePaths: (canvasId: string, paths: Paths) => {
			let shouldRecreateGrid = false;
			set(state => {
				if (!(canvasId in state.canvases)) return;
				const canvas = state.canvases[canvasId];
				for (let pathId in paths) {
					if (!(pathId in canvas.paths)) continue;
					delete state.canvases[canvasId].paths[pathId];
					shouldRecreateGrid = true;
				};
			});
			return shouldRecreateGrid;
		},



		/* Sets selected */
		setSelected: (canvasId: string, selected: Selected) => set(state => {
			if (!(canvasId in state.canvases)) return;
			state.canvases[canvasId].selected = selected;
		}),



		/* Creates grid */
		createGrid: (canvasId: string) => set(state => {
			if (!(canvasId in state.canvases)) return;
			const canvas = state.canvases[canvasId];
			const grid: Grid = [];
			for (let pathId in canvas.paths) {
				const path = canvas.paths[pathId];
				const segments = getSegments(path);
				for (let segment of segments) {
					const cells = getCellsIntersectingSegment(...segment);
					for (let [row, col] of cells) {
						if (row < 0 || col < 0 || col >= CELLS_PER_ROW) continue;
						if (!grid[row]) grid[row] = Array(CELLS_PER_ROW).fill({});
						if (pathId in grid[row][col]) grid[row][col][pathId].push(segment);
						else grid[row][col][pathId] = [segment];
					};
				};
			};
			state.canvases[canvasId].grid = grid;
		}),


		/* Gets paths */
		getPaths: (canvasId: string) => {
			const canvases = get().canvases;
			if (!(canvasId in canvases)) return {};
			return canvases[canvasId].paths;
		},

		
		
		/* Applies a Diff to the canvas */
		diff: (canvasId: string, diff: Diff) => {
			const actions = get().actions;
			const should1 = actions.createPaths(canvasId, diff.created);
			const should2 = actions.updatePaths(canvasId, diff.updated);
			const should3 = actions.deletePaths(canvasId, diff.deleted);
			if (should1 || should2 || should3) actions.createGrid(canvasId);
		},
	}
})), shallow);
