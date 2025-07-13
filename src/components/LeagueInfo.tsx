import React from 'react';
import LeagueTeams from './LeagueTeams';
import LeagueSettings from './LeagueSettings';

interface Props {
  leagueId: number;
  currentUserId: number;
  league: any;
}

const LeagueInfo: React.FC<Props> = ({ leagueId, currentUserId, league}) => {
    return (
        <>
            <LeagueTeams leagueId={leagueId} />
            <LeagueSettings leagueId={leagueId} isOwner={league.owner?.id === currentUserId} league={league} />
        </>
    );
};

export default LeagueInfo;
