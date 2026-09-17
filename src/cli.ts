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
import { createMcpCommand } from './commands/mcp';

const program = new Command();

program
  .name('attio')
  .description('JSON-first Attio CLI with REST commands and official MCP access')
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
program.addCommand(createMcpCommand());

program.parseAsync().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
