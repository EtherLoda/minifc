# Player Age System Design

## Problem

The game uses a compressed time system where:

- **Real World**: 1 year = 52 weeks = 365 days
- **Game World**: 1 season = 16 weeks = 112 days

This creates a discrepancy in how player ages should be calculated and displayed.

## Current Implementation

Players currently have a fixed `age` field (integer) that doesn't account for the compressed time system.

## Proposed Solutions

### Option 1: Game Age (Recommended)

Use "game years" where players age based on game seasons:

- 1 game year = 1 season (16 weeks)
- Players age by 1 year every season
- Display age as normal (e.g., "Age 24")

**Pros:**

- Simple to implement
- Easy for players to understand
- Matches traditional football manager games

**Cons:**

- Players age faster than real-time
- A 20-year-old becomes 30 in 10 seasons (about 2.5 real years if playing weekly)

### Option 2: Real-Time Age Scaling

Scale ages based on the time compression ratio:

- Ratio: 52 weeks / 16 weeks = 3.25x
- A player who is "24 game years" old is effectively "24 / 3.25 = 7.4 real years" into their career
- Display: "Age 24 (Career Year 7)"

**Pros:**

- More realistic career progression
- Players don't age too quickly

**Cons:**

- More complex to explain
- Confusing UI

### Option 3: Hybrid System (Best Balance)

- Use game years for aging (1 year per season)
- Adjust career peak and decline curves to match compressed time
- Peak age: 26-28 (instead of 28-30)
- Retirement age: 32-34 (instead of 35-37)

**Implementation:**

```typescript
// In player generation
const PEAK_AGE_START = 26;
const PEAK_AGE_END = 28;
const DECLINE_START = 29;
const RETIREMENT_AGE = 34;

// Attribute development curve
function getAgeMultiplier(age: number): number {
    if (age < 18) return 0.6;  // Youth
    if (age < 22) return 0.8;  // Development
    if (age < PEAK_AGE_START) return 0.95; // Pre-peak
    if (age <= PEAK_AGE_END) return 1.0;   // Peak
    if (age < DECLINE_START + 3) return 0.95; // Early decline
    if (age < RETIREMENT_AGE) return 0.85;    // Late career
    return 0.7; // Veteran
}
```

## Recommendation

Use **Option 3 (Hybrid System)**:

1. Keep simple integer ages
2. Players age 1 year per season
3. Adjust peak/decline curves for compressed time
4. Update retirement age to 32-34
5. Faster attribute development for young players

## Implementation Steps

1. ✅ Update seed script to use decimal attributes (already done)
2. ✅ Hide decimals from users via API (already done)
3. ⏳ Adjust age-based attribute calculations
4. ⏳ Update retirement logic
5. ⏳ Add season-end aging system
