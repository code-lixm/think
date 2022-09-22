import { Node } from './node';

export class Tldraw extends Node {
  type = 'tldraw';

  matching() {
    return this.DOMNode.nodeName === 'DIV' && this.DOMNode.classList.contains('tldraw');
  }
}
