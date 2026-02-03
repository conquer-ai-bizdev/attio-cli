#!/usr/bin/env node

import { Command } from 'commander';
import { createWorkspaceCommand } from './commands/workspace';
import { createObjectCommand } from './commands/object';
import { createRecordCommand } from './commands/record';
import { createListCommand } from './commands/list';
import { createEntryCommand } from './commands/entry';

const program = new Command();

program
  .name('attio')
  .description('Fully-typed TypeScript CLI for managing Attio CRM via REST API')
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

program.parse();
