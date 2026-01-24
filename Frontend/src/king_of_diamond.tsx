// import { Player, GameEngine } from './GameEngine';

export interface PlayerData {
	id: string;
	name: string;
	roundScores: number[];
	currentDice: number[];
}

export class Player {
	id: string;
	name: string;
	currentDice: number[] = [0, 0, 0];
	roundScores: number[] = [0, 0, 0];

	constructor(name: string) {
		this.id = this.generateId();
		this.name = name;
	}

	generateId(): string {
		return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	rollDice(): number[] {
		this.currentDice = [
			Math.floor(Math.random() * 6) + 1,
			Math.floor(Math.random() * 6) + 1,
			Math.floor(Math.random() * 6) + 1
		];
		return this.currentDice;
	}

	calculateRoundScore(roundIndex: number): number {
		const score = (this.currentDice.reduce((a, b) => a + b, 0)) % 9 + 1;
		this.roundScores[roundIndex] = score;
		return score;
	}

	getTotalScore(): number {
		return this.roundScores.reduce((a, b) => a + b, 0);
	}

	getDiceSum(): number {
		return this.currentDice.reduce((a, b) => a + b, 0);
	}

	resetDice(): void {
		this.currentDice = [0, 0, 0];
	}

	toJSON(): PlayerData {
		return {
			id: this.id,
			name: this.name,
			roundScores: this.roundScores,
			currentDice: this.currentDice
		};
	}
}

export type GameState = 'SETUP' | 'PLAYING' | 'FINISHED';

export interface GameStateData {
	state: GameState;
	currentRound: number;
	maxRounds: number;
	hasRolledThisRound: boolean;
	players: PlayerData[];
	roundWinner: PlayerData | null;
}

export class GameEngine {
	players: Player[] = [];
	currentRound: number = 1;
	maxRounds: number = 3;
	hasRolledThisRound: boolean = false;
	gameState: GameState = 'SETUP';

	constructor() {
		this.players = [];
		this.currentRound = 1;
		this.maxRounds = 3;
		this.hasRolledThisRound = false;
		this.gameState = 'SETUP'; // SETUP, PLAYING, FINISHED
	}

	addPlayer(name: string): Player {
		if (!name || name.trim() === '')
			throw new Error('Player name cannot be empty');

		if (this.players.some(p => p.name === name))
			throw new Error('Player name already exists');

		const player = new Player(name);
		this.players.push(player);
		console.log(`Player added: ${name}`);
		return player;
	}

	removePlayer(playerId: string): boolean {
		const index = this.players.findIndex(p => p.id === playerId);
		if (index !== -1) {
			this.players.splice(index, 1);
			console.log(`Player removed: ${playerId}`);
			return true;
		}
		return false;
	}

	canStartGame(): boolean {
		console.log(`Current players: ${this.players.length}`);
		return this.players.length >= 2;
	}

	startGame(): void {
		if (!this.canStartGame())
			throw new Error('Need at least 2 players to start');
		console.log('Game started');
		this.gameState = 'PLAYING';
		this.currentRound = 1;
		this.hasRolledThisRound = false;
	}

	getRoundWinner(): Player | null {
		if (!this.hasRolledThisRound) return null;

		const roundIndex = this.currentRound - 1;
		const maxScore = Math.max(...this.players.map(p => p.roundScores[roundIndex]));
		return this.players.find(p => p.roundScores[roundIndex] === maxScore) || null;
	}

	canAdvanceRound(): boolean {
		return this.hasRolledThisRound && this.currentRound < this.maxRounds;
	}

	advanceRound(): boolean {
		if (!this.canAdvanceRound()) {
			if (this.currentRound >= this.maxRounds) {
				this.endGame();
				return false;
			}
			throw new Error('Cannot advance round');
		}

		this.currentRound++;
		this.hasRolledThisRound = false;
		this.players.forEach(player => player.resetDice());
		return true;
	}

	endGame(): void {
		this.gameState = 'FINISHED';
	}

	getWinners(): Player[] {
		if (this.gameState !== 'FINISHED') return [];

		const maxScore = Math.max(...this.players.map(p => p.getTotalScore()));
		return this.players.filter(p => p.getTotalScore() === maxScore);
	}

	reset(): void {
		this.players = [];
		this.currentRound = 1;
		this.hasRolledThisRound = false;
		this.gameState = 'SETUP';
	}

