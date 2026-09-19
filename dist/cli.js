#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const workspace_1 = require("./commands/workspace");
const object_1 = require("./commands/object");
const record_1 = require("./commands/record");
const list_1 = require("./commands/list");
const entry_1 = require("./commands/entry");
const note_1 = require("./commands/note");
const task_1 = require("./commands/task");
const meeting_1 = require("./commands/meeting");
const attribute_1 = require("./commands/attribute");
const email_1 = require("./commands/email");
const call_recording_1 = require("./commands/call-recording");
const file_1 = require("./commands/file");
const comment_1 = require("./commands/comment");
const report_1 = require("./commands/report");
const program = new commander_1.Command();
program
    .name('attio')
    .description('Work with Attio from the command line')
    .version('0.1.0');
// Global options
program.option('--api-key <key>', 'Attio API key (overrides ATTIO_API_KEY env var)');
program.option('--verbose', 'Show detailed error messages');
// Add commands
program.addCommand((0, workspace_1.createWorkspaceCommand)());
program.addCommand((0, object_1.createObjectCommand)());
program.addCommand((0, record_1.createRecordCommand)());
program.addCommand((0, list_1.createListCommand)());
program.addCommand((0, entry_1.createEntryCommand)());
program.addCommand((0, note_1.createNoteCommand)());
program.addCommand((0, task_1.createTaskCommand)());
program.addCommand((0, meeting_1.createMeetingCommand)());
program.addCommand((0, attribute_1.createAttributeCommand)());
program.addCommand((0, email_1.createEmailCommand)());
program.addCommand((0, call_recording_1.createCallRecordingCommand)());
program.addCommand((0, file_1.createFileCommand)());
program.addCommand((0, comment_1.createCommentCommand)());
program.addCommand((0, report_1.createReportCommand)());
function rejectUnexpectedArguments(command) {
    command.allowExcessArguments(false);
    for (const child of command.commands)
        rejectUnexpectedArguments(child);
}
rejectUnexpectedArguments(program);
program.addHelpText('afterAll', `
Write input:
  Pass JSON or text as the final positional argument, or omit it to read stdin.
  A literal - also means stdin. Successful output is compact JSON for jq.

Example:
  attio record update companies <record-id> <<'EOF'
  {"description":"Updated"}
  EOF`);
program.parseAsync().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exitCode = 1;
});
//# sourceMappingURL=cli.js.map