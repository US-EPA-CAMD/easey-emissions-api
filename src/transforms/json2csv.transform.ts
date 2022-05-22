import { Transform, TransformOptions, TransformCallback } from 'stream';

import { Parser } from 'json2csv';

export class Json2CSV extends Transform {
  private fields: any[];
  private isFirstChunk: boolean = true;
  private noHeader = null;
  private withHeader = null;

  constructor(
    fields: any[],
    opts?: TransformOptions,
  ) {
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
  }

  async _transform(
    data: any,
    _encoding: string,
    callback: TransformCallback,
  ): Promise<void> {
    if (this.isFirstChunk) {
      this.isFirstChunk = false;
      this.push(this.withHeader.parse(data) + '\n');
    } else {
      this.push(this.noHeader.parse(data) + '\n');
    }
    callback();
  }

  _flush(callback: TransformCallback): void {
    callback();
  }
}

export default Json2CSV;