	getGameState(): GameStateData {
		return {
			state: this.gameState,
			currentRound: this.currentRound,
			maxRounds: this.maxRounds,
			hasRolledThisRound: this.hasRolledThisRound,
			players: this.players.map(p => p.toJSON()),
			roundWinner: this.getRoundWinner()?.toJSON() || null
		};
	}
}

// ===========================
// KING OF DIAMOND GAME IMPLEMENTATION
// ===========================

interface RoundHistoryEntry {
	choice: number;
	targetNumber: number;
	won: boolean;
	lifePointsAfter: number;
}

interface KingOfDiamondPlayerData extends PlayerData {
	lifePoints: number;
	currentChoice: number | null;
	isEliminated: boolean;
	roundHistory: RoundHistoryEntry[];
}

class KingOfDiamondPlayer extends Player {
	lifePoints: number = 10;
	currentChoice: number | null = null;
	isEliminated: boolean = false;
	roundHistory: RoundHistoryEntry[] = [];

	constructor(name: string) {
		super(name);
		this.lifePoints = 10;
		this.currentChoice = null;
		this.isEliminated = false;
		this.roundHistory = []; // Track all choices
	}

	makeChoice(number: number): void {
		if (number < 0 || number > 100)
			throw new Error('Choice must be between 0 and 100');
		this.currentChoice = number;
	}

	loseLifePoint(): void {
		this.lifePoints--;
		if (this.lifePoints <= 0)
			this.isEliminated = true;
	}

	resetChoice(): void {
		this.currentChoice = null;
	}

	addToHistory(choice: number, targetNumber: number, won: boolean): void {
		this.roundHistory.push({
			choice,
			targetNumber,
			won,
			lifePointsAfter: this.lifePoints
		});
	}

	toJSON(): KingOfDiamondPlayerData {
		return {
			...super.toJSON(),
			lifePoints: this.lifePoints,
			currentChoice: this.currentChoice,
			isEliminated: this.isEliminated,
			roundHistory: this.roundHistory
		};
	}
}

interface GameRules {
	name: string;
	description: string;
	rounds: string;
	minPlayers: number;
	maxPlayers: number;
	startingLife: number;
	scoring: string;
	specialRules: string[];
}

interface KingOfDiamondGameStateData extends GameStateData {
	targetNumber: number | null;
	roundWinners: KingOfDiamondPlayerData[];
	activePlayers: KingOfDiamondPlayerData[];
	eliminatedPlayers: KingOfDiamondPlayerData[];
}

/**
 * King of Diamond Game Engine
 * Strategic number guessing game
 */

class KingOfDiamondEngine extends GameEngine {
	players: KingOfDiamondPlayer[] = [];
	targetNumber: number | null = null;
	roundWinners: KingOfDiamondPlayer[] = [];
	hasPlayedThisRound: boolean = false;

	constructor() {
		super();
		this.maxRounds = 999; // Game continues until one winner
		this.currentRound = 0;
		this.targetNumber = null;
		this.roundWinners = [];
	}

	// ===== Implementation of abstract methods =====

	createPlayer(name: string): KingOfDiamondPlayer {
		return new KingOfDiamondPlayer(name);
	}

	getGameName(): string {
		return 'King of Diamond';
	}

	getGameRules(): GameRules {
		return {
			name: 'King of Diamond',
			description: 'Choose numbers strategically. Closest to (average × 0.8) wins!',
			rounds: 'Until one winner remains',
			minPlayers: 2,
			maxPlayers: 20,
			startingLife: 10,
			scoring: 'Last player alive wins',
			specialRules: [
				'Choose a number between 0-100 each round',
				'Target = (Average of all choices) × 0.8',
				'Closest to target wins the round',
				'Losers lose 1 life point',
				'Eliminated at 0 life points',
				'With 2 players: if both choose same number or one chooses 0 and other 100, both lose 1 point'
			]
		};
	}

	getMinPlayers(): number {
		return 2;
	}

	showRoundResults(): void {
		console.log(`******* ${++this.currentRound} *********`);
		this.players.map(p => {
			console.log(`${p.lifePoints} ${p.name} chose ${p.currentChoice} ${p.isEliminated ? '(Eliminated)' : ''}`);
		});
		console.log(`Target Number: ${this.targetNumber?.toFixed(2)}`);
		if (this.roundWinners.length === 0)
			console.log('No winners.');
		else
			console.log('Round Winner(s): ' + this.roundWinners.map(w => w.name).join(','));
		console.log("\n");
	}

