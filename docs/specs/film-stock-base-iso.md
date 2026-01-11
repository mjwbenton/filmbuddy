# Feature: Film Stock Base ISO

## Summary

Store a base ISO for each film stock that becomes the default when selected.

## Dependencies

- [Gear V1](gear-v1.md) - Film stocks must exist before adding base ISO field

## User Story

As a film photographer, I want to store the base ISO for each film stock so that I don't have to remember and manually set it every time I load a roll.

## Scenarios

### Scenario: Add a film stock with base ISO

- **GIVEN** I'm on the Gear screen
- **WHEN** I tap to add a film stock, enter a name, select a base ISO, and save
- **THEN** the film stock appears in my list with the selected base ISO

### Scenario: Edit a film stock's base ISO

- **GIVEN** I have a film stock in my gear library
- **WHEN** I tap it, change the base ISO, and save
- **THEN** the film stock is updated with the new base ISO

### Scenario: Display base ISO on film stock card

- **GIVEN** I have film stocks in my gear library
- **WHEN** I view the Gear screen
- **THEN** each film stock card shows its base ISO

### Scenario: Default ISO for new film stocks

- **GIVEN** I'm adding a new film stock
- **WHEN** the form opens
- **THEN** the base ISO defaults to 400

## Wireframes

- [Film Stock Sheet](../wireframes/gear-film-stock-sheet.html) - Add/edit with ISO picker (Scenarios: Add, Edit, Default ISO)

## Implementation Notes

- Existing film stocks will receive base ISO of 400 via database migration
- Integration with roll creation is a separate future feature
