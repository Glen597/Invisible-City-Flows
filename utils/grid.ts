export type Cell = {
  centerLng: number;
  centerLat: number;
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
};

export function generateGrid(
  minLng: number,
  minLat: number,
  maxLng: number,
  maxLat: number,
  nx = 10,
  ny = 10
): Cell[] {
  const cells: Cell[] = [];
  const dx = (maxLng - minLng) / nx;
  const dy = (maxLat - minLat) / ny;

  for (let ix = 0; ix < nx; ix++) {
    for (let iy = 0; iy < ny; iy++) {
      const cellMinLng = minLng + ix * dx;
      const cellMaxLng = cellMinLng + dx;
      const cellMinLat = minLat + iy * dy;
      const cellMaxLat = cellMinLat + dy;

      cells.push({
        centerLng: (cellMinLng + cellMaxLng) / 2,
        centerLat: (cellMinLat + cellMaxLat) / 2,
        minLng: cellMinLng,
        minLat: cellMinLat,
        maxLng: cellMaxLng,
        maxLat: cellMaxLat,
      });
    }
  }
  return cells;
}
