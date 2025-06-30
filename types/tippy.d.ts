import { Instance } from "tippy.js"

declare global {
  interface TippyHTMLElement extends HTMLElement {
    _tippy?: Instance
  }
}
