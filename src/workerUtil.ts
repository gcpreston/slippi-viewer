import { batch } from "solid-js";
import { GameEvent } from "~/common/types";
import { setReplayStateFromGameEvent, jumpToLive } from "~/state/spectateStore";

import workerCode from "~/worker/worker";

export function createWorker(wsUrl: string): Worker {
  const workerUrl = URL.createObjectURL(new Blob([workerCode], { type:"text/javascript" }));
  console.log(`Creating worker from URL ${workerUrl}...`);
  const worker = new Worker(workerUrl);
  URL.revokeObjectURL(workerUrl);
  let isFirstMessage = true;

  worker.onmessage = (event: MessageEvent) => {
    const gameEvents: GameEvent[] = event.data.value;

    // Works without batch now, but might still want it for smoothness.
    // To consider alongside changed buffer logic.
    batch(() => {
      gameEvents.forEach((gameEvent) => {
        setReplayStateFromGameEvent(gameEvent)
      });
      if (isFirstMessage) {
        jumpToLive();
        isFirstMessage = false;
      }
    });
  };

  worker.onerror = (error) => {
    console.log(`Worker error: ${error.message}`);
    throw error;
  };

  worker.postMessage({ type: "connect", value: wsUrl });

  return worker;
}
