import {
  TournamentState,
  TournamentStage,
  TournamentBracketNode,
  Matchup,
  Team,
  PlayerState,
  GAME_RULES,
} from '@class-clash/shared';

export class TournamentManager {
  public static createTournament(code: string, teamsMap: Record<string, Team>): TournamentState {
    const teams = Object.values(teamsMap);
    const numTeams = teams.length;

    const stage: TournamentStage = 'LOBBY';
    const bracket: TournamentBracketNode[] = [];

    // Simple 4-team or 8-team bracket setup
    if (numTeams >= 4) {
      // Quarter / Semi match 1
      bracket.push({
        id: 'match_semi_1',
        stage: 'SEMI_FINALS',
        matchup: {
          id: 'match_semi_1',
          roundName: 'SEMI FINAL 1',
          team1Id: teams[0]?.id || '',
          team2Id: teams[1]?.id || '',
          status: 'PENDING',
        },
        nextMatchupId: 'match_final',
      });

      bracket.push({
        id: 'match_semi_2',
        stage: 'SEMI_FINALS',
        matchup: {
          id: 'match_semi_2',
          roundName: 'SEMI FINAL 2',
          team1Id: teams[2]?.id || '',
          team2Id: teams[3]?.id || '',
          status: 'PENDING',
        },
        nextMatchupId: 'match_final',
      });

      bracket.push({
        id: 'match_final',
        stage: 'FINALS',
        matchup: {
          id: 'match_final',
          roundName: 'GRAND FINAL',
          team1Id: '',
          team2Id: '',
          status: 'PENDING',
        },
      });
    }

    return {
      id: `tourney_${Date.now()}`,
      code,
      stage,
      teams: teamsMap,
      bracket,
      currentMatchupId: bracket[0]?.id,
    };
  }

  public static calculateMatchResult(
    matchup: Matchup,
    team1: Team,
    team2: Team,
    finishedPlayers: PlayerState[]
  ): { winningTeamId: string; team1Score: number; team2Score: number } {
    let team1Score = 0;
    let team2Score = 0;

    let team1FinishedCount = 0;
    let team2FinishedCount = 0;

    finishedPlayers.forEach((player, index) => {
      const points = GAME_RULES.FINISH_POINTS[index] || 10;
      if (player.teamId === team1.id) {
        team1Score += points;
        team1FinishedCount++;
      } else if (player.teamId === team2.id) {
        team2Score += points;
        team2FinishedCount++;
      }
    });

    // Team completion bonus (+100 if all 4 finish)
    if (team1FinishedCount >= 4) team1Score += GAME_RULES.TEAM_COMPLETION_BONUS;
    if (team2FinishedCount >= 4) team2Score += GAME_RULES.TEAM_COMPLETION_BONUS;

    let winningTeamId = team1.id;
    if (team2Score > team1Score) {
      winningTeamId = team2.id;
    } else if (team2Score === team1Score) {
      // Tie breaker: team with the single highest finishing player
      const topPlayer = finishedPlayers[0];
      if (topPlayer && topPlayer.teamId === team2.id) {
        winningTeamId = team2.id;
      }
    }

    return { winningTeamId, team1Score, team2Score };
  }

  public static advanceBracket(
    tournament: TournamentState,
    completedMatchupId: string,
    winningTeamId: string
  ): void {
    const currentNodeIndex = tournament.bracket.findIndex((node) => node.id === completedMatchupId);
    if (currentNodeIndex === -1) return;

    const currentNode = tournament.bracket[currentNodeIndex];
    currentNode.matchup.status = 'COMPLETED';
    currentNode.matchup.winnerTeamId = winningTeamId;

    // Advance team status
    if (tournament.teams[winningTeamId]) {
      tournament.teams[winningTeamId].status = 'ADVANCED';
      tournament.teams[winningTeamId].wins += 1;
    }

    // Set losing team as eliminated
    const losingTeamId =
      currentNode.matchup.team1Id === winningTeamId
        ? currentNode.matchup.team2Id
        : currentNode.matchup.team1Id;
    if (losingTeamId && tournament.teams[losingTeamId]) {
      tournament.teams[losingTeamId].status = 'ELIMINATED';
      tournament.teams[losingTeamId].losses += 1;
    }

    // Move to next bracket node (Grand Final or Champion stage)
    if (currentNode.nextMatchupId) {
      const nextNode = tournament.bracket.find((node) => node.id === currentNode.nextMatchupId);
      if (nextNode) {
        if (!nextNode.matchup.team1Id) {
          nextNode.matchup.team1Id = winningTeamId;
        } else if (!nextNode.matchup.team2Id) {
          nextNode.matchup.team2Id = winningTeamId;
        }
        tournament.currentMatchupId = nextNode.id;
      }
    } else {
      // Champion crowned!
      tournament.stage = 'CHAMPION';
      tournament.championTeamId = winningTeamId;
      if (tournament.teams[winningTeamId]) {
        tournament.teams[winningTeamId].status = 'CHAMPION';
      }
    }
  }
}
