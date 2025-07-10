
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
  },
  fantasyLeagues: {
    create: `${API_BASE_URL}/fantasy-leagues`,
    get: `${API_BASE_URL}/fantasy-leagues`,
    myLeagues: `${API_BASE_URL}/fantasy-leagues/my-leagues`,
    getLeague: `${API_BASE_URL}/fantasy-leagues`,
    getInvitesByLeagueId: (leagueId: number) => `${API_BASE_URL}/fantasy-leagues/${leagueId}/invites`,
    getLeagueMembers: (leagueId: number) => `${API_BASE_URL}/fantasy-leagues/${leagueId}/members`,
  },
  leagueInvites: {
    invite: `${API_BASE_URL}/league-invitations/invite-by-email`,
    accept: `${API_BASE_URL}/league-invitations/accept`,
    cancel: (inviteId: number) => `${API_BASE_URL}/league-invitations/${inviteId}`,
  }
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