	playRound(): void {
		if (this.gameState !== 'PLAYING')
			throw new Error('Game is not in playing state');

		this.players.map(p => { p.makeChoice(Math.floor(Math.random() * 101)); });

		// Check if all active players have made a choice
		const activePlayers = this.getActivePlayers();
		const allChosen = activePlayers.every(p => p.currentChoice !== null);

		if (!allChosen)
			throw new Error('Not all players have made their choice');

		// Calculate target number
		this.targetNumber = this.calculateTargetNumber(activePlayers);

		// Check for special 2-player draw conditions
		if (activePlayers.length === 2) {
			const [p1, p2] = activePlayers;
			const isDraw = this.checkTwoPlayerDraw(p1, p2);

			if (isDraw) {
				// Both lose a point
				p1.loseLifePoint();
				p2.loseLifePoint();

				p1.addToHistory(p1.currentChoice!, this.targetNumber, false);
				p2.addToHistory(p2.currentChoice!, this.targetNumber, false);

				this.roundWinners = [];
				this.hasPlayedThisRound = true;
				return;
			}
		}

		// Find round winners (closest to target)
		this.roundWinners = this.findRoundWinners(activePlayers);

		// Apply life point changes
		activePlayers.forEach(player => {
			const won = this.roundWinners.some(w => w.id === player.id);
			if (!won) player.loseLifePoint();
			player.addToHistory(player.currentChoice!, this.targetNumber!, won);
		});

		this.hasPlayedThisRound = true;

		this.showRoundResults();
		// Check if game should end
		if (this.shouldEndGame())
			return this.endGame();

		this.playRound();
	}

	calculateTargetNumber(players: KingOfDiamondPlayer[]): number {
		const sum = players.reduce((acc, p) => acc + (p.currentChoice || 0), 0);
		const average = sum / players.length;
		return average * 0.8;
	}

	checkTwoPlayerDraw(p1: KingOfDiamondPlayer, p2: KingOfDiamondPlayer): boolean {
		// Same number
		if (p1.currentChoice === p2.currentChoice)
			return true;
		// One chooses 0, other chooses 100 (or vice versa)
		if ((p1.currentChoice === 0 && p2.currentChoice === 100) ||
			(p1.currentChoice === 100 && p2.currentChoice === 0))
			return true;
		return false;
	}

	findRoundWinners(players: KingOfDiamondPlayer[]): KingOfDiamondPlayer[] {
		const distances = players.map(p => ({
			player: p,
			distance: Math.abs((p.currentChoice || 0) - (this.targetNumber || 0))
		}));

		const minDistance = Math.min(...distances.map(d => d.distance));

		return distances
			.filter(d => d.distance === minDistance)
			.map(d => d.player);
	}

	getActivePlayers(): KingOfDiamondPlayer[] {
		return this.players.filter(p => !p.isEliminated);
	}

	getRoundWinner(): KingOfDiamondPlayer | null {
		if (!this.hasPlayedThisRound) return null;
		return this.roundWinners.length === 1 ? this.roundWinners[0] : null;
	}

	getRoundWinners(): KingOfDiamondPlayer[] {
		return this.roundWinners;
	}

	shouldEndGame(): boolean {
		const activePlayers = this.getActivePlayers();

		// No one left (both eliminated in final round)
		if (activePlayers.length === 0)
			return true;
		// One winner
		if (activePlayers.length === 1)
			return true;
		return false;
	}

	getWinners(): KingOfDiamondPlayer[] {
		if (this.gameState !== 'FINISHED') return [];

		const activePlayers = this.getActivePlayers();

		// If no active players, no winner (draw)
		if (activePlayers.length === 0)
			return [];
		return activePlayers;
	}

	canAdvanceRound(): boolean {
		// Game continues until someone wins or draw
		if (!this.hasPlayedThisRound) return false;
		if (this.gameState === 'FINISHED') return false;
		return true;
	}

	advanceRound(): boolean {
		if (!this.canAdvanceRound())
			return false;

		this.currentRound++;
		this.hasPlayedThisRound = false;
		this.targetNumber = null;
		this.roundWinners = [];

		// Reset choices for next round
		this.players.forEach(player => player.resetChoice());

		return true;
	}

	// ===== Additional helper methods =====

	getGameState(): KingOfDiamondGameStateData {
		const baseState = super.getGameState();
		return {
			...baseState,
			players: this.players.map(p => p.toJSON()),
			roundWinner: this.getRoundWinner()?.toJSON() || null,
			targetNumber: this.targetNumber,
			roundWinners: this.roundWinners.map(w => w.toJSON()),
			activePlayers: this.getActivePlayers().map(p => p.toJSON()),
			eliminatedPlayers: this.players.filter(p => p.isEliminated).map(p => p.toJSON())
		};
	}

	allPlayersChosen(): boolean {
		const activePlayers = this.getActivePlayers();
		return activePlayers.every(p => p.currentChoice !== null);
	}
}





// const game = new KingOfDiamondEngine();
// game.addPlayer("Alice");
// game.addPlayer("Bob");
// game.addPlayer("Charlie");

// // Play round
// game.startGame();
// game.playRound();
// game.advanceRound();