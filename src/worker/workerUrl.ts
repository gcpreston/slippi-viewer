// https://github.com/evanw/esbuild/issues/312
// Handled by esbuild plugin
import workerCode from "./worker";

export default URL.createObjectURL(new Blob([workerCode], { type:"text/javascript" }));
