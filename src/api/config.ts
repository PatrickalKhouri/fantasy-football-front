
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
    delete: (id: number) => `${API_BASE_URL}/fantasy-leagues/${id}`,
  },
  fantasyLeagueInvites: {
    invite: `${API_BASE_URL}/fantasy-league-invitations/invite-by-email`,
    accept: `${API_BASE_URL}/fantasy-league-invitations/accept`,
    cancel: (inviteId: number) => `${API_BASE_URL}/fantasy-league-invitations/${inviteId}`,
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
  },
  usersTeamsRoster: {
    addPlayer: `${API_BASE_URL}/user-team-rosters`,
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