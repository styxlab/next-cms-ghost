declare module 'hast-util-to-string' {
  import { Node } from 'unist'
  export default function toString(node: Node): string
}

declare module 'probe-image-size' {
  /**
   * Get image size without full download. Supported image types: JPG, GIF, PNG, WebP, BMP, TIFF, SVG, PSD.
   */
  declare function probe(source: string, opts: probe.ProbeOptions, callback: probe.ProbeCallback): void;
  declare function probe(source: string, opts?: probe.ProbeOptions): Promise<probe.ProbeResult>;
  declare function probe(source: string | NodeJS.ReadableStream, callback: probe.ProbeCallback): void;
  declare function probe(source: NodeJS.ReadableStream): Promise<probe.ProbeResult>;

  declare namespace probe {
    interface ProbeResult {
      width: number;
      height: number;
      length: number;
      type: string;
      mime: string;
      wUnits: string;
      hUnits: string;
      url: string;
    }

    interface ProbeOptions {
      open_timeout?: number;
      response_timeout?: number;
      read_timeout?: number;
      follow_max?: number;
    }

    interface ProbeError extends Error {
      code?: 'ECONTENT';
      status?: number;
    }

    type ProbeCallback = (err: ProbeError | null, result: ProbeResult) => void;

    function sync(data: Buffer): ProbeResult | null;
  }

  export = probe;
}
