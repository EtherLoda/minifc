export const GAME_SETTINGS = {
    SEASON_LENGTH_WEEKS: 16,
    DAYS_PER_WEEK: 7,
    get DAYS_PER_YEAR() {
        return this.SEASON_LENGTH_WEEKS * this.DAYS_PER_WEEK;
    },
    get MS_PER_YEAR() {
        return this.DAYS_PER_YEAR * 24 * 60 * 60 * 1000;
    }
};
