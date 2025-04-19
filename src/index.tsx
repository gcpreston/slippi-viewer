import { customElement } from "solid-element";
import { MiniApp, setReplay } from "~/components/MiniApp";
import { setWsUrl } from "~/state/spectateStore";

interface HTMLSlippiViewer extends HTMLElement {
  setReplay(replayFile: File): void;
  spectate(wsUrl: string): void;
  clear(): void;
}

customElement("slippi-viewer", { zipsBaseUrl: "/" },
  (props, { element }) => {
    // The @font-face rule used in the Material Icons CSS must be declared
    // in the main document.
    // https://stackoverflow.com/a/60526280
    element.innerHTML = '<link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined" rel="stylesheet" />';

    element.setReplay = setReplay;
    element.spectate = setWsUrl;
    element.clear = () => setWsUrl(null);
    return (<MiniApp zipsBaseUrl={props.zipsBaseUrl} /> as HTMLSlippiViewer);
  });
