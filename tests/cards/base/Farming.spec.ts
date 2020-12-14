import {expect} from 'chai';
import {Farming} from '../../../src/cards/base/Farming';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Farming', function() {
  let card : Farming; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Farming();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = 4;
    expect(card.canPlay(player, game)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
    expect(player.plants).to.eq(2);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
  });
});