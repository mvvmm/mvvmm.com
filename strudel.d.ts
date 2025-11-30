declare module "@strudel/codemirror" {
  export const highlightExtension: any[];
  export function updateMiniLocations(view: any, miniLocations: any): void;
  export function highlightMiniLocations(
    view: any,
    time: number,
    haps: any[]
  ): void;
}

declare module "@strudel/core" {
  export function repl(options?: any): any;
  export function noteToMidi(note: string): number;
  export function valueToMidi(value: any): number;
  export type Pattern = any;
  export function evalScope(...modules: any[]): Promise<any>;
  export const core: any;
}

declare module "@strudel/draw" {
  export class Drawer {
    constructor(
      callback: (haps: any, time: number) => void,
      drawTime: [number, number]
    );
    start(scheduler: any): void;
    stop(): void;
  }
}

declare module "@strudel/transpiler" {
  export const transpiler: any;
}

declare module "@strudel/webaudio" {
  export function getAudioContext(): AudioContext;
  export const webaudioOutput: any;
  export const aliasBank: (url: string) => void;
  export const registerSynthSounds: () => Promise<void>;
  export const samples: (url: string) => Promise<void>;
}

declare module "@strudel/mini" {
  // Module exports
}

declare module "@strudel/tonal" {
  // Module exports
}

declare module "@strudel/hydra" {
  // Module exports
}

declare module "@strudel/soundfonts" {
  export function registerSoundfonts(): Promise<void>;
}

declare module "@strudel/midi" {
  // Module exports
}
