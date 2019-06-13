/*Copyright (c) 2019 XdevL. All rights reserved.

This work is licensed under the terms of the MIT license.
For a copy, see <https://opensource.org/licenses/MIT>.*/

// tslint:disable max-classes-per-file
import { Chunk, ChunkType, parseResourceValue, StringPool } from "./common";
import Source from "./source";

class XmlAttribute {

  public readonly name: string;
  public readonly value: any;

  constructor(source: Source, stringPool: StringPool) {
    source.getCursorAndMove(4); // nameSpace
    this.name = stringPool.values[source.readInt()];
    source.getCursorAndMove(4); // rawValue
    this.value = parseResourceValue(source, stringPool);
  }
}

class XmlElement {
  public readonly tag: string;
  public readonly attributes: {[key: string]: any} = {};
  public readonly children: BinaryXml = new BinaryXml();

  constructor(source: Source, stringPool: StringPool) {
    source.getCursorAndMove(4); // namespace
    this.tag = stringPool.values[source.readInt()];

    const attributeStart = source.readUShort();
    const attributeSize = source.readUShort();
    const attributeCount = source.readUShort();

    source.moveAt(attributeStart);
    for (let i = 0; i < attributeCount; ++i ) {
      const attr = new XmlAttribute(source.source(attributeSize), stringPool);
      this.attributes[attr.name] = attr.value;
    }
  }
}

export default class BinaryXml {

  private static parseChildren(children: BinaryXml, source: Source, stringPool: StringPool) {
    let chunk = new Chunk(source);
    while (chunk.type !== ChunkType.XML_END_NAMESPACE && chunk.type !== ChunkType.XML_END_ELEMENT) {
      if (chunk.type === ChunkType.XML_START_ELEMENT) {
        const child = new XmlElement(chunk.chunkSource, stringPool);
        if (!children[child.tag]) {
          children[child.tag] = [];
        }
        children[child.tag].push(child);
        BinaryXml.parseChildren(child.children, source, stringPool);
      }
      chunk = new Chunk(source);
    }
  }

  [key: string]: XmlElement[];

  constructor(source?: Source) {
    if (source) {
      source = new Chunk(source, ChunkType.XML).chunkSource;
      const stringPool = new StringPool(new Chunk(source, ChunkType.STRING_POOL));
      BinaryXml.parseChildren(this, source, stringPool);
    }
  }
}
