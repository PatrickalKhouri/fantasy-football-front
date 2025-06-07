import React from 'react';
import { FantasyLeague } from '../api/leagueQueries';


type Props = {
  league: FantasyLeague;
  currentUserId: number;
  onInviteClick?: () => void;
};

const LeagueSidebar: React.FC<Props> = ({ league, currentUserId, onInviteClick }) => {
  const isOwner = currentUserId === league.owner?.id;

  return (
    <aside style={{ padding: '1rem', width: '260px', borderRight: '1px solid #ddd' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>{league.name}</h2>
      <p>
        <strong>Owner:</strong> {league.owner?.firstName} {league.owner?.lastName}
      </p>
      <p>
        <strong>Teams:</strong> {league.members.length}
      </p>

      {isOwner && (
        <button
          onClick={onInviteClick}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Invite to League
        </button>
      )}
    </aside>
  );
};

export default LeagueSidebar;