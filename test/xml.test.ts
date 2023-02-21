import NodeFs from "fs";
import NodePath from "path";
import Source from "../lib/source";
import XmlElement from "../lib/xml";

const resourceDirectory = NodePath.join(__dirname, "resources");

test("Can read binary xml with multiple namespaces", async () => {
    const manifest = NodePath.join(resourceDirectory, "AndroidManifest.xml");
    const xml = new XmlElement(new Source(NodeFs.readFileSync(manifest)));

    expect(xml.children.manifest[0].attributes.package).toBe("com.lemon.lvoverseas");
    expect(xml.children.manifest[0].children.application[0].attributes.label).toBe(2131890533)
});