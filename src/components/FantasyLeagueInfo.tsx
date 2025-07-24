import React from 'react';
import FantasyLeagueTeams from './FantasyLeagueTeams';
import FantasyLeagueSettings from './FantasyLeagueSettings';

interface Props {

  currentUserId: number;
  fantasyLeague: any;
}

const FantasyLeagueInfo: React.FC<Props> = ({ currentUserId, fantasyLeague}) => {
    return (
        <>
            <FantasyLeagueTeams fantasyLeague={fantasyLeague} />
            <FantasyLeagueSettings isOwner={fantasyLeague.owner?.id === currentUserId} fantasyLeague={fantasyLeague} />
        </>
    );
};

export default FantasyLeagueInfo;
