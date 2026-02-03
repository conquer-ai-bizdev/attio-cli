#!/usr/bin/env node

import { Command } from 'commander';
import { createWorkspaceCommand } from './commands/workspace';

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

// Add commands
program.addCommand(createWorkspaceCommand());

program.parse();
