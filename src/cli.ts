#!/usr/bin/env node

import { Command } from 'commander';
import { createWorkspaceCommand } from './commands/workspace';
import { createObjectCommand } from './commands/object';
import { createRecordCommand } from './commands/record';
import { createListCommand } from './commands/list';
import { createEntryCommand } from './commands/entry';
import { createNoteCommand } from './commands/note';
import { createTaskCommand } from './commands/task';
import { createMeetingCommand } from './commands/meeting';
import { createAttributeCommand } from './commands/attribute';
import { createEmailCommand } from './commands/email';
import { createCallRecordingCommand } from './commands/call-recording';
import { createFileCommand } from './commands/file';
import { createCommentCommand } from './commands/comment';
import { createReportCommand } from './commands/report';
import { createWebhookCommand } from './commands/webhook';

const program = new Command();

program
  .name('attio')
  .description('Work with Attio from the command line')
  .version('0.1.0');

// Global options
program.option(
  '--api-key <key>',
  'Attio API key (overrides ATTIO_API_KEY env var)'
);
program.option('--verbose', 'Show detailed error messages');

// Add commands
program.addCommand(createWorkspaceCommand());
program.addCommand(createObjectCommand());
program.addCommand(createRecordCommand());
program.addCommand(createListCommand());
program.addCommand(createEntryCommand());
program.addCommand(createNoteCommand());
program.addCommand(createTaskCommand());
program.addCommand(createMeetingCommand());
program.addCommand(createAttributeCommand());
program.addCommand(createEmailCommand());
program.addCommand(createCallRecordingCommand());
program.addCommand(createFileCommand());
program.addCommand(createCommentCommand());
program.addCommand(createReportCommand());
program.addCommand(createWebhookCommand());

function rejectUnexpectedArguments(command: Command): void {
  command.allowExcessArguments(false);
  for (const child of command.commands) rejectUnexpectedArguments(child);
}

rejectUnexpectedArguments(program);

program.addHelpText(
  'afterAll',
  `
Write input:
  Pass JSON or text as the final positional argument, or omit it to read stdin.
  A literal - also means stdin. Successful output is compact JSON for jq.

Example:
  attio record update companies <record-id> <<'EOF'
  {"description":"Updated"}
  EOF`
);

program.parseAsync().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
