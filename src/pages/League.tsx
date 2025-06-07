import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetLeague } from '../api/leagueQueries';
import LeagueSidebar from '../components/LeaguesSidebar';

const LeaguePage = ({ currentUserId }: { currentUserId: number }) => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { data: league, isLoading, error } = useGetLeague(Number(leagueId));

  if (isLoading) return <p>Loading...</p>;
  if (error || !league) return <p>Something went wrong.</p>;

  return (
    <div style={{ display: 'flex' }}>
      <LeagueSidebar
        league={league}
        currentUserId={currentUserId}
        onInviteClick={() => console.log('Open invite modal')}
      />
      <main style={{ padding: '2rem' }}>
        {/* League content here */}
      </main>
    </div>
  );
};

export default LeaguePage;
