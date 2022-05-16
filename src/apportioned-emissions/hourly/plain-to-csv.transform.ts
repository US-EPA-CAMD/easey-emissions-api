import { Transform, TransformOptions, TransformCallback } from 'stream';

import { Parser } from 'json2csv';

const DEFAULT_BUFFER_SIZE = 104857; //1KB

export class PlainToCSV extends Transform {
  private isFirstChunk: boolean = true;
  private maxBufferlength: number = DEFAULT_BUFFER_SIZE - 100;

  private fields: any[];
  private buffer: Buffer = Buffer.alloc(DEFAULT_BUFFER_SIZE);
  private bufferOffset: number = 0;

  private noHeader = null;
  private withHeader = null;

  constructor(fields: any[], bufferSize?: number, opts?: TransformOptions) {
    super({
      ...opts,
      writableObjectMode: true,
    });

    this.fields = fields;

    this.noHeader = new Parser({
      fields: this.fields,
      header: false,
    });

    this.withHeader = new Parser({
      fields: this.fields,
    });

    if (bufferSize) {
      this.maxBufferlength = bufferSize;
    }
  }

  async _transform(
    data: any,
    _encoding: string,
    callback: TransformCallback,
  ): Promise<void> {
    let transformedData = '';

    if (this.isFirstChunk) {
      this.isFirstChunk = false;
      transformedData = this.withHeader.parse(data) + '\n';
    } else {
      transformedData = this.noHeader.parse(data) + '\n';
    }

    if (this.bufferOffset + transformedData.length >= this.maxBufferlength) {
      const newBuf = Buffer.alloc(this.bufferOffset);
      this.buffer.copy(newBuf);
      this.push(newBuf);
      this.bufferOffset = 0;
      this.buffer = Buffer.alloc(DEFAULT_BUFFER_SIZE);
      console.log('Pushing KB');
      await new Promise(f => setTimeout(f, 1));
    }

    this.buffer.fill(
      transformedData,
      this.bufferOffset,
      this.bufferOffset + transformedData.length,
    );
    this.bufferOffset += transformedData.length;

    callback();
  }

  _flush(callback: TransformCallback): void {
    const newBuf = Buffer.alloc(this.bufferOffset);
    this.buffer.copy(newBuf);
    this.push(newBuf);

    callback();
  }
}
