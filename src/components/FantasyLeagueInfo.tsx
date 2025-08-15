import React from 'react';
import FantasyLeagueTeams from './FantasyLeagueTeams';
import FantasyLeagueSettings from './FantasyLeagueSettings';
import { FantasyLeague } from '../api/fantasyLeagueQueries';

interface Props {

  currentUserId: number;
  fantasyLeague: FantasyLeague;
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
