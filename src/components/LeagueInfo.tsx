import React from 'react';
import LeagueMembers from './LeagueMembers';
import LeagueSettings from './LeagueSettings';

interface Props {
  leagueId: number;
  currentUserId: number;
  league: any;
}

const LeagueInfo: React.FC<Props> = ({ leagueId, currentUserId, league}) => {
    return (
        <>
            <LeagueMembers leagueId={leagueId} />
            <LeagueSettings leagueId={leagueId} isOwner={league.owner?.id === currentUserId} league={league} />
        </>
    );
};

export default LeagueInfo;
