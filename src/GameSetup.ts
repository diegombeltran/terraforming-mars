import {Board} from './boards/Board';
import {BoardName} from './boards/BoardName';
import {ElysiumBoard} from './boards/ElysiumBoard';
import {Game, GameId, GameOptions} from './Game';
import {HellasBoard} from './boards/HellasBoard';
import {OriginalBoard} from './boards/OriginalBoard';
import {Player} from './Player';
import {Resources} from './Resources';
import {ColonyName} from './colonies/ColonyName';
import {Color} from './Color';
import {TileType} from './TileType';
import {Random} from './Random';

export class GameSetup {
  // Function to construct the board and milestones/awards list
  public static newBoard(boardName: BoardName, shuffle: boolean, rng: Random, includeVenus: boolean): Board {
    if (boardName === BoardName.ELYSIUM) {
      return ElysiumBoard.newInstance(shuffle, rng, includeVenus);
    } else if (boardName === BoardName.HELLAS) {
      return HellasBoard.newInstance(shuffle, rng, includeVenus);
    } else {
      return OriginalBoard.newInstance(shuffle, rng, includeVenus);
    }
  }

  public static setStartingProductions(player: Player) {
    player.addProduction(Resources.MEGACREDITS);
    player.addProduction(Resources.STEEL);
    player.addProduction(Resources.TITANIUM);
    player.addProduction(Resources.PLANTS);
    player.addProduction(Resources.ENERGY);
    player.addProduction(Resources.HEAT);
  }

  public static includesCommunityColonies(gameOptions: GameOptions) : boolean {
    if (!gameOptions.customColoniesList) return false;
    if (gameOptions.customColoniesList.includes(ColonyName.IAPETUS)) return true;
    if (gameOptions.customColoniesList.includes(ColonyName.MERCURY)) return true;
    if (gameOptions.customColoniesList.includes(ColonyName.HYGIEA)) return true;
    if (gameOptions.customColoniesList.includes(ColonyName.TITANIA)) return true;
    if (gameOptions.customColoniesList.includes(ColonyName.VENUS)) return true;
    if (gameOptions.customColoniesList.includes(ColonyName.LEAVITT)) return true;
    if (gameOptions.customColoniesList.includes(ColonyName.PALLAS)) return true;

    return false;
  }

  public static neutralPlayerFor(gameId: GameId): Player {
    return new Player('neutral', Color.NEUTRAL, true, 0, gameId + '-neutral');
  }

  public static setupNeutralPlayer(game: Game) {
    // Single player add neutral player
    // put 2 neutrals cities on board with adjacent forest
    const neutral = this.neutralPlayerFor(game.id);

    function placeCityAndForest(game: Game, direction: -1 | 1) {
      const board = game.board;
      const citySpace = game.getSpaceByOffset(direction, TileType.CITY);
      game.simpleAddTile(neutral, citySpace, {tileType: TileType.CITY});
      const adjacentSpaces = board.getAdjacentSpaces(citySpace).filter((s) => game.board.canPlaceTile(s));
      if (adjacentSpaces.length === 0) {
        throw new Error('No space for forest');
      }
      let idx = game.discardForCost(TileType.GREENERY);
      idx = Math.max(idx-1, 0); // Some cards cost zero.
      const forestSpace = adjacentSpaces[idx%adjacentSpaces.length];
      game.simpleAddTile(neutral, forestSpace, {tileType: TileType.GREENERY});
    }

    placeCityAndForest(game, 1);
    placeCityAndForest(game, -1);
  }
}
