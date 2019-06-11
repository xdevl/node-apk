/*Copyright (c) 2019 XdevL. All rights reserved.

This work is licensed under the terms of the MIT license.
For a copy, see <https://opensource.org/licenses/MIT>.*/

import NodeZlib from "zlib";
import Source from "./source";

enum Signature {
  CENTRAL_HEADER = 0x2014b50,
  LOCAL_HEADER = 0x4034b50,
}

enum Algorithm {
  DEFLATE = 8,
  NONE = 0,
}

export type BufferLoader = () => Promise<Buffer>;

export class ZipEntry {

  public static lookup(loader: BufferLoader, key: string): Promise<ZipEntry> {
    return ZipEntry.index(loader).then((map) => {
      const entry = map.get(key);
      if (entry) { return entry; } else { throw Error("Entry not found: " + key); }
    });
  }

  public static index(loader: BufferLoader): Promise<Map<string, ZipEntry>> {
    return loader().then((buffer) => {
      const index = buffer.indexOf("504B0506", 0, "hex");
      if (index < 0) {
        throw Error("End of central directory not found");
      }
      const source = new Source(buffer.slice(index + 10));
      const count = source.readUShort();
      const size = source.readUInt();
      const offset = source.readUInt();
      const directory = new Source(buffer.slice(offset, offset + size));
      const map = new Map() as Map<string, ZipEntry>;
      for (let i = 0; i < count; ++i) {
        const entry = new ZipEntry(buffer, directory);
        map.set(entry.name, entry);
      }
      return map;
    });
  }

  public readonly buffer: Buffer;
  public readonly signature: number;
  public readonly versionMadeBy: number;
  public readonly extractVersion: number;
  public readonly flags: number;
  public readonly compressionMethod: number;
  public readonly time: number;
  public readonly date: number;
  public readonly crc32: number;
  public readonly compressedSize: number;
  public readonly unCompressedSize: number;
  public readonly nameLength: number;
  public readonly extraLength: number;
  public readonly commentLength: number;
  public readonly diskNumber: number;
  public readonly internalAttributes: number;
  public readonly externalAttributes: number;
  public readonly offset: number;
  public readonly name: string;

  private constructor(buffer: Buffer, source: Source, signature: Signature = Signature.CENTRAL_HEADER) {
    this.buffer = buffer;
    this.signature = source.readUInt();
    if (this.signature !== signature) {
      throw Error(`Invalid file header signature found: 0x${signature.toString(16)}`);
    }
    this.versionMadeBy = this.signature === Signature.CENTRAL_HEADER ? source.readUShort() : 0;
    this.extractVersion = source.readUShort();
    this.flags = source.readUShort();
    this.compressionMethod = source.readUShort();
    this.time = source.readUShort();
    this.date = source.readUShort();
    this.crc32 = source.readUInt();
    this.compressedSize = source.readUInt();
    this.unCompressedSize = source.readUInt();
    this.nameLength = source.readUShort();
    this.extraLength = source.readUShort();
    this.commentLength = this.signature === Signature.CENTRAL_HEADER ? source.readUShort() : 0;
    this.diskNumber = this.signature === Signature.CENTRAL_HEADER ? source.readUShort() : 0;
    this.internalAttributes = this.signature === Signature.CENTRAL_HEADER ? source.readUShort() : 0;
    this.externalAttributes = this.signature === Signature.CENTRAL_HEADER ? source.readUInt() : 0;
    this.offset = this.signature === Signature.CENTRAL_HEADER ? source.readUInt() : 0;
    this.name = source.readUtf8String(this.nameLength);
    source.getCursorAndMove(this.extraLength + this.commentLength);
  }

  public stream(): NodeJS.ReadableStream {
    const source = new Source(this.buffer);
    source.moveAt(this.offset);
    const local = new ZipEntry(this.buffer, source, Signature.LOCAL_HEADER);
    const stream = source.stream(this.compressedSize);

    if (local.compressionMethod === Algorithm.DEFLATE) {
      return stream.pipe(NodeZlib.createInflateRaw());
    } else if (local.compressionMethod === Algorithm.NONE) {
      return stream;
    } else {
      throw Error(`Unsupported compression method: 0x${this.compressionMethod.toString(16)}`);
    }
  }
}
