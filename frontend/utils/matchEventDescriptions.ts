import { MatchEvent } from '@/lib/api';

/**
 * Professional commentary-style descriptions for match events
 * Each event type has 4 unique variations for variety
 */

// Event commentary variations - 4 versions per event type
const COMMENTARY: Record<string, string[]> = {
    // ==================== MATCH START / LINEUP ====================
    match_start: [
        "📋 The teams are in the tunnel! Today's matchup features {home} taking on {away} in what promises to be an exciting encounter!",
        "📋 We have our lineup announced! {home} and {away} both field strong sides for this crucial fixture!",
        "📋 The atmosphere is electric as we prepare for kickoff! {home} vs {away} - all eyes are on this match!",
        "📋 It's match day! The players are ready, the fans are singing, and we have an absolute thriller to look forward to between {home} and {away}!"
    ],

    // ==================== LINEUP ANNOUNCEMENT ====================
    lineup: [
        "📋 Starting XI for {team}: {players}",
        "📋 Here is the {team} lineup for today's match: {players}",
        "📋 {team} fields the following XI: {players}",
        "📋 The {team} manager has named this starting lineup: {players}"
    ],

    // ==================== FIRST HALF KICKOFF ====================
    first_half: [
        "⚽ And we're underway! The referee blows his whistle and we are LIVE for the first half!",
        "⚽ The first half kicks off! Both teams looking to make an early statement in this crucial match!",
        "⚽ 45 minutes of football await us! The players get us started - here we GO!",
        "⚽ We're underway at the stadium! {home} in their home colors against {away} in their away kit!"
    ],

    second_half_start: [
        "⚽ The second half is underway! Both teams emerge from the dressing rooms ready for battle!",
        "⚽ We are back for the second half! The managers have made their tactical tweaks - let's see what happens!",
        "⚽ Second half kickoff! The players are refreshed and ready to give us another 45 minutes of action!",
        "⚽ Round 2 begins! Both teams knowing that everything is still to play for in this match!"
    ],

    extra_time_start: [
        "⏱️ We go into extra time! The players trudge back onto the pitch for another 30 minutes of football!",
        "⏱️ 30 minutes to separate these two sides! Extra time begins with everything still in the balance!",
        "⏱️ The referee blows for extra time! What a test of character this will be for both sets of players!",
        "⏱️ We're not done yet! The players return for 30 more minutes of football in this epic encounter!"
    ],

    penalty_start: [
        "🎯 It's PENALTY TIME! The tension is absolutely unbearable as players line up for the shootout!",
        "🎯 The nerves of steel are about to be tested! We go to penalties - the ultimate lottery in football!",
        "🎯 5 penalties each, sudden death if needed! This is what dreams are made of - let's do this!",
        "🎯 The goalkeepers and penalty takers are prepared! It's time for the penalty shootout - may the best team win!"
    ],

    // ==================== GOAL ====================
    goal: [
        "⚽ GOAL! What a finish from {player}! The striker shows incredible composure inside the box and fires it past the helpless goalkeeper!",
        "⚽ GOAL! {player} finds the back of the net! A brilliant team move finished off clinically! The fans are going wild!",
        "⚽ It's a goal for {team}! {player} with a thunderous strike from outside the box - that one's destined for the top corner!",
        "⚽ GOAL!!! {player} does it again! That man lives for these moments - a predator in the box who never misses an opportunity!"
    ],

    // ==================== GOAL CELEBRATION ====================
    celebration: [
        "🎉 What a celebration from {player}! He slides across the pitch in pure joy as his teammates swarm around him!",
        "🎉 The {team} fans erupt in celebration! {player} runs to the corner flag with arms outstretched!",
        "🎉 Pure ecstasy for {player}! He celebrates with pure passion - this moment will live forever in his memory!",
        "🎉 The entire {team} bench is on the pitch! What a celebration to mark this magnificent goal by {player}!"
    ],

    // ==================== SHOT ON TARGET ====================
    shot_on_target: [
        "🎯 {player} fires a powerful shot towards goal! The goalkeeper stretches every sinew to make the save - what reflexes!",
        "🎯 Great effort from {player}! The shot dips and swerves, forcing the keeper into a full-stretch dive. He's got it covered!",
        "🎯 {player} lets fly from distance - it's heading for the corner... but the goalkeeper tips it over the bar! Brilliant save!",
        "🎯 A stinging effort from {player}! The shot is on target but the keeper stands tall and punches it clear!"
    ],

    // ==================== SHOT OFF TARGET ====================
    shot_off_target: [
        "⚽ {player} pulls the trigger... but he's dragged it wide of the post! So close, yet so far for {team}!",
        "⚽ The effort from {player} sails past the post! That was a glorious opportunity, but his aim let him down this time.",
        "⚽ {player} shoots... it misses the target entirely! The striker looks frustrated - he really should have done better there.",
        "⚽ Off the mark from {player}! The ball flies harmlessly into the stands as the fans breathe a collective sigh of relief."
    ],

    // ==================== SAVE ====================
    save: [
        "🧤 What a save! The goalkeeper produces a miracle stop with his fingertips - that was destined for the top corner!",
        "🧤 Brilliant goalkeeping! {player} stands like a statue and parries the fierce strike away from danger!",
        "🧤 The keeper pulls off an absolute world-class save! His reactions are lightning fast - we've just witnessed something special!",
        "🧤 Hands like a trampoline! The goalkeeper punches the ball clear with authority, showing who's boss in this penalty area!"
    ],

    // ==================== PASS ====================
    pass: [
        "🔄 {player} keeps possession alive with a neat pass, recycling the ball calmly under pressure from the opposition.",
        "🔄 Beautiful vision from {player}! He spots the teammate's run and delivers a precision pass right into their path.",
        "🔄 {player} spreads the play with a glorious cross-field ball - that's the kind of pass that splits defenses open!",
        "🔄 {player} receives the ball under pressure and shows excellent technique to turn and pass safely to a teammate."
    ],

    // ==================== KEY PASS ====================
    key_pass: [
        "🔑 WHAT A PASS! {player} threads the needle with a defense-splitting through ball - this is world-class playmaking!",
        "🔑 {player} with a sublime assist! He saw the run, calculated the trajectory, and delivered perfectly!",
        "🔑 The defense is carved open! {player} plays a magical pass that bends around the defenders like a boomerang!",
        "🔑 {player} pulls the strings in midfield and releases the striker with a peach of a through ball!"
    ],

    // ==================== TACKLE ====================
    tackle: [
        "💪 {player} wins the ball back with a perfectly timed challenge! The defender shows why he's considered one of the best.",
        "💪 A thunderous tackle from {player}! He leaves nothing in that challenge - ball cleared, player safe!",
        "💪 {player} slides in and scoops the ball away from the attacker - that's a textbook tackle if ever there was one!",
        "💪 The tackle from {player} is immaculate! He wins possession cleanly without committing a foul - referee's dream!"
    ],

    // ==================== INTERCEPTION ====================
    interception: [
        "🛡️ {player} reads the game like a book! He anticipates the pass and steps in to intercept - experience speaking!",
        "🛡️ Brilliant positional sense from {player}! He cuts out the pass with cat-like reflexes and starts a counter-attack!",
        "🛡️ {player} is in the right place at the right time! The through ball is read and intercepted brilliantly!",
        "🛡️ The pass is killed dead by {player}! He positioned himself perfectly to snuff out the danger in midfield."
    ],

    // ==================== CLEARANCE ====================
    clearance: [
        "🦶 When in doubt, clear it out! {player} boots the ball to safety under heavy pressure from the opposition attackers.",
        "🦶 {player} thumps the ball clear from the danger zone! A committed defensive header under extreme pressure!",
        "🦶 The defense is under siege but {player} comes to the rescue! He smashes the ball into row Z to clear the lines!",
        "🦶 {player} with a towering clearance! The ball flies high and far, relieving all that pressure from the box."
    ],

    // ==================== FOUL ====================
    foul: [
        "🟨 The referee blows his whistle! {player} clips the heels of the winger and that was a clear foul.",
        "🟨 {player} goes into the referee's book for a rash challenge - he caught his opponent late and high.",
        "🟨 The attacker is down after being taken out by {player} - no question about that booking!",
        "🟨 {player} makes a desperate lunge and brings down his man. The yellow card is justly shown."
    ],

    // ==================== YELLOW CARD ====================
    yellow_card: [
        "🟨 The referee reaches for his pocket... and it's a YELLOW CARD for {player}! A stern warning for the defender.",
        "🟨 Booking for {player}! He will have to be careful now - one more mistake and he'll be watching from the stands!",
        "🟨 {player} becomes the first player to go into the book today. That was a silly challenge really.",
        "🟨 The yellow card is shown to {player} - perhaps a bit harsh, but the referee has made his decision."
    ],

    // ==================== RED CARD ====================
    red_card: [
        "🟥 RED CARD!!! The referee shows the straight red to {player}! {team} is reduced to ten men!",
        "🟥 That's a sending off for {player}! A second yellow would have been enough, but the referee went straight for red!",
        "🟥 Disaster for {team}! {player} sees red for a professional foul - the dream is turning into a nightmare!",
        "🟥 The players surround the referee... but it's still red! {player} trudges off in disbelief, leaving his team in trouble."
    ],

    // ==================== FORFEIT ====================
    forfeit: [
        "📢 The referee has confirmed a FORFEIT! {forfeiting} has withdrawn from the match! {winner} is awarded the victory!",
        "📢 This is unprecedented! {forfeiting} has forfeited the match, meaning {winner} takes the three points!",
        "📢 The match has been awarded to {winner} after {forfeiting} was unable to continue - a disappointing end to proceedings!",
        "📢 {winner} is declared the winner by forfeit as {forfeiting} can no longer field a team. The final score will be recorded as 3-0."
    ],

    // ==================== CORNER ====================
    corner: [
        "🚩 Corner kick for {team}! {player} steps up to deliver the set piece into the danger zone.",
        "🚩 The flag kicks come out for {team}! {player} will take this corner - can he find a teammate in the box?",
        "🚩 {player} curls the ball towards the near post... searching for that decisive header from his striker!",
        "🚩 It's a corner for {team}, and {player} takes it with his trusted left foot - let's see what he can produce."
    ],

    // ==================== FREE KICK ====================
    free_kick: [
        "🎯 Free kick in a dangerous position for {team}! {player} stands over the ball, ready to deliver.",
        "🎯 The wall is formed... {player} takes a deep breath... and strikes the free kick beautifully!",
        "🎯 {player} lines up the free kick - this could be the moment of magic we've been waiting for!",
        "🎯 From 20 yards out, it's {player}'s moment. He bends it around the wall... and the keeper tips it over!"
    ],

    // ==================== PENALTY ====================
    penalty: [
        "🎯 PENALTY for {team}! The referee points to the spot after that handball in the box!",
        "🎯 This is the moment everyone dreads! {player} steps up to take the penalty - the fate of the match in his hands!",
        "🎯 The goalkeeper guesses the right way... but {player} places it perfectly into the corner! NO MISTAKE!",
        "🎯 The striker places the ball on the spot, takes his run-up... and fires it into the roof of the net!"
    ],

    // ==================== THROW IN ====================
    throw_in: [
        "🤾 Throw-in for {team} in the attacking third. {player} prepares to launch the ball back into play.",
        "🤾 {player} gets the throw-in and looks to find a teammate with his long throw into the penalty area.",
        "🤾 Quick throw-in from {player}! He catches the defense napping and gets the ball back into play swiftly.",
        "🤾 The ball is thrown in by {player}, who looks to create a quick attacking opportunity from the set piece."
    ],

    // ==================== GOAL KICK ====================
    goal_kick: [
        "🥅 Goal kick for {team}. The goalkeeper takes it quickly to try and catch the opposition off guard.",
        "🥅 The goalkeeper takes the goal kick and launches the ball deep into the opposing half.",
        "🥅 {team} gets a goal kick, and the keeper distributes it short to his defenders to build from the back.",
        "🥅 The referee signals for a goal kick - the defense reorganizes as the keeper prepares to kick."
    ],

    // ==================== OFFSIDE ====================
    offside: [
        "🚩 The assistant referee raises his flag! {player} was caught straying behind the defensive line - offside!",
        "🚩 Offside against {player}! The striker timed his run a fraction too early and the flag goes up.",
        "🚩 The flag is up for offside! {player} was in acres of space but it was all for nothing - not his day!",
        "🚩 Brilliant detection by the assistant! {player} was denied by the narrowest of margins - offside!"
    ],

    // ==================== SUBSTITUTION ====================
    substitution: [
        "🔄 Substitution for {team}! {player} comes off to be replaced by {sub}. Let's see if this change works.",
        "🔄 {player} is coming off after a hard day's work, and {sub} is warming up ready to make his entrance!",
        "🔄 A tactical substitution! {player} trudges off and {sub} comes on to freshen things up for {team}.",
        "🔄 Here comes the substitute! {sub} replaces the tiring {player} - this could be a game-changing move!"
    ],

    // ==================== INJURY ====================
    injury: [
        "🚑 This doesn't look good for {player}! He's down and receiving treatment from the medical staff.",
        "🚑 Play is stopped as {player} receives attention. The trainer is on the pitch assessing the situation.",
        "🚑 {player} appears to be in some discomfort. The referee allows the medical team to come on.",
        "🚑 The game pauses as {player} gets treatment. Let's hope it's nothing serious and he can continue."
    ],

    // ==================== HALF TIME ====================
    half_time: [
        "⏸️ And that's half-time! The players head to the dressing rooms. What will the second half bring?",
        "⏸️ The referee blows for half-time! The stats show an even contest so far. Stay tuned for the second half!",
        "⏸️ Half-time arrives with everything still to play for! Both managers will be making some big decisions in the break.",
        "⏸️ The first 45 minutes are in the books! A thrilling half of football comes to an end - more of the same please!"
    ],

    // ==================== FULL TIME ====================
    full_time: [
        "🏁 Full-time whistle! The match ends {home_score}-{away_score} in what has been a fantastic encounter!",
        "🏁 The referee calls time on the game! What a match it's been! The players exchange handshakes as we wrap up.",
        "🏁 And that's the final whistle! The fans rise to applaud their heroes after a thrilling 90 minutes!",
        "🏁 It's all over! The players are exhausted but satisfied after a hard-fought battle from both sides!"
    ],

    // ==================== COUNTER ATTACK ====================
    counter_attack: [
        "🏃 {team} breaks on the counter with lightning speed! {player} leads the charge and has acres of space ahead!",
        "🏃 Caught on the break! {player} surges forward with the ball, leaving the defense trailing in his wake!",
        "🏃 The counter-attack is launched! {player} picks up the ball in his own half and sprints forward!",
        "🏃 What a chance on the break! {player} finds himself through on goal with only the keeper to beat!"
    ],

    // ==================== DRIBBLE ====================
    dribble: [
        "✨ {player} embarrasses his defender with a sublime piece of skill! The ball glides past him like he's not there!",
        "✨ A dazzling run from {player}! He skips past three challenges as if they weren't even there!",
        "✨ {player} shows incredible close control, weaving through the defense with the ball glued to his feet!",
        "✨ The defender is left looking at the wrong end of {player}'s boots! What an incredible piece of dribbling!"
    ],

    // ==================== CROSS ====================
    cross: [
        "📤 {player} whips in a delicious cross towards the far post! The striker attacks the space but just misses it!",
        "📤 A pin-point cross from {player}! He finds his target with a beautiful set-piece delivery!",
        "📤 The ball swings into the box from {player}'s cross - the goalkeeper punches it clear under pressure!",
        "📤 {player} stands over the ball... he floats it into the danger zone looking for the headed finish!"
    ],

    // ==================== HEADER ====================
    header: [
        "🎯 {player} rises highest to meet the cross! He plants a powerful header towards the bottom corner... but it's wide!",
        "🎯 A towering leap from {player}! He connects cleanly with the ball but unfortunately heads it over the bar!",
        "🎯 {player} times his jump to perfection and meets the cross with a thumping header! The keeper tips it over!",
        "🎯 The cross comes in and {player} meets it with his forehead - it dips at the last moment and goes over!"
    ],

    // ==================== POSSESSION CHANGE ====================
    possession_change: [
        "🔄 Possession changes hands in midfield! {team} loses the ball and the opposition looks to counter!",
        "🔄 The ball is turned over and {team} suddenly finds themselves without possession!",
        "🔄 A loose ball in midfield is won by {team}! They quickly transition to attack mode!",
        "🔄 {player} is dispossessed and the ball rolls loose! The opposition breaks with numbers!"
    ],

    // ==================== MIDFIELD BATTLE ====================
    midfield_battle: [
        "⚔️ A proper tussle in midfield! Both teams fighting tooth and nail for control of this crucial area!",
        "⚔️ The battle for midfield supremacy is in full swing! {player} wins a crucial header to start an attack!",
        "⚔️ Neither team can gain control in this congested midfield area! It's becoming a war of attrition!",
        "⚔️ {player} wins the physical battle in midfield and drives forward with purpose for {team}!"
    ],

    // ==================== ATTACK ====================
    attack: [
        "⚡ {team} is pushing forward with intent! The attack is building with patience and purpose!",
        "⚡ {player} drives into the attacking third and looks to create a chance for his team!",
        "⚡ Danger brewing! {team} commits players forward in search of the opening goal!",
        "⚡ The {team} attack flows beautifully through the thirds, moving the ball with crisp one-touch football!"
    ],

    // ==================== NEUTRAL EVENTS ====================
    neutral_event: [
        "📢 The crowd generates an incredible atmosphere! The fans are making themselves heard in this crucial match!",
        "📢 Both sets of fans are singing their hearts out! This is what football is all about - pure passion!",
        "📢 The atmosphere at the stadium is absolutely electric! Every pass, every tackle is met with thunderous noise!",
        "📢 The supporters create a wall of sound! This is the beautiful game at its very best!"
    ],

    // ==================== KICKOFF (Original) ====================
    kickoff: [
        "⚽ And we're underway! The referee blows his whistle and {team} gets us started in this crucial match!",
        "⚽ The match kicks off with both teams looking to make an early statement! Here we go!",
        "⚽ 90 minutes of football await us! {team} gets the ball rolling in what promises to be an exciting encounter!",
        "⚽ We're underway at the stadium! Both sets of players are looking eager to impress from the first whistle!"
    ],
};

