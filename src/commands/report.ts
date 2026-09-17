import { Command } from 'commander';
import { callAttio } from '../api/connected-service';
import { formatJson } from '../formatters/json';
import { readJsonInput, requireAtMostOneStdin } from '../utils/stdin';

export function createReportCommand(): Command {
  const report = new Command('report').description(
    'Run aggregate reports over Attio records and list entries'
  );

  report
    .command('run')
    .description('Run an aggregate report')
    .argument('<source>', 'Object or list slug or ID')
    .argument('[metric]', 'Metric as JSON; defaults to stdin')
    .option('--filter <json|->', 'Filter as JSON or - for stdin')
    .option('--group <json|->', 'Grouping array as JSON or - for stdin')
    .action(async (source: string, metric: string | undefined, options) => {
      try {
        requireAtMostOneStdin([
          { name: 'metric', value: metric ?? '-' },
          { name: '--filter', value: options.filter },
          { name: '--group', value: options.group },
        ]);
        const result = await callAttio('run-basic-report', {
          source,
          metric: await readJsonInput(metric, 'Metric'),
          ...(options.filter
            ? { filter: await readJsonInput(options.filter, '--filter') }
            : {}),
          ...(options.group
            ? { group_by: await readJsonInput(options.group, '--group') }
            : {}),
        });
        console.log(formatJson(result));
      } catch (error) {
        fail(error);
      }
    });

  return report;
}

function fail(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
}
