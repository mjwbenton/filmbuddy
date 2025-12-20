# Feature: Gear V1

## Summary

Manage your cameras, lenses, and film stocks so you can quickly select gear when logging rolls instead of typing.

## User Story

As a film photographer, I want to add and organize my cameras, lenses, and film stocks so that I have my gear library ready when I'm out shooting.

## Scenarios

### Scenario: Add a camera

- **GIVEN** I'm on the Gear screen
- **WHEN** I tap to add a camera, enter a name, and save
- **THEN** the camera appears in my cameras list

### Scenario: Add a lens

- **GIVEN** I'm on the Gear screen
- **WHEN** I tap to add a lens, enter a name, and save
- **THEN** the lens appears in my lenses list

### Scenario: Add a film stock

- **GIVEN** I'm on the Gear screen
- **WHEN** I tap to add a film stock, enter a name, and save
- **THEN** the film stock appears in my film stocks list

### Scenario: Edit a camera

- **GIVEN** I have a camera in my gear library
- **WHEN** I tap it, change the name, and save
- **THEN** the camera is updated with the new name

### Scenario: Edit a lens

- **GIVEN** I have a lens in my gear library
- **WHEN** I tap it, change the name, and save
- **THEN** the lens is updated with the new name

### Scenario: Edit a film stock

- **GIVEN** I have a film stock in my gear library
- **WHEN** I tap it, change the name, and save
- **THEN** the film stock is updated with the new name

### Scenario: Delete a gear item

- **GIVEN** I have a gear item (camera, lens, or film stock)
- **WHEN** I delete it
- **THEN** it is permanently removed from my library

### Scenario: Attempt to save with empty name

- **GIVEN** I'm adding or editing a gear item
- **WHEN** I try to save with an empty name
- **THEN** I cannot save and the field is indicated as required

### Scenario: Attempt to save duplicate name

- **GIVEN** I have a camera named "Leica M6"
- **WHEN** I try to save another camera with the same name
- **THEN** an error is shown and the item is not saved

### Scenario: Gear display order

- **GIVEN** I have multiple cameras (or lenses, or film stocks)
- **WHEN** I view the Gear screen
- **THEN** items are displayed oldest first (in the order they were added)

### Scenario: Empty gear library

- **GIVEN** I have no gear added
- **WHEN** I view the Gear screen
- **THEN** I see an empty state prompting me to add gear

## Wireframes

- [Gear](../wireframes/gear.html) - main list screen (Scenarios: Add, Display order, Empty state)
- [Camera Sheet](../wireframes/gear-camera-sheet.html) - adding/editing a camera (Scenarios: Add camera, Edit camera, Empty name, Duplicate, Delete)
- [Lens Sheet](../wireframes/gear-lens-sheet.html) - adding/editing a lens (Scenarios: Add lens, Edit lens, Empty name, Duplicate, Delete)
- [Film Stock Sheet](../wireframes/gear-film-stock-sheet.html) - adding/editing a film stock (Scenarios: Add film stock, Edit film stock, Empty name, Duplicate, Delete)