/**
 * Generate commentary for a match event based on its type and descriptionIndex
 */
export function generateEventDescription(event: MatchEvent): string {
    const data = event.data || {};
    const playerName = data.playerName || data.playerNames?.[0] || 'Player';
    const team = data.teamName || data.team || '';
    const homeTeam = data.homeTeam || '';
    const awayTeam = data.awayTeam || '';
    const shirt = data.shirtNumber || Math.floor(Math.random() * 99 + 1);
    const homeScore = data.homeScore || 0;
    const awayScore = data.awayScore || 0;
    const subName = data.subName || data.playerNames?.[1] || 'substitute';
    const forfeitingTeam = data.forfeitingTeam || '';
    const winnerTeam = data.winner || '';
    const players = data.players || [];
    const playerList = players.map((p: any) => `${p.name} (${p.position})`).join(', ');

    const eventTypeRaw = event.typeName || event.type || '';
    const eventType = eventTypeRaw.toLowerCase().replace(/_/g, '').replace(/start/g, '');

    // Get descriptionIndex (1-4), default to 1 if not provided
    const descriptionIndex = data.descriptionIndex || event.descriptionIndex || 1;
    const variationIndex = Math.min(Math.max(descriptionIndex, 1), 4) - 1;

    // Handle different event types
    let key = eventType;
    if (eventType.includes('match') && eventType.includes('start')) {
        key = 'matchstart';
    } else if (eventType === 'kickoff' && eventTypeRaw.toLowerCase().includes('second')) {
        key = 'secondhalfstart';
    } else if (eventType === 'kickoff' && eventTypeRaw.toLowerCase().includes('extra')) {
        key = 'extratimestart';
    } else if (eventType === 'kickoff' && eventTypeRaw.toLowerCase().includes('penalty')) {
        key = 'penaltypstart';
    } else if (eventType === 'kickoff' || eventType === 'firsthalf') {
        key = 'firsthalf';
    } else if (eventType === 'lineup') {
        key = 'lineup';
    }

    const variations = COMMENTARY[key] || COMMENTARY[eventType] || COMMENTARY.default || [];

    if (variations.length === 0) {
        return `Match event: ${playerName}`;
    }

    const template = variations[variationIndex] || variations[0];

    return template
        .replace(/{player}/g, playerName)
        .replace(/{team}/g, team)
        .replace(/{sub}/g, subName)
        .replace(/{home}/g, homeTeam)
        .replace(/{away}/g, awayTeam)
        .replace(/{shirt}/g, String(shirt))
        .replace(/{home_score}/g, String(homeScore))
        .replace(/{away_score}/g, String(awayScore))
        .replace(/{forfeiting}/g, forfeitingTeam)
        .replace(/{winner}/g, winnerTeam)
        .replace(/{players}/g, playerList);
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
    const eventType = (event.typeName || event.type || '').toLowerCase().replace(/_/g, '');

    const iconMap: Record<string, string> = {
        goal: '⚽', shotontarget: '🎯', shotofftarget: '⚽', save: '🧤',
        pass: '🔄', keypass: '🔑', tackle: '💪', interception: '🛡️',
        clearance: '🦶', foul: '🟨', yellowcard: '🟨', redcard: '🟥',
        corner: '🚩', throwin: '🤾', goalkick: '🥅', offside: '🚩',
        substitution: '🔄', injury: '🚑', kickoff: '⚽', halftime: '⏸️',
        fulltime: '🏁', counterattack: '🏃', dribble: '✨', cross: '📤',
        header: '🎯', freekick: '🎯', penalty: '🎯', possessionchange: '🔄',
        midfieldbattle: '⚔️', attack: '⚡', forfeit: '📢',
        matchstart: '📋', secondhalfstart: '⚽', extratimestart: '⏱️',
        penaltystart: '🎯', lineup: '📋', celebration: '🎉',
        neutralevent: '📢',
    };

    return iconMap[eventType] || '⚪';
}

/**
 * Get all 4 variations for preview purposes
 */
export function getEventVariations(eventType: string): string[] {
    const key = eventType.toLowerCase().replace(/_/g, '');
    return COMMENTARY[key] || COMMENTARY.default || [];
}
