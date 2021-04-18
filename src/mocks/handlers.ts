import { rest } from "msw";
import definition from "./swagger.json";
import fixtures from "./fixtures.json";
import { sampleFromSchema } from "../utils/generateSamples";

function toMswPath(string) {
  return string.replace(/(\{.*\})/g, (x) => x.replace("{", ":").replace("}", ""));
}

function getLookupDefKey(key) {
  return key.replace("#/definitions/", "");
}

function denormalizeDefinitions(originalDefinitions) {
  const definitions = { ...originalDefinitions };
  Object.values(definitions).forEach((def: any) => {
    Object.entries(def.properties).forEach(([key, prop]: [string, any]) => {
      if (!prop) {
        return;
      }
      if (prop.$ref) {
        const lookup = prop.$ref.replace("#/definitions/", "");
        if (definitions[lookup]) {
          def.properties[key] = definitions[lookup];
        }
      }

      if (prop.type === "array" && prop.items?.$ref) {
        const lookup = prop.items.$ref.replace("#/definitions/", "");

        if (definitions[lookup]) {
          def.properties[key].items = definitions[lookup];
        }
      }
    });
  });

  return definitions;
}

function generateExampleValue(req, opDef, denormalizedDefs) {
  if (opDef?.responses[200]?.schema) {
    const lookup = getLookupDefKey(opDef?.responses[200]?.schema.$ref);
    if (denormalizedDefs[lookup]) {
      return sampleFromSchema(denormalizedDefs[lookup]);
    }
  }

  return {
    message: "Not Implemented",
    operationDef: opDef,
  };
}

function createHandlersFromOpenApiDefinition() {
  const denormalizedDefs = denormalizeDefinitions(definition.definitions);
  const handlers = [];
  Object.entries(definition.paths).forEach(([pathName, ops]) => {
    const fullPath = toMswPath(definition.basePath + pathName);

    Object.entries(ops).forEach(([op, opDef]) => {
      const fn = rest[op];

      if (fn) {
        console.log(`Registered ${op} ${fullPath}`);
        handlers.push(
          fn(fullPath, async (req, res, ctx) => {
            // const apple = sampleFromSchema(denormalizeDefinitions.Pet, { includeWriteOnly: true });
            // console.log(apple);
            const jsonRes =
              fixtures?.[fullPath]?.[op] || generateExampleValue(req, opDef, denormalizedDefs);
            return res(ctx.json(jsonRes));
          })
        );
      }
    });
  });

  return handlers;
}

export const handlers = createHandlersFromOpenApiDefinition();
