function NetworkMod(mod) {
	mod.game.initialize(["me","me.abnormalities", "contract"]);
	
	const ITEM_NOSTRUM = 200999, BUFF_NOSTRUM = [ 4020, 4021, 4022, 4023, 4025 ]
	let interval=null, mounted=false, inContract=false, playerAbnorms={};

	// hooks
	mod.game.me.on('enter_game',() => { useNostrum() });
	
	mod.game.me.on('leave_game',() => { stop() });
	mod.game.me.on('change_zone', () => { useNostrum() });
	
	mod.game.me.on('resurrect', () => { 
		playerAbnorms={};
		useNostrum(); 
	});
	
	mod.game.me.on('die',() => {
		stop();	
	});
	mod.game.me.on('mount',() => { mounted=true });
	mod.game.me.on('dismount',() => { mounted=false });
	mod.game.contract.on('begin',() => { inContract=true });
	mod.game.contract.on('end',() => { inContract=false });
	
	mod.hook('S_ABNORMALITY_BEGIN', 4 ,event => {
		if ( mod.game.me.is(event.target)) {
			playerAbnorms[event.id]=event.id;
		}
	});
	
	mod.hook('S_ABNORMALITY_REFRESH', 2 ,event => {
		if ( mod.game.me.is(event.target)) {
			playerAbnorms[event.id]=event.id;
		}
	});
	
	mod.hook('S_ABNORMALITY_END', 1 ,event => {
		if ( mod.game.me.is(event.target)) {
			delete playerAbnorms[event.id];
			useNostrum();
		}
	});
	
	//cmd
	mod.command.add('aps', {
		$default() {
			mod.settings.enabled = !mod.settings.enabled;
			mod.command.message((mod.settings.enabled ? 'en' : 'dis') + 'abled');
		}
    })
	
	function start() {
		stop();
		interval = setInterval(useNostrum, 1000);
	}

	function stop() {
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
	}
	
	function isUseNostrum() {
		if (!mod.settings.enabled || !mod.game.isIngame || mod.game.isInLoadingScreen || !mod.game.me.alive || mounted || inContract || mod.game.me.inBattleground) {
			return false;
		} else {
			let nostrumOnPlayer=[];
			Object.keys(playerAbnorms).forEach(playerAbnorm=> {
  				BUFF_NOSTRUM.forEach(buffNostrum => {
					if (playerAbnorm == buffNostrum) nostrumOnPlayer.push(playerAbnorm)
			  	});
			})
			return nostrumOnPlayer.length == 0;
		}
	}
	
	function useNostrum() {
		if ( isUseNostrum() ) {
			start();
			mod.toServer('C_USE_ITEM', 3, {
				gameId: mod.game.me.gameId,
				id: ITEM_NOSTRUM
			})
		}
	}
}

module.exports = { NetworkMod };
