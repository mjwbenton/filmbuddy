# Feature: Rolls V1

## Summary

Add and track active film rolls with film stock, ISO, and camera information.

## User Story

As a film photographer, I want to add and track my active film rolls so that I know what film is loaded in each camera.

## Scenarios

### Scenario: Add a new roll

- **GIVEN** I'm on the Rolls screen
- **WHEN** I tap "Add Roll", enter film stock, select ISO, enter camera, and save
- **THEN** the roll appears in my active rolls list with today's date shown

### Scenario: Attempt to save incomplete roll

- **GIVEN** I'm adding a new roll
- **WHEN** I try to save without filling in all three fields (film stock, ISO, camera)
- **THEN** I cannot save and the missing fields are indicated

### Scenario: Edit an active roll

- **GIVEN** I have an active roll
- **WHEN** I edit the film stock, ISO, or camera and save
- **THEN** the roll is updated with the new values

### Scenario: Attempt to save edit with missing fields

- **GIVEN** I'm editing an active roll
- **WHEN** I try to save with any field empty
- **THEN** I cannot save and the missing fields are indicated

### Scenario: Cannot edit finished rolls

- **GIVEN** I have a finished roll
- **WHEN** I view the roll
- **THEN** edit options are not available

### Scenario: Mark a roll as finished

- **GIVEN** I have an active roll
- **WHEN** I mark the roll as finished
- **THEN** it moves to the finished section with today's date shown as the finished date

### Scenario: Unmark a finished roll

- **GIVEN** I have a finished roll
- **WHEN** I unmark it as finished
- **THEN** it returns to the active rolls list

### Scenario: Delete an active roll

- **GIVEN** I have an active roll
- **WHEN** I delete the roll
- **THEN** it is permanently removed

### Scenario: Delete a finished roll

- **GIVEN** I have a finished roll
- **WHEN** I delete the roll
- **THEN** it is permanently removed

### Scenario: Rolls display order

- **GIVEN** I have multiple active and finished rolls
- **WHEN** I view the Rolls screen
- **THEN** active rolls appear first (most recently loaded first), followed by finished rolls (most recently finished first)

## Data Model

### Roll

| Field      | Type         | Notes                                                   |
| ---------- | ------------ | ------------------------------------------------------- |
| id         | string       | Unique identifier                                       |
| filmStock  | string       | Free text (e.g., "Portra 400")                          |
| iso        | number       | One of: 25, 50, 80, 100, 160, 200, 400, 800, 1600, 3200 |
| camera     | string       | Free text (e.g., "Leica M6")                            |
| loadedAt   | date         | Set when roll is created                                |
| finishedAt | date or null | Set when marked as finished, cleared when unmarked      |

## Wireframes

- [Rolls](../wireframes/rolls.html) - main list screen (Scenarios: Add, Display order)
- [Add Roll Sheet](../wireframes/roll-sheet.html) - adding a new roll (Scenarios: Add, Incomplete save)
- [Edit Roll Sheet](../wireframes/roll-sheet-edit.html) - editing an active roll (Scenarios: Edit, Incomplete edit, Mark finished, Delete active)
- [Finished Roll Sheet](../wireframes/roll-sheet-finished.html) - viewing a finished roll (Scenarios: Cannot edit, Unmark, Delete finished)

## Implementation Plan

### Status: Complete

### Tasks

1. [x] **Data layer**
   - [x] Update `rolls` table in `src/db/schema.ts` with full schema (filmStock, iso, camera, loadedAt, finishedAt)
   - [x] Generate Drizzle migration
   - [x] Create `Roll` and `NewRoll` types
   - [x] Add ISO constants to `src/types/roll.ts`

2. [x] **Unit tests** (write before implementation)
   - [x] `src/lib/roll-validation.test.ts` - validation logic for required fields
   - [x] `src/lib/roll-sorting.test.ts` - sorting helpers for active/finished rolls
   - [x] `src/lib/date-format.test.ts` - date formatting tests

3. [x] **Pure functions**
   - [x] `src/lib/roll-validation.ts` - `isValidRoll`, `getValidationErrors`
   - [x] `src/lib/roll-sorting.ts` - `sortRollsByDate`, `separateRolls`
   - [x] `src/lib/date-format.ts` - `formatRelativeDate` for "Loaded Nov 28" display

4. [x] **Store**
   - [x] `src/stores/rollStore.ts` - Zustand store with CRUD operations

5. [x] **Components**
   - [x] `src/components/RollCard.tsx` - card for roll display
   - [x] `src/components/RollForm.tsx` - form fields (filmStock, ISO picker, camera)
   - [x] `src/components/ISOPicker.tsx` - ISO selection component
   - [x] `src/components/SectionHeader.tsx` - "Active" / "Finished" headers

6. [x] **Screens**
   - [x] Update `app/(tabs)/index.tsx` - Rolls list screen
   - [x] `app/roll/add.tsx` - Add roll sheet (modal)
   - [x] `app/roll/[id].tsx` - Edit roll sheet (modal) or finished roll view

7. [x] **Maestro E2E tests**
   - [x] `e2e/flows/rolls-add-new-roll.yaml` - Scenario: Add a new roll
   - [x] `e2e/flows/rolls-incomplete-roll.yaml` - Scenario: Attempt to save incomplete roll
   - [x] `e2e/flows/rolls-edit-roll.yaml` - Scenario: Edit an active roll
   - [x] `e2e/flows/rolls-mark-finished.yaml` - Scenario: Mark a roll as finished
   - [x] `e2e/flows/rolls-unmark-finished.yaml` - Scenario: Unmark a finished roll
   - [x] `e2e/flows/rolls-delete-roll.yaml` - Scenario: Delete a roll
