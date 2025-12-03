# Task Checklist

- [ ] Implement Player Potential System
    - [/] Update `PlayerEntity` schema
        - [ ] Modify `attributes` to support `current` and `potential` structure
        - [ ] Add `potentialAbility` (PA) field
        - [ ] Add `potentialTier` field
        - [ ] Add `trainingSlot` field
        - [ ] Add `age` field (or derived from birthday)
    - [/] Create Database Migration
        - [ ] Generate migration for schema changes
        - [/] Apply migration
    - [ ] Update API Layer
        - [ ] Update `PlayerService` creation logic
        - [ ] Update `CreatePlayerDto` / `UpdatePlayerDto`
        - [ ] Update `PlayerResDto`
    - [ ] Update Seeder
        - [ ] Implement PA generation logic (Pyramid distribution)
        - [ ] Implement attribute generation based on PA
        - [ ] Update `seed-dev-data.ts`
