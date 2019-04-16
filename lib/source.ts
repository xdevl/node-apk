/*Copyright (c) 2019 XdevL. All rights reserved.

This work is licensed under the terms of the MIT license.
For a copy, see <https://opensource.org/licenses/MIT>.*/

import {Readable} from "stream";

export default class Source {

  public buffer: Buffer;
  public cursor: number = 0;

  constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  public readUByte(): number {
    return this.buffer.readUInt8(this.getCursorAndMove(1));
  }

  public readUShort(): number {
    return this.buffer.readUInt16LE(this.getCursorAndMove(2));
  }

  public readUInt(): number {
    return this.buffer.readUInt32LE(this.getCursorAndMove(4));
  }

  public readInt(): number {
    return this.buffer.readInt32LE(this.getCursorAndMove(4));
  }

  public readUtf8String(size: number): string {
    return this.buffer.toString("utf8", this.getCursorAndMove(size), this.cursor);
  }

  public readUtf16String(size: number): string {
    return this.buffer.toString("ucs2", this.getCursorAndMove(size), this.cursor);
  }

  public source(size: number) {
    return new Source(this.buffer.slice(this.getCursorAndMove(size), this.cursor));
  }

  public getCursorAndMove(offset: number): number {
    this.cursor += offset;
    return this.cursor - offset;
  }

  public moveAt(position: number): any {
    this.getCursorAndMove(position - this.cursor);
  }

  public stream(size: number): Readable {
    const readable = new Readable();
    readable._read = () => undefined;
    readable.push(this.buffer.slice(this.cursor, this.cursor + size));
    readable.push(null);
    return readable;
  }
}
