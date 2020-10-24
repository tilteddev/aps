module.exports = function AutoPrime(mod) {
		mod.game.initialize(['me', 'me.abnormalities', 'contract']);
		const ITEM_NOSTRUM = 200999, BUFF_NOSTRUM = 4020
		let interval=null;
		
		//other hooks
		mod.game.me.on('enter_game',() => { start() });
		mod.game.me.on('leave_game',() => { stop() });
		mod.game.me.on('change_zone', () => {
			start();
		});
		mod.game.me.on('resurrect', () => { start() });
		
		//cmd
		mod.command.add('aps', {
			$default() {
				mod.settings.enabled = !mod.settings.enabled;
				mod.command.message((mod.settings.enabled ? 'en' : 'dis') + 'abled');
			}
        })
		
		function start() {
			stop();
			interval = mod.setInterval(useNostrum, 1000);
		}

		function stop() {
			if (interval) {
				mod.clearInterval(interval);
				interval = null;
			}
		}
		
		function isUseNostrum() {
			if (!mod.settings.enabled || !mod.game.isIngame || mod.game.isInLoadingScreen || !mod.game.me.alive || mod.game.me.mounted || mod.game.me.inBattleground) {
				return false;
			} else {
				return mod.game.me.abnormalities[BUFF_NOSTRUM] ? false : true;
			}
		}
		
		function useNostrum() {
			if ( isUseNostrum() ) {
				mod.toServer('C_USE_ITEM', 3, {
					gameId: mod.game.me.gameId,
					id: ITEM_NOSTRUM
				})
			}
		}
				
}