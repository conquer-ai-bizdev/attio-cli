#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('attio')
  .description('Fully-typed TypeScript CLI for managing Attio CRM via REST API')
  .version('0.1.0');

program.parse();
