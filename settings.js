"use strict";

const DefaultSettings = {
  "enabled": true,
  "presets": {
    0: { // Warrior
      20: true // Deadly Gamble
    },
    1: { // Lancer
      17: true // Adrenaline Rush
    },
	2: {
	  20:true // ICB
	},
    3: { // Berserker
      21: true // Bloodlust
    },
    4: { // Sorcerer
      34: true // Mana Boost
    },
    5: { // Archer
      35: true // Windsong
    },
    11: { // Ninja
      23: true // Inner Harmony
    },
    12: { // Valkyrie
      12: true // Ragnarok
    }
  },
  "excludeZones": [9713]
}

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
    if (from_ver === undefined) {
        // Migrate legacy config file
        return Object.assign(Object.assign({}, DefaultSettings), settings);
    } else if (from_ver === null) {
        // No config file exists, use default settings
        return DefaultSettings;
    } else {
        // Migrate from older version (using the new system) to latest one
        throw new Error('So far there is only one settings version and this should never be reached!');
    }
};