import { batch } from "solid-js";
import { GameEvent } from "~/common/types";
import { setReplayStateFromGameEvent } from "~/state/spectateStore";

import workerCode from "~/worker/worker";

function handleGameData(gameEvents: GameEvent[]) {
  // Works without batch now, but might still want it for smoothness.
  // To consider alongside changed buffer logic.
  batch(() => {
    gameEvents.forEach((gameEvent) => {
      setReplayStateFromGameEvent(gameEvent)
    });
  });
}

export function createWorker(wsUrl: string): Worker {
  const workerUrl = URL.createObjectURL(new Blob([workerCode], { type:"text/javascript" }));
  console.log(`Creating worker from URL ${workerUrl}...`);
  const worker = new Worker(workerUrl);
  URL.revokeObjectURL(workerUrl);

  worker.onmessage = (event: MessageEvent) => {
    // for now, only type is "game_data"
    handleGameData(event.data.value);
  };

  worker.onerror = (error) => {
    console.log(`Worker error: ${error.message}`);
    throw error;
  };

  worker.postMessage({ type: "connect", value: wsUrl });

  return worker;
}
