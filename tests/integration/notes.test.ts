import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AttioClient } from '../../src/api/client';
import { NoteEndpoints } from '../../src/api/endpoints/notes';
import { RecordEndpoints } from '../../src/api/endpoints/records';
import * as dotenv from 'dotenv';

dotenv.config();

describe('Notes Integration Tests', () => {
  let client: AttioClient;
  let noteApi: NoteEndpoints;
  let recordApi: RecordEndpoints;
  let testNoteId: string | null = null;
  let testRecordId: string | null = null;

  beforeAll(() => {
    if (!process.env.ATTIO_API_KEY) {
      throw new Error(
        'ATTIO_API_KEY not found in environment. Cannot run integration tests.'
      );
    }
    client = new AttioClient();
    noteApi = new NoteEndpoints(client);
    recordApi = new RecordEndpoints(client);
  });

  afterAll(async () => {
    // Cleanup: delete test note and record if they were created
    if (testNoteId) {
      try {
        await noteApi.deleteNote(testNoteId);
        console.log(`Cleaned up test note: ${testNoteId}`);
      } catch (error) {
        console.warn(`Failed to cleanup test note: ${error}`);
      }
    }

    if (testRecordId) {
      try {
        await recordApi.deleteRecord('people', testRecordId);
        console.log(`Cleaned up test record: ${testRecordId}`);
      } catch (error) {
        console.warn(`Failed to cleanup test record: ${error}`);
      }
    }
  });

  describe('List Notes', () => {
    it('should list notes', async () => {
      const notes = await noteApi.listNotes({ limit: 5 });

      expect(notes).toBeInstanceOf(Array);

      if (notes.length > 0) {
        const note = notes[0];
        expect(note.id).toBeDefined();
        expect(note.id.note_id).toBeDefined();
        expect(note.title).toBeDefined();
        expect(note.created_at).toBeDefined();
      }
    });

    it('should respect limit parameter', async () => {
      const notes = await noteApi.listNotes({ limit: 2 });

      expect(notes).toBeInstanceOf(Array);
      expect(notes.length).toBeLessThanOrEqual(2);
    });
  });

  describe('Create, Get, Update, Delete Note', () => {
    it('should create a test person record for notes', async () => {
      const timestamp = Date.now();
      const testEmail = `test-notes-${timestamp}@integration-test.example.com`;

      const testData = {
        data: {
          values: {
            email_addresses: [{ email_address: testEmail }],
          },
        },
      };

      const record = await recordApi.createRecord('people', testData);

      expect(record).toBeDefined();
      expect(record.id.record_id).toBeDefined();

      testRecordId = record.id.record_id;
      console.log(`✓ Created test record for notes: ${testRecordId}`);
    });

    it('should create a new note', async () => {
      if (!testRecordId) {
        throw new Error('No test record created');
      }

      const data = {
        data: {
          parent_object: 'people',
          parent_record_id: testRecordId,
          title: 'Integration Test Note',
          format: 'markdown' as const,
          content: '## Test Note\n\nThis is a test note created by integration tests.',
          meeting_id: null,
        },
      };

      const note = await noteApi.createNote(data);

      expect(note).toBeDefined();
      expect(note.id.note_id).toBeDefined();
      expect(note.title).toBe('Integration Test Note');
      expect(note.parent_object).toBe('people');
      expect(note.parent_record_id).toBe(testRecordId);

      testNoteId = note.id.note_id;
      console.log(`✓ Created test note: ${testNoteId}`);
    });

    it('should get the created note', async () => {
      if (!testNoteId) {
        throw new Error('No test note created');
      }

      const note = await noteApi.getNote(testNoteId);

      expect(note).toBeDefined();
      expect(note.id.note_id).toBe(testNoteId);
      expect(note.title).toBe('Integration Test Note');

      console.log(`✓ Retrieved test note: ${testNoteId}`);
    });

    // Note: PATCH /notes/{note_id} endpoint appears to not be available in the API
    // Skipping update test until endpoint is confirmed
    it.skip('should update the note', async () => {
      if (!testNoteId) {
        throw new Error('No test note created');
      }

      const updateData = {
        data: {
          title: 'Updated Test Note',
          content: '## Updated Content\n\nThis note has been updated.',
        },
      };

      const note = await noteApi.updateNote(testNoteId, updateData);

      expect(note).toBeDefined();
      expect(note.id.note_id).toBe(testNoteId);
      expect(note.title).toBe('Updated Test Note');

      console.log(`✓ Updated test note: ${testNoteId}`);
    });

    it('should list notes for the test record', async () => {
      if (!testRecordId) {
        throw new Error('No test record created');
      }

      const notes = await noteApi.listNotes({
        parent_object: 'people',
        parent_record_id: testRecordId,
      });

      expect(notes).toBeInstanceOf(Array);
      expect(notes.length).toBeGreaterThan(0);

      // Should find our test note
      const foundNote = notes.find((n) => n.id.note_id === testNoteId);
      expect(foundNote).toBeDefined();
      expect(foundNote?.title).toBe('Integration Test Note');

      console.log(`✓ Listed notes for record: ${testRecordId}`);
    });

    it('should delete the note', async () => {
      if (!testNoteId) {
        throw new Error('No test note created');
      }

      await noteApi.deleteNote(testNoteId);

      // Verify deletion by trying to get it (should throw)
      await expect(noteApi.getNote(testNoteId)).rejects.toThrow();

      console.log(`✓ Deleted test note: ${testNoteId}`);

      // Mark as null so afterAll doesn't try to delete again
      testNoteId = null;
    });

    it('should delete the test record', async () => {
      if (!testRecordId) {
        throw new Error('No test record created');
      }

      await recordApi.deleteRecord('people', testRecordId);

      console.log(`✓ Deleted test record: ${testRecordId}`);

      testRecordId = null;
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid note ID', async () => {
      await expect(
        noteApi.getNote('invalid-note-id-12345')
      ).rejects.toThrow();
    });
  });
});
