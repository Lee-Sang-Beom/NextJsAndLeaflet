/**
 * Leaflet
 */
export const baseOSMProvider = {
  maptiler: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    atttribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};

export const alidadeSmoothDarkOSMProvider = {
  maptiler: {
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    atttribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};

export const DEFAULT_LEAFLET_ZOOM_LEVEL = 13;
export const DEFAULT_LEAFLET_ZOOM_MIN_ZOOM = 10;
export const DEFAULT_LEAFLET_ZOOM_MAX_ZOOM = 18;
