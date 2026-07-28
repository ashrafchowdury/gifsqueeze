declare module "gifsicle-wasm-browser" {
  export interface GifsicleInput {
    file: File | Blob | string | ArrayBuffer;
    name: string;
  }

  export interface GifsicleRunArgs {
    input: GifsicleInput[];
    command: string[];
    folder?: string[];
    isStrict?: boolean;
  }

  interface Gifsicle {
    run(args: GifsicleRunArgs): Promise<File[]>;
  }

  const gifsicle: Gifsicle;
  export default gifsicle;
}
