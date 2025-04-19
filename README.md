# slippi-viewer

A Web Component for viewing Slippi replays and streams in the browser. Extracted from [Slippi Lab](https://github.com/frankborden/slippilab).

## Features
- [x] View replays
- [x] View streams
- [x] Pause/play/rewind/fast forward/skip
- [ ] Highlights
- [x] Use as custom element
- [ ] Use as SolidJS component

## Usage

```html
<slippi-viewer zips-base-url="https://spectator-mode.fly.dev" />
```

The `zips-base-url` attribute refers to where to find the character data the the visualizer. Currently, this can be found on Slippi Lab, or [SpectatorMode](https://github.com/gcpreston/spectator_mode/). You can of course host the zips yourself as well, and point the base URL back to your own site with something like `zips-base-url="/"`. An example of this can be found at [examples/replay](examples/replay/index.html).

## Replay mode

```js
const viewer = document.querySelector("slippi-viewer");
const replayFileData; // get from file upload input, for example
viewer.setReplay(replayFileData);
```

## Spectate mode

```js
const viewer = document.querySelector("slippi-viewer");
viewer.spectate("ws://spectator-mode.fly.dev/viewer_socket/websocket?bridge_id=<stream ID>");
```

The spectate example points to the websocket URL where a stream can be found on SpectatorMode, to give a concrete example.
