import { MatchEvent } from '@/lib/api';

/**
 * Generate professional commentary-style descriptions for match events
 */
export function generateEventDescription(event: MatchEvent): string {
    // If description already exists, use it
    if (event.description) return event.description;
    if (event.data?.description) return event.data.description;

    const eventType = (event.typeName || event.type || '').toLowerCase();
    const data = event.data || {};
    const playerName = data.playerName || data.playerNames?.[0] || 'Player';
    const team = data.teamName || '';

    // Generate descriptions based on event type
    switch (eventType) {
        case 'goal':
            const assister = data.playerNames?.[1];
            if (assister) {
                return `⚽ GOAL! ${playerName} finds the back of the net! Brilliant assist from ${assister}!`;
            }
            return `⚽ GOAL! ${playerName} scores for ${team}! What a finish!`;

        case 'shot_on_target':
            return `🎯 ${playerName} fires a shot on target! The goalkeeper needs to be alert!`;

        case 'shot_off_target':
            return `⚽ ${playerName} takes a shot but it goes wide of the target.`;

        case 'shot_saved':
            return `🧤 Great save! ${playerName}'s shot is denied by the goalkeeper!`;

        case 'pass':
        case 'pass_completed':
            if (data.isKeyPass) {
                return `🔑 Key pass by ${playerName}! Creating a dangerous opportunity!`;
            }
            return `🔄 ${playerName} completes a pass in ${data.zone || 'midfield'}.`;

        case 'tackle':
        case 'tackle_won':
            return `💪 Excellent tackle by ${playerName}! Ball recovered!`;

        case 'interception':
            return `🛡️ ${playerName} reads the play and intercepts the ball!`;

        case 'clearance':
            return `🦶 ${playerName} clears the danger away!`;

        case 'foul':
            const victim = data.playerNames?.[1];
            if (victim) {
                return `🟨 Foul! ${playerName} brings down ${victim}.`;
            }
            return `🟨 ${playerName} commits a foul.`;

        case 'yellow_card':
            return `🟨 Yellow card for ${playerName}! The referee shows no mercy!`;

        case 'red_card':
            return `🟥 RED CARD! ${playerName} is sent off! ${team} down to 10 men!`;

        case 'corner':
        case 'corner_kick':
            return `🚩 Corner kick for ${team}. ${playerName} will take it.`;

        case 'throw_in':
            return `🤾 Throw-in for ${team} in the ${data.zone || 'middle third'}.`;

        case 'goal_kick':
            return `🥅 Goal kick for ${team}.`;

        case 'offside':
            return `🚩 Offside! ${playerName} was caught in an offside position.`;

        case 'substitution':
            const playerOut = data.playerNames?.[1];
            if (playerOut) {
                return `🔄 Substitution: ${playerName} comes on for ${playerOut}.`;
            }
            return `🔄 ${playerName} enters the match.`;

        case 'kickoff':
        case 'kick_off':
            return `⚽ Kick-off! The match is underway!`;

        case 'half_time':
            return `⏸️ Half-time whistle! Teams head to the dressing rooms.`;

        case 'full_time':
            return `🏁 Full-time! The match is over!`;

        case 'midfield_battle':
            return `⚔️ Intense battle for possession in midfield with ${playerName} involved.`;

        case 'attack':
        case 'attacking_move':
            return `⚡ ${team} pushing forward! ${playerName} drives the attack!`;

        case 'counter_attack':
            return `🏃 Counter-attack! ${playerName} leads the charge forward!`;

        case 'dribble':
        case 'dribble_success':
            return `✨ Brilliant dribbling from ${playerName}! Beats the defender!`;

        case 'cross':
            return `📤 ${playerName} delivers a cross into the box!`;

        case 'header':
            return `🎯 ${playerName} goes for the header!`;

        case 'penalty':
            return `🎯 PENALTY! ${playerName} steps up to take it!`;

        case 'free_kick':
            return `🎯 Free kick for ${team}. ${playerName} standing over it.`;

        case 'possession_change':
            return `🔄 Possession changes hands. ${team} now in control.`;

        case 'injury':
            return `🚑 ${playerName} is down injured. Play is stopped.`;

        default:
            // Fallback: capitalize and format the event type
            const formatted = eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            if (playerName !== 'Player') {
                return `${formatted} - ${playerName}`;
            }
            return formatted || 'Match event';
    }
}

/**
 * Get a short display name for the event type
 */
export function getEventTypeDisplay(event: MatchEvent): string {
    const eventType = event.eventType || event.typeName || event.type || 'event';
    return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get emoji icon for event type
 */
export function getEventIcon(event: MatchEvent): string {
    const eventType = (event.typeName || event.type || '').toLowerCase();
    
    switch (eventType) {
        case 'goal': return '⚽';
        case 'shot_on_target': return '🎯';
        case 'shot_off_target': return '⚽';
        case 'shot_saved': return '🧤';
        case 'pass': return '🔄';
        case 'tackle': return '💪';
        case 'interception': return '🛡️';
        case 'clearance': return '🦶';
        case 'foul': return '🟨';
        case 'yellow_card': return '🟨';
        case 'red_card': return '🟥';
        case 'corner': return '🚩';
        case 'throw_in': return '🤾';
        case 'goal_kick': return '🥅';
        case 'offside': return '🚩';
        case 'substitution': return '🔄';
        case 'kickoff':
        case 'kick_off': return '⚽';
        case 'half_time': return '⏸️';
        case 'full_time': return '🏁';
        case 'attack': return '⚡';
        case 'counter_attack': return '🏃';
        case 'dribble': return '✨';
        case 'cross': return '📤';
        case 'header': return '🎯';
        case 'penalty': return '🎯';
        case 'free_kick': return '🎯';
        default: return '⚪';
    }
}
