import { batch } from "solid-js";
import { GameEvent } from "~/common/types";
import { setReplayStateFromGameEvent } from "~/state/spectateStore";

import workerUrl from "~/worker/workerUrl";

export function createWorker(wsUrl: string): Worker {
  console.log(`Creating worker from URL ${workerUrl}...`);
  // const worker = new Worker("/assets/worker.js", { type: "module" });
  const worker = new Worker(workerUrl);

  worker.onmessage = (event: MessageEvent) => {
    const gameEvents: GameEvent[] = event.data.value;

    // Works without batch now, but might still want it for smoothness.
    // To consider alongside changed buffer logic.
    batch(() => {
      gameEvents.forEach((gameEvent) => {
        setReplayStateFromGameEvent(gameEvent)
      });
    });
  };

  worker.onerror = (error) => {
    console.log(`Worker error: ${error.message}`);
    throw error;
  };

  worker.postMessage({ type: "connect", value: wsUrl });

  return worker;
}
