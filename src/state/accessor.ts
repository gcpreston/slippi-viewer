import { createRoot, createSignal } from "solid-js";
import { GameSettings } from "~/common/types";

import { replayStore, setReplay } from "~/state/replayStore";
import { spectateStore, nonReactiveState, setWsUrl } from "~/state/spectateStore";

type ReplayPointer = {
  mode: "replay",
  file: File
} | {
  mode: "spectate",
  url: string
};

type ViewerMode = "replay" | "spectate";
type ViewerStateAttribute = "settings" | "ending" | "frames" | "replayFormatVersion" | "animations" | "isLoading" | "frame" | "renderDatas" | "framesPerTick" | "running" | "zoom" | "isDebug" | "isFullscreen" | "currentFrame";

type API = {
  replayPointer(): ReplayPointer | null,
  setReplayPointerWrapper(p: ReplayPointer | null): void;
};

export const { replayPointer, setReplayPointerWrapper } = createRoot<API>(() => {
  const [replayPointer, setReplayPointer] = createSignal<ReplayPointer | null>(null);

  const setReplayPointerWrapper = (p: ReplayPointer | null) => {
    if (p === null) {
      setWsUrl(null);
    }

    if (p?.mode === "spectate") {
      setWsUrl(p.url);
    } else if (p?.mode === "replay") {
      setReplay(p.file);
    }
    setReplayPointer(p);
  }

  return { replayPointer, setReplayPointerWrapper };
});

// TODO: Typing
export function access(attribute: ViewerStateAttribute): any {
  const mode = replayPointer()?.mode;

  if (!mode) {
    return undefined;
  }

  // Computed attributes
  switch (attribute) {
    case "currentFrame":
      const frames = access("frames");
      return frames === undefined ? undefined : frames[access("frame")];
  }

  const attributeDictionary = {
    "settings": {
      "replay": () => replayStore.replayData?.settings,
      "spectate": () => spectateStore.playbackData?.settings
    },
    "ending": {
      "replay": () => replayStore.replayData?.ending,
      "spectate": () => spectateStore.playbackData?.ending
    },
    "frames": {
      "replay": () => replayStore.replayData?.frames,
      "spectate": () => nonReactiveState.gameFrames
    },
    "replayFormatVersion": {
      "replay": () => replayStore.replayData?.settings.replayFormatVersion,
      "spectate": () => nonReactiveState.replayFormatVersion
    },
    "animations": {
      "replay": () => replayStore.animations,
      "spectate": () => spectateStore.animations
    },
    "isLoading": {
      "replay": () => replayStore.isLoading,
      "spectate": () => spectateStore.isLoading
    },
    "frame": {
      "replay": () => replayStore.frame,
      "spectate": () => spectateStore.frame
    },
    "renderDatas": {
      "replay": () => replayStore.renderDatas,
      "spectate": () => spectateStore.renderDatas
    },
    "framesPerTick": {
      "replay": () => replayStore.framesPerTick,
      "spectate": () => spectateStore.framesPerTick
    },
    "running": {
      "replay": () => replayStore.running,
      "spectate": () => spectateStore.running
    },
    "zoom": {
      "replay": () => replayStore.zoom,
      "spectate": () => spectateStore.zoom
    },
    "isDebug": {
      "replay": () => replayStore.isDebug,
      "spectate": () => spectateStore.isDebug
    },
    "isFullscreen": {
      "replay": () => replayStore.isFullscreen,
      "spectate": () => spectateStore.isFullscreen
    }
  };

  // let modeDict: ModeDict

  // if (!attributeDictionary.hasOwnProperty(attribute)) {
  //   modeDict = {
  //     "replay": () => replayStore[attribute],
  //     "spectate": () => spectateStore[attribute]
  //   }
  // }

  return attributeDictionary[attribute][mode]();
}
