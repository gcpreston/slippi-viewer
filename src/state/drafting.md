## What properties do we care about?

```ts
export interface ReplayStore {
  replayData?: { // ReplayData
    readonly settings: GameSettings;
    /**
     * Player control starts at 84. Timer starts at 123.
     */
    readonly frames: Frame[];
    /** Cause of game end. To determine winner you must examine the last frame. */
    readonly ending: GameEnding;
  };
  animations: (CharacterAnimations | undefined)[];
  frame: number;
  renderDatas: RenderData[];
  fps: number;
  framesPerTick: number;
  running: boolean;
  zoom: number;
  isDebug: boolean;
  isFullscreen: boolean;
}

export type SpectateStore = {
  playbackData?: { // SpectateData
    readonly settings: GameSettings;

    /** Cause of game end. To determine winner you must examine the last frame. */
    readonly ending?: GameEnding;
  };
  animations: (CharacterAnimations | undefined)[];
  frame: number;
  gameEndFrame: number | null;
  renderDatas: RenderData[];
  fps: number;
  framesPerTick: number;
  running: boolean;
  zoom: number;
  isDebug: boolean;
  isFullscreen: boolean;
};

export type NonReactiveState = {
  payloadSizes?: CommandPayloadSizes;
  replayFormatVersion?: string,
  /**
   * Player control starts at 84. Timer starts at 123.
   */
  gameFrames: Frame[];
  latestFinalizedFrame?: number;
};
```

Shared properties and where they live: (implied store. for replay)
- settings
  * replay: replayData.settings
  * spectate: store.playbackData.settings
- ending
  * replay: replayData.ending
  * spectate: store.playbackData.ending
- frames
  * replay: replayData.frames
  * spectate: nonReactiveState.gameFrames
- replayFormatVersion
  * replay: replayData.settings.replayFormatVersion
  * spectate: nonReactiveState.replayFormatVersion (source of truth; still in settings too)
- all the following are directly on the stores and the same:
  * animations
  * frame
  * renderDatas
  * framesPerTick
  * running
  * zoom
  * isDebug
  * isFullscreen

Unshared properties:
- replay
- spectate
  * latestFinalizedFrame: nonReactiveState.latestFinalizedFrame
  * payloadSizes: nonReactiveState.payloadSizes (only used within parse for replay, doesn't matter after)
  * gameEndFrame: store.gameEndFrame

Note that highlight properties are not included for now. They were already removed to bring the replay viewer in without worrying about external UIs and events. This both simplifies the unification, and lets them be re-implemented in the future for both at the same time hopefully.

## Does it make more sense to unify first, or create an accessor first?

This question is about which side to start the transition from: the UI using the stores, or the underlying stores.

The main issue with unification (and an accessor, really) is the distinction between reactable and non-reactable state. There are 2 attributes that are reactable in replay mode and non-reactable in spectate mode: frames and replayFormatVersion. While they are sometimes (usually) used in reactable contexts, it does not appear that there are any current usages that actually rely on reacting to these attributes (other attributes are the trigger, such as frame). I suppose this means they were good ones to move.

It seems like the final solution will want both unification and an accessor anyways. There are a decent number of differences between the structures for the two modes, because naturally the data they need to track during the UI runtime is quite different for different tasks. I think it makes most sense to not change the SlippiLab data too much in order to minimize bug risk, and also just because it doesn't need it. As for the accessor, it feels like spectate mode needs anyways, because why should the caller care about where an attribute actually lives? Tant mieux s'il nous permet d'avoir multiple structures under the hood (ReplayStore vs SpectateStore depending on selected mode, which is a higher level signal).

So, let's write the accessor first.

```ts
access(attribute: ReplayAtrribute): ReplayAttributeValue
// TS definitely has some type for associating keys to values
```
