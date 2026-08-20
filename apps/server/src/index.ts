import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import { NetworkMessage, PlayerState } from '@class-clash/shared';
import { RoomManager } from './rooms/RoomManager.js';

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3001;

// Basic HTTP health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), server: 'CLASHA AUTHORITATIVE ENGINE' });
});

wss.on('connection', (socket: WebSocket) => {
  let currentRoomCode: string | null = null;
  let currentPlayerId: string | null = null;

  socket.on('message', (data: string) => {
    try {
      const msg: NetworkMessage = JSON.parse(data.toString());

      switch (msg.type) {
        case 'JOIN_ROOM': {
          const { roomCode, password, isHost, displayName, avatar } = msg.payload;
          const formattedCode = (roomCode || '').trim().toUpperCase();

          if (!formattedCode) {
            socket.send(
              JSON.stringify({
                type: 'ERROR_NOTIFICATION',
                payload: { message: 'PLEASE ENTER A VALID ROOM ID!' },
              })
            );
            break;
          }

          const existingRoom = RoomManager.getRoom(formattedCode);

          if (isHost) {
            // Host Creating Room with Room ID and Password
            const room = RoomManager.getOrCreateRoom(formattedCode);
            room.password = (password || '').trim();
            currentRoomCode = room.code;

            const playerId = `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            currentPlayerId = playerId;

            const newPlayer: PlayerState = {
              id: playerId,
              displayName: displayName || `Racer ${Math.floor(Math.random() * 900 + 100)}`,
              avatar: avatar || 'avatar_default',
              teamId: null,
              position: { x: 0, y: 1.5, z: 0 },
              rotationY: 0,
              velocity: { x: 0, y: 0, z: 0 },
              status: 'IDLE',
              isGrounded: true,
              isReady: false,
              connectionStatus: 'CONNECTED',
              score: 0,
              ping: 20,
            };

            room.players[playerId] = newPlayer;
            room.clients.set(playerId, socket);

            if (Object.keys(room.teams).length === 0) {
              room.createTeam(playerId, `${newPlayer.displayName}'S SQUAD`);
            }

            socket.send(
              JSON.stringify({
                type: 'ROOM_STATE',
                payload: {
                  playerId,
                  roomCode: room.code,
                  roomPassword: room.password || '',
                  players: room.players,
                  teams: room.teams,
                  tournament: room.tournament,
                },
              })
            );

            socket.send(
              JSON.stringify({
                type: 'SOLO_GAME_STATE',
                payload: room.soloGameManager.state,
              })
            );

            room.broadcast({
              type: 'ROOM_STATE',
              payload: {
                roomCode: room.code,
                roomPassword: room.password || '',
                players: room.players,
                teams: room.teams,
                tournament: room.tournament,
              },
            });

            room.broadcast({
              type: 'SOLO_GAME_STATE',
              payload: room.soloGameManager.state,
            });
          } else {
            // Player Joining Existing Room
            if (!existingRoom) {
              socket.send(
                JSON.stringify({
                  type: 'ERROR_NOTIFICATION',
                  payload: { message: 'ROOM NOT FOUND! PLEASE CHECK ROOM ID.' },
                })
              );
              break;
            }

            // Verify Password strictly
            if (existingRoom.password && existingRoom.password !== (password || '').trim()) {
              socket.send(
                JSON.stringify({
                  type: 'ERROR_NOTIFICATION',
                  payload: { message: 'INCORRECT ROOM PASSWORD! PLEASE ENTER THE CORRECT PASSWORD.' },
                })
              );
              break;
            }

            const room = existingRoom;
            currentRoomCode = room.code;

            const playerId = `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            currentPlayerId = playerId;

            const newPlayer: PlayerState = {
              id: playerId,
              displayName: displayName || `Racer ${Math.floor(Math.random() * 900 + 100)}`,
              avatar: avatar || 'avatar_default',
              teamId: null,
              position: { x: 0, y: 1.5, z: 0 },
              rotationY: 0,
              velocity: { x: 0, y: 0, z: 0 },
              status: 'IDLE',
              isGrounded: true,
              isReady: false,
              connectionStatus: 'CONNECTED',
              score: 0,
              ping: 20,
            };

            room.players[playerId] = newPlayer;
            room.clients.set(playerId, socket);

            const firstTeamId = Object.keys(room.teams)[0];
            if (firstTeamId) {
              room.joinTeam(playerId, firstTeamId);
            } else {
              room.createTeam(playerId, `${newPlayer.displayName}'S SQUAD`);
            }

            socket.send(
              JSON.stringify({
                type: 'ROOM_STATE',
                payload: {
                  playerId,
                  roomCode: room.code,
                  roomPassword: room.password || '',
                  players: room.players,
                  teams: room.teams,
                  tournament: room.tournament,
                },
              })
            );

            socket.send(
              JSON.stringify({
                type: 'SOLO_GAME_STATE',
                payload: room.soloGameManager.state,
              })
            );

            room.broadcast({
              type: 'ROOM_STATE',
              payload: {
                roomCode: room.code,
                roomPassword: room.password || '',
                players: room.players,
                teams: room.teams,
                tournament: room.tournament,
              },
            });

            room.broadcast({
              type: 'SOLO_GAME_STATE',
              payload: room.soloGameManager.state,
            });
          }
          break;
        }

        case 'CREATE_TEAM': {
          if (!currentRoomCode || !currentPlayerId) return;
          const room = RoomManager.getRoom(currentRoomCode);
          if (!room) return;

          const team = room.createTeam(currentPlayerId, msg.payload.teamName);
          room.broadcast({
            type: 'ROOM_STATE',
            payload: {
              roomCode: room.code,
              players: room.players,
              teams: room.teams,
              tournament: room.tournament,
            },
          });
          break;
        }

        case 'JOIN_TEAM': {
          if (!currentRoomCode || !currentPlayerId) return;
          const room = RoomManager.getRoom(currentRoomCode);
          if (!room) return;

          const success = room.joinTeam(currentPlayerId, msg.payload.teamId);
          if (success) {
            room.broadcast({
              type: 'ROOM_STATE',
              payload: {
                roomCode: room.code,
                players: room.players,
                teams: room.teams,
                tournament: room.tournament,
              },
            });
          }
          break;
        }

        case 'TOGGLE_READY': {
          if (!currentRoomCode || !currentPlayerId) return;
          const room = RoomManager.getRoom(currentRoomCode);
          if (!room) return;

          const player = room.players[currentPlayerId];
          if (player) {
            player.isReady = !player.isReady;
            if (player.teamId && room.teams[player.teamId]) {
              const member = room.teams[player.teamId].members.find((m) => m.id === currentPlayerId);
              if (member) {
                member.isReady = player.isReady;
              }
            }
            room.broadcast({
              type: 'ROOM_STATE',
              payload: {
                roomCode: room.code,
                players: room.players,
                teams: room.teams,
                tournament: room.tournament,
              },
            });
          }
          break;
        }

        case 'UPDATE_PLAYER': {
          if (!currentRoomCode || !currentPlayerId) return;
          const room = RoomManager.getRoom(currentRoomCode);
          if (!room) return;

          const player = room.players[currentPlayerId];
          if (player) {
            if (msg.payload.displayName) player.displayName = msg.payload.displayName;
            if (msg.payload.avatar) player.avatar = msg.payload.avatar;

            if (player.teamId && room.teams[player.teamId]) {
              const member = room.teams[player.teamId].members.find((m) => m.id === currentPlayerId);
              if (member) {
                if (msg.payload.displayName) member.displayName = msg.payload.displayName;
                if (msg.payload.avatar) member.avatar = msg.payload.avatar;
              }
            }

            room.broadcast({
              type: 'ROOM_STATE',
              payload: {
                roomCode: room.code,
                players: room.players,
                teams: room.teams,
                tournament: room.tournament,
              },
            });
          }
          break;
        }

        case 'START_TOURNAMENT': {
          if (!currentRoomCode) return;
          const room = RoomManager.getRoom(currentRoomCode);
          if (!room) return;

          room.startTournament();
          break;
        }

        case 'PLAYER_INPUT': {
          if (!currentRoomCode || !currentPlayerId) return;
          const room = RoomManager.getRoom(currentRoomCode);
          if (!room) return;

          room.handlePlayerInput(currentPlayerId, msg.payload);
          break;
        }

        case 'START_SOLO_GAME': {
          if (!currentRoomCode) return;
          const room = RoomManager.getRoom(currentRoomCode);
          if (room) room.soloGameManager.lockRoomAndStartGame();
          break;
        }

        case 'SUBMIT_PROPOSAL': {
          if (!currentRoomCode || !currentPlayerId) return;
          const room = RoomManager.getRoom(currentRoomCode);
          if (room && msg.payload?.text) {
            const senderName = room.players[currentPlayerId]?.displayName || 'Player';
            room.soloGameManager.submitProposal(currentPlayerId, senderName, msg.payload.text);
          }
          break;
        }

        case 'VOTE_PROPOSAL': {
          if (!currentRoomCode || !currentPlayerId) return;
          const room = RoomManager.getRoom(currentRoomCode);
          if (room && msg.payload?.proposalId) {
            room.soloGameManager.voteProposal(currentPlayerId, msg.payload.proposalId);
          }
          break;
        }

        case 'CONFIRM_CHALLENGE': {
          if (!currentRoomCode) return;
          const room = RoomManager.getRoom(currentRoomCode);
          if (room) room.soloGameManager.confirmChallenge();
          break;
        }

        case 'SKIP_PHASE': {
          if (!currentRoomCode) return;
          const room = RoomManager.getRoom(currentRoomCode);
          if (room) room.soloGameManager.advancePhase();
          break;
        }

        case 'SEND_CHAT': {
          if (!currentRoomCode || !currentPlayerId) return;
          const room = RoomManager.getRoom(currentRoomCode);
          if (room && msg.payload?.text) {
            const senderName = room.players[currentPlayerId]?.displayName || 'Player';
            room.soloGameManager.addChatMessage(currentPlayerId, senderName, msg.payload.text);
          }
          break;
        }

        case 'PING': {
          socket.send(
            JSON.stringify({
              type: 'PONG',
              payload: { timestamp: Date.now() },
            })
          );
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  });

  socket.on('close', () => {
    if (currentRoomCode && currentPlayerId) {
      const room = RoomManager.getRoom(currentRoomCode);
      if (room) {
        room.clients.delete(currentPlayerId);
        if (room.players[currentPlayerId]) {
          room.players[currentPlayerId].connectionStatus = 'DISCONNECTED';
          room.players[currentPlayerId].status = 'DISCONNECTED';
        }
        room.broadcast({
          type: 'ROOM_STATE',
          payload: {
            roomCode: room.code,
            players: room.players,
            teams: room.teams,
            tournament: room.tournament,
          },
        });
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`⚡ CLASHA Authoritative Game Server running on port ${PORT}`);
});
