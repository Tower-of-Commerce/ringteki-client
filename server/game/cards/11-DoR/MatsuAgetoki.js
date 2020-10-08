const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes, EventNames, Players } = require('../../Constants');

class MatsuAgetoki extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move the conflict to another eligible province',
            condition: context => context.player && context.player.opponent && context.player.honor > context.player.opponent.honor && context.source.isAttacking(),
            effect: 'move the conflict to a different province',
            handler: context => this.game.promptForSelect(context.player, {
                context: context,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Opponent,
                cardCondition: card => !card.isConflictProvince() && card.canBeAttacked(),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} moves the conflict to {1}', player, card);
                    card.inConflict = true;
                    this.game.currentConflict.conflictProvince.inConflict = false;
                    this.game.currentConflict.conflictProvince = card;
                    if(card.facedown) {
                        card.facedown = false;
                        this.game.raiseEvent(EventNames.OnCardRevealed, { context: context, card: card });
                    }
                    return true;
                }
            })
        });
    }
}

MatsuAgetoki.id = 'matsu-agetoki';

module.exports = MatsuAgetoki;