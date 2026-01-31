export type Camera = {
    x: number; // pan offset X
    y: number; // pan offset Y
    zoom: number; // scale (1 = 100%)
}

export const defaultCamera: Camera = {
    x: 0,
    y: 0,
    zoom: 1
}

export function screenToWorld(x: number, y: number, camera: Camera) {
    return {
        x: (x - camera.x) / camera.zoom,
        y: (y - camera.y) / camera.zoom,
    }
}

export function worldToScreen(x: number, y: number, camera: Camera) {
    return {
        x: x * camera.zoom + camera.x,
        y: y * camera.zoom + camera.y,
    }
}