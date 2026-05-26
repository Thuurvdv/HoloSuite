declare const game: any;
declare const ui: any;
declare const Hooks: any;
declare const foundry: any;
declare const canvas: any;
declare const CONST: any;
declare const Handlebars: any;
declare const Dialog: any;
declare const FilePicker: any;
declare const AudioHelper: any;
declare const PIXI: any;
declare const $: any;
declare function loadTemplates(paths: string[]): Promise<unknown>;
declare class Application {
  constructor(options?: any);
  static defaultOptions: any;
  element: any;
  rendered: boolean;
  render(force?: boolean, options?: any): Promise<any> | any;
  close(options?: any): Promise<any> | any;
  bringToFront?(): void;
  activateListeners?(html: any): void;
  setPosition?(position: any): void;
  _renderInner?(data?: any): Promise<any> | any;
}
