/* eslint-disable @typescript-eslint/no-unused-vars */
declare interface Window {
  larpLibraryAssetsHost?: string;
}

declare let __webpack_public_path__: string;

if (window.larpLibraryAssetsHost) {
  __webpack_public_path__ = `//${window.larpLibraryAssetsHost}/packs/`;
}
