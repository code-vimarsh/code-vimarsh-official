import fs from "fs";
import path from "path";
import yaml from "yaml";
import swaggerSpec from "../src/config/swagger.js";

fs.writeFileSync(
  path.resolve("./docs/swagger.yaml"),
  yaml.stringify(swaggerSpec)
);

console.log("✅ Swagger files generated in /docs");