"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReportCommand = createReportCommand;
const commander_1 = require("commander");
const connected_service_1 = require("../api/connected-service");
const json_1 = require("../formatters/json");
const stdin_1 = require("../utils/stdin");
function createReportCommand() {
    const report = new commander_1.Command('report').description('Run aggregate reports over Attio records and list entries');
    report
        .command('run')
        .description('Run an aggregate report')
        .argument('<source>', 'Object or list slug or ID')
        .argument('[metric]', 'Metric as JSON; defaults to stdin')
        .option('--filter <json|->', 'Filter as JSON or - for stdin')
        .option('--group <json|->', 'Grouping array as JSON or - for stdin')
        .action(async (source, metric, options) => {
        try {
            (0, stdin_1.requireAtMostOneStdin)([
                { name: 'metric', value: metric ?? '-' },
                { name: '--filter', value: options.filter },
                { name: '--group', value: options.group },
            ]);
            const result = await (0, connected_service_1.callAttio)('run-basic-report', {
                source,
                metric: await (0, stdin_1.readJsonInput)(metric, 'Metric'),
                ...(options.filter
                    ? { filter: await (0, stdin_1.readJsonInput)(options.filter, '--filter') }
                    : {}),
                ...(options.group
                    ? { group_by: await (0, stdin_1.readJsonInput)(options.group, '--group') }
                    : {}),
            });
            console.log((0, json_1.formatJson)(result));
        }
        catch (error) {
            fail(error);
        }
    });
    return report;
}
function fail(error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
}
//# sourceMappingURL=report.js.map