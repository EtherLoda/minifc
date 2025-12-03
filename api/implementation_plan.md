# Implementation Plan - Player Potential System

## Goal
Implement a comprehensive Player Potential System where players have both current ability and potential ability (PA). Training allows players to grow towards their potential, with growth rates influenced by age, training slot type, and skill difficulty.

## User Review Required
> [!IMPORTANT]
> **Schema Change**: The `attributes` JSONB structure in `PlayerEntity` will change from a flat structure to `{ current: {...}, potential: {...} }`. This is a breaking change for existing data.
> **New Fields**: `potentialAbility` (PA), `potentialTier`, `trainingSlot` will be added to `PlayerEntity`.

## Proposed Changes

### Database Schema
#### [MODIFY] [player.entity.ts](file:///c:/Code/Project/GoalXI/libs/database/src/entities/player.entity.ts)
- Update `attributes` column type definition
- Add `potentialAbility` (int, 0-100)
- Add `potentialTier` (enum/string: LOW, REGULAR, HIGH_PRO, ELITE, LEGEND)
- Add `trainingSlot` (enum/string: GENIUS, REGULAR, NONE)
- Add `age` (int) - *Note: Can be derived, but storing might be easier for queries. Let's stick to derived from birthday for consistency, or add a virtual column.* -> *Decision: Add `age` column for easier querying/indexing.*

### Migrations
#### [NEW] `AddPlayerPotentialSystem`
- Add new columns
- Update existing rows (if any) with default values

### API Layer
#### [MODIFY] [player.service.ts](file:///c:/Code/Project/GoalXI/api/src/api/player/player.service.ts)
- Update `create` method to handle new structure
- Implement logic to generate potential attributes based on PA

#### [MODIFY] [player.dto.ts](file:///c:/Code/Project/GoalXI/api/src/api/player/dto/player.dto.ts)
- Update DTOs to reflect new attribute structure

### Seeding
#### [MODIFY] [seed-dev-data.ts](file:///c:/Code/Project/GoalXI/api/scripts/seed-dev-data.ts)
- Implement PA distribution logic (Pyramid model)
- Generate players with correct PA/CA spread
- Assign training slots

## Verification Plan
### Automated Tests
- Run `pnpm dev:seed` to verify data generation
- Check database to ensure correct JSON structure

### Manual Verification
- Verify PA distribution matches expected percentages
- Verify attribute values are within valid ranges
