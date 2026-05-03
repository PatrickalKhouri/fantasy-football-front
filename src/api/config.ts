
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const endpoints = {
  auth: {
    signup: `${API_BASE_URL}/users/signup`,
    signin: `${API_BASE_URL}/users/signin`,
    refresh: `${API_BASE_URL}/auth/refresh`,
    profile: `${API_BASE_URL}/auth/profile`,
  },
  users: {
    update: `${API_BASE_URL}/users/update`,
    findUserFantasyLeagueTeam: (id: number, fantasyLeagueId: number) => `${API_BASE_URL}/users/${id}/fantasy-leagues/${fantasyLeagueId}`,
  },
  fantasyLeagues: {
    create: `${API_BASE_URL}/fantasy-leagues`,
    get: `${API_BASE_URL}/fantasy-leagues`,
    myLeagues: `${API_BASE_URL}/fantasy-leagues/my-leagues`,
    getLeague: `${API_BASE_URL}/fantasy-leagues`,
    update: (id: number) => `${API_BASE_URL}/fantasy-leagues/${id}`,
    getInvitesByLeagueId: (id: number) => `${API_BASE_URL}/fantasy-leagues/${id}/invites`,
    getLeagueTeams: (id: number) => `${API_BASE_URL}/fantasy-leagues/${id}/teams`,
    getRosterSettings: (id: number) => `${API_BASE_URL}/fantasy-leagues/${id}/roster-settings`,
    getDraftSettings: (id: number) => `${API_BASE_URL}/fantasy-leagues/${id}/draft-settings`,
    getFantasyLeagueSeasons: (id: number) => `${API_BASE_URL}/fantasy-leagues/${id}/fantasy-league-seasons`,
    delete: (id: number) => `${API_BASE_URL}/fantasy-leagues/${id}`,
  },
  fantasyLeagueInvites: {
    invite: `${API_BASE_URL}/fantasy-league-invitations/invite-by-email`,
    accept: `${API_BASE_URL}/fantasy-league-invitations/accept`,
    cancel: (inviteId: number) => `${API_BASE_URL}/fantasy-league-invitations/${inviteId}`,
  },
  fantasyLeagueSeasons: {
    create: `${API_BASE_URL}/fantasy-league-seasons`,
    byLeague: (leagueId: number) => `${API_BASE_URL}/fantasy-league-seasons/by-league/${leagueId}`,
    get: (seasonId: string) => `${API_BASE_URL}/fantasy-league-seasons/${seasonId}`,
    activate: (seasonId: string) => `${API_BASE_URL}/fantasy-league-seasons/${seasonId}/activate`,
    update: (id: number) => `${API_BASE_URL}/fantasy-league-seasons/${id}`,
    scheduleDraft: (seasonId: string) => `${API_BASE_URL}/fantasy-league-seasons/${seasonId}/schedule-draft`,
  },
  rosterSettings: {
    update: (id: number) => `${API_BASE_URL}/roster-settings/${id}`,
  },
  draftSettings: {
    update: (id: number) => `${API_BASE_URL}/draft-settings/${id}`,
  },
  userTeams: {
    delete: (id: number) => `${API_BASE_URL}/user-teams/${id}`,
  },
  players: {
    getAll: `${API_BASE_URL}/players`,
    getFilters: `${API_BASE_URL}/players/filters/data`,
  },
  drafts: {
    get: (leagueId: number, season: number) => `${API_BASE_URL}/drafts/${leagueId}/${season}`,
    presence: (draftId: string) => `${API_BASE_URL}/drafts/${draftId}/presence`,
    resetTimer: (draftId: string) => `${API_BASE_URL}/drafts/${draftId}/reset-timer`,
    freeze: (draftId: string) => `${API_BASE_URL}/drafts/${draftId}/freeze`,
    unfreeze: (draftId: string) => `${API_BASE_URL}/drafts/${draftId}/unfreeze`,
    frozen: (draftId: string) => `${API_BASE_URL}/drafts/${draftId}/frozen`,
  },
  draftOrder: {
    get: (leagueId: number, season: number) => `${API_BASE_URL}/fantasy-leagues/${leagueId}/draft-order?season=${season}`,
    set: (leagueId: number) => `${API_BASE_URL}/fantasy-leagues/${leagueId}/draft-order`,
  },
  fantasyMatchups: {
    bySeason: (seasonId: string) => `${API_BASE_URL}/fantasy-matchups/season/${seasonId}`,
    byRound: (seasonId: string, round: number) => `${API_BASE_URL}/fantasy-matchups/season/${seasonId}/round/${round}`,
    byTeam: (seasonId: string, teamId: number) => `${API_BASE_URL}/fantasy-matchups/season/${seasonId}/team/${teamId}`,
    standings: (seasonId: string) => `${API_BASE_URL}/fantasy-matchups/season/${seasonId}/standings`,
    playoffs: (seasonId: string) => `${API_BASE_URL}/fantasy-matchups/season/${seasonId}/playoffs`,
    rosterSnapshot: (matchupId: string) => `${API_BASE_URL}/fantasy-matchups/${matchupId}/roster-snapshot`,
    scoreAll: (seasonId: string) => `${API_BASE_URL}/fantasy-matchups/season/${seasonId}/score-all`,
    validateConfig: `${API_BASE_URL}/fantasy-matchups/validate-config`,
    delete: (seasonId: string) => `${API_BASE_URL}/fantasy-matchups/season/${seasonId}`,
  },
  matches: {
    byRound: (seasonYear: number, roundNumber: number) =>
      `${API_BASE_URL}/matches/by-round?seasonYear=${seasonYear}&roundNumber=${roundNumber}`,
  },
  scoringConfig: {
    getBySeason: (seasonId: string) => `${API_BASE_URL}/scoring-config/season/${seasonId}`,
    update: (seasonId: string) => `${API_BASE_URL}/scoring-config/season/${seasonId}`,
  },
  playerFantasyPoints: {
    computeSeason: (seasonId: string) => `${API_BASE_URL}/player-fantasy-points/compute/season/${seasonId}`,
    rankings: (seasonId: string) => `${API_BASE_URL}/player-fantasy-points/rankings/season/${seasonId}`,
    redraft: (seasonId: string) => `${API_BASE_URL}/player-fantasy-points/redraft/season/${seasonId}`,
    playerHistory: (playerId: number, seasonId: string) => `${API_BASE_URL}/player-fantasy-points/player/${playerId}/season/${seasonId}`,
    byRound: (seasonId: string, roundNumber: number) => `${API_BASE_URL}/player-fantasy-points/season/${seasonId}/round/${roundNumber}`,
  },
  currentSeason: `${API_BASE_URL}/current-season`,
  usersTeamsRoster: {
    addPlayer: `${API_BASE_URL}/user-team-rosters`,
    replacePlayer: `${API_BASE_URL}/user-team-rosters/replace`,
    deletePlayer: (id: number) => `${API_BASE_URL}/user-team-rosters/${id}`,
    movePlayer: `${API_BASE_URL}/user-team-rosters/move`,
    getRoster: (userTeamId: number, season: number) => `${API_BASE_URL}/user-team-rosters/team/${userTeamId}/season/${season}`,
  },
};

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const queryConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
};

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints,
  headers,
  queryConfig,
};