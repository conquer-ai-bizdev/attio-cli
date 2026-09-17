"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createObjectCommand = createObjectCommand;
const commander_1 = require("commander");
const client_1 = require("../api/client");
const objects_1 = require("../api/endpoints/objects");
const attributes_1 = require("../api/endpoints/attributes");
const json_1 = require("../formatters/json");
function createObjectCommand() {
    const object = new commander_1.Command('object').description('Manage objects and attributes');
    // List objects
    object
        .command('list')
        .description('List all objects in the workspace')
        .action(async (options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const objectApi = new objects_1.ObjectEndpoints(client);
            const objects = await objectApi.listObjects();
            console.log((0, json_1.formatJson)(objects));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // Get object
    object
        .command('get')
        .description('Get a specific object')
        .argument('<slug>', 'Object slug (e.g., people, companies, deals)')
        .action(async (slug, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const objectApi = new objects_1.ObjectEndpoints(client);
            const obj = await objectApi.getObject(slug);
            console.log((0, json_1.formatJson)(obj));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // List attributes
    object
        .command('attributes')
        .description('List attributes for an object')
        .argument('<object-slug>', 'Object slug (e.g., people, companies)')
        .action(async (objectSlug, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const objectApi = new objects_1.ObjectEndpoints(client);
            const attributes = await objectApi.listAttributes(objectSlug);
            console.log((0, json_1.formatJson)(attributes));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    // List attributes with values (convenience command)
    object
        .command('attributes-with-values')
        .description('List attributes for an object with their possible values (select options/statuses)')
        .argument('<object-slug>', 'Object slug (e.g., people, companies)')
        .option('--show-archived', 'Include archived attributes and options')
        .action(async (objectSlug, options) => {
        try {
            const client = new client_1.AttioClient(options.apiKey);
            const attributeApi = new attributes_1.AttributeEndpoints(client);
            const attributes = await attributeApi.listAttributesWithValues('objects', objectSlug, { show_archived: options.showArchived });
            console.log((0, json_1.formatJson)(attributes));
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    });
    return object;
}
//# sourceMappingURL=object.js.map