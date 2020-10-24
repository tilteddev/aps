//const robot = require('robotjs');

module.exports = function AutoPrime(mod) {
   
		const ITEM_NOSTRUM = 200999, BUFF_NOSTRUM = 4020
		let timeout = null,
		cooldown = 0,
		nextUse = 0, 
		bgZone = -1,
		alive = false,
		mounted = false,
		inContract = false,
		inBG = false,
		loaded = false,
		loadDelay = 10000
		const hookorder = {order: -100000};
		
		//other hooks
		mod.hook('S_LOGIN', 'raw', () => {nextUse=0;loaded=false;});
		mod.hook('S_RETURN_TO_LOBBY', 'raw', () => { nostrum(true) });
		mod.hook('S_BATTLE_FIELD_ENTRANCE_INFO', 1, event => { bgZone = event.zone });
		mod.hook('S_LOAD_TOPO', 3, event => {
			nextUse = Date.now() + loadDelay
			mounted = inContract = false
			inBG = event.zone == bgZone
			loaded = true
	
			nostrum(true)
		});
		mod.hook('S_SPAWN_ME', 3, event => { nostrum(!(alive = event.alive)) })
		mod.hook('S_CREATURE_LIFE', 3, event => {
			if (parseInt(event.target) == mod.game.me.gameId && alive != event.alive) {
				nostrum(!(alive = event.alive))
	
				if (!alive) {
					nextUse = 0
					mounted = inContract = false
				}
			}
		});
		mod.hook('S_START_COOLTIME_ITEM', 1, hookorder, e => {if (e.item == ITEM_NOSTRUM) resetCooldown(e);});
		
		// -- abnormalities
		mod.hook('S_ABNORMALITY_BEGIN', 4, event => {abnormChanged(event)});
		mod.hook('S_ABNORMALITY_REFRESH', 2, event => { abnormChanged(event)});
		mod.hook('S_ABNORMALITY_END', 1, event => { abnormChanged(event,true)});
		
		// -- mount
		mod.hook('S_MOUNT_VEHICLE', 2, event => { mount(true,event)});
		mod.hook('S_UNMOUNT_VEHICLE', 2, event => { mount(false,event)});
		
		// -- contract
		mod.hook('S_REQUEST_CONTRACT', 'raw', () => { contract(true)})
		mod.hook('S_ACCEPT_CONTRACT', 'raw', () => { contract(false)})
		mod.hook('S_REJECT_CONTRACT', 'raw', () => { contract(false)})
		mod.hook('S_CANCEL_CONTRACT', 'raw', () => { contract(false)})
		
		//cmd
		mod.command.add('aps', {
			$default() {
				mod.settings.enabled = !mod.settings.enabled;
				mod.command.message((mod.settings.enabled ? 'en' : 'dis') + 'abled');
			}
        })
		
		function mount(enter, event) {
			if (parseInt(event.gameid) == mod.game.me.gameId) nostrum(mounted = enter)
		}
		
		function contract(enter) {
			nostrum(inContract = enter)
		}

		function abnormChanged(event, isEnd =false ) {
			if (parseInt(event.target) == mod.game.me.gameId && event.id == BUFF_NOSTRUM ) {
				nextUse = isEnd ? 0 : Date.now() + parseInt(event.duration)
				nostrum();
			}
		}

		function nostrum(disable) {
			clearTimeout(timeout);
			if (!disable && alive && !mounted && !inContract && !inBG && loaded) timeout = setTimeout(useNostrum), nextUse - Date.now())
		}
		
		function useNostrum() {
			let time = Date.now()
			if (time >= cooldown) {
				mod.toServer('C_USE_ITEM', 3, {
					gameId: mod.game.me.gameId,
					id: ITEM_NOSTRUM
				})
			} else timeout = setTimeout(useNostrum, cooldown - time)
		}
		
		function resetCooldown(event) {
			cooldown = Date.now() + event.cooldown * 1000
		}		
}