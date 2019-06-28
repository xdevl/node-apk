/*
 * Copyright (c) 2019 XdevL. All rights reserved.
 *
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

// tslint:disable max-classes-per-file
import XmlElement from "./xml";

export class Receiver {

  private readonly xml: XmlElement;

  constructor(xml: XmlElement) {
    this.xml = xml;
  }

  get raw(): XmlElement {
    return this.xml;
  }

  get name(): string {
    return this.xml.attributes.name;
  }

  get permission(): string {
    return this.xml.attributes.permission;
  }

  get exported(): boolean {
    return this.xml.attributes.exported;
  }
}

export class Manifest {

  private readonly xml: XmlElement;

  constructor(xml: XmlElement) {
    this.xml = xml.children.manifest[0];
  }

  get raw(): XmlElement {
    return this.xml;
  }

  get versionCode(): number {
    return Number(this.xml.attributes.versionCode);
  }

  get versionName(): string {
    return this.xml.attributes.versionName;
  }

  get package(): string {
    return this.xml.attributes.package;
  }

  get applicationLabel(): string | number {
    return this.xml.children.application[0].attributes.label;
  }

  get applicationIcon(): number {
    return this.xml.children.application[0].attributes.icon;
  }

  get permissions(): Iterable<string> {
    const permissions = this.xml.children["uses-permission"] || [];
    return (function*() {
      for (const permission of permissions) {
        yield permission.attributes.name;
      }
    })();
  }

  get receivers(): Iterable<Receiver> {
    const receivers = this.xml.children.application[0].children.receiver || [];
    return (function*() {
      for (const receiver of receivers) {
        yield new Receiver(receiver);
      }
    })();
  }
}
