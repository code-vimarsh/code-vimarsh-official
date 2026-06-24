import "dotenv/config";
import swaggerJsdoc from "swagger-jsdoc";
import fs from "fs";
import path from "path";
import yaml from "yaml";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Code Vimarsh API",
      version: "1.0.0",
      description:
        "Backend API documentation for Code Vimarsh – MSUB Coding Club",
    },
    servers: [{ url: `${process.env.API_BASE_URL}/api/v1` }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ["./src/modules/**/*.routes.js"],
};

const swaggerSpec = swaggerJsdoc(options);
fs.writeFileSync(path.resolve("./swagger.yaml"), yaml.stringify(swaggerSpec));

export default swaggerSpec;
