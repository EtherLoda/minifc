# GoalXI API Documentation

## Match Module

### Matches

#### List Matches
`GET /api/matches`

Retrieve a paginated list of matches with optional filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `leagueId` (optional): Filter by league ID
- `teamId` (optional): Filter by team ID (home or away)
- `season` (optional): Filter by season number
- `week` (optional): Filter by match week
- `status` (optional): Filter by match status (`SCHEDULED`, `TACTICS_LOCKED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`)
- `type` (optional): Filter by match type (`LEAGUE`, `CUP`, `FRIENDLY`, `TOURNAMENT`)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "leagueId": "uuid",
      "homeTeam": { "id": "uuid", "name": "Team A", "logo": "url" },
      "awayTeam": { "id": "uuid", "name": "Team B", "logo": "url" },
      "homeScore": 2,
      "awayScore": 1,
      "status": "COMPLETED",
      "scheduledAt": "2025-12-05T14:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

#### Get Match Details
`GET /api/matches/:id`

Retrieve detailed information for a specific match.

**Response:**
```json
{
  "id": "uuid",
  "leagueId": "uuid",
  "homeTeam": { ... },
  "awayTeam": { ... },
  "homeScore": 2,
  "awayScore": 1,
  "status": "COMPLETED",
  "tacticsLocked": true,
  "hasExtraTime": false,
  "simulationCompletedAt": "2025-12-05T16:00:00Z"
}
```

#### Get Match Events
`GET /api/matches/:id/events`

Retrieve all events for a completed or in-progress match.

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "GOAL",
    "typeName": "Goal",
    "minute": 15,
    "second": 30,
    "teamId": "uuid",
    "playerId": "uuid",
    "relatedPlayerId": "uuid", // Assist provider
    "data": { "distance": 12.5 }
  }
]
```

### Tactics

#### Get Match Tactics
`GET /api/matches/:id/tactics`

Retrieve tactics for both teams. If match is not completed, only returns tactics for the user's team.

**Response:**
```json
{
  "homeTactics": {
    "formation": "4-4-2",
    "lineup": [...],
    "substitutions": [...]
  },
  "awayTactics": { ... }
}
```

#### Submit Tactics
`POST /api/matches/:id/tactics`

Submit or update tactics for a match. Must be done before `TACTICS_LOCKED` status (30 mins before kickoff).

**Body:**
```json
{
  "formation": "4-3-3",
  "lineup": [
    { "playerId": "uuid", "position": "GK", "role": "GK_DEFEND" },
    ...
  ],
  "substitutions": [...],
  "instructions": { "mentality": "ATTACKING" },
  "presetId": "uuid" // Optional: Load from preset
}
```

### Tactics Presets

#### List Presets
`GET /api/matches/tactics/presets`

Retrieve all tactics presets for the user's team.

#### Create Preset
`POST /api/matches/tactics/presets`

Create a new tactics preset.

**Body:**
```json
{
  "name": "Standard 4-4-2",
  "formation": "4-4-2",
  "lineup": [...],
  "isDefault": true
}
```

---

## Statistics Module

### Match Statistics

#### Get Match Stats
`GET /api/stats/matches/:matchId`

Retrieve detailed team statistics for a specific match.

**Response:**
```json
{
  "matchId": "uuid",
  "homeTeamStats": {
    "possession": 55,
    "shots": 12,
    "shotsOnTarget": 5,
    "passes": 450,
    "passAccuracy": 0.85,
    "tackles": 15,
    "fouls": 10,
    "corners": 4,
    "offsides": 2,
    "yellowCards": 1,
    "redCards": 0
  },
  "awayTeamStats": { ... }
}
```

### Team Statistics

#### Get Team Season Stats
`GET /api/stats/teams/:teamId?season=1`

Retrieve aggregated season statistics for a team.

**Response:**
```json
{
  "teamId": "uuid",
  "season": 1,
  "matchesPlayed": 10,
  "wins": 6,
  "draws": 2,
  "losses": 2,
  "goalsFor": 18,
  "goalsAgainst": 10,
  "goalDifference": 8,
  "points": 20,
  "cleanSheets": 4
}
```
