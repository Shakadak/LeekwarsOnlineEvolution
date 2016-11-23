	include('game-state.js');

	global ITEMS_TARGETS = [
	WEAPON_AXE : WEAPON_AXE,
	WEAPON_B_LASER : function(@state) {
		var pos = getSelf(state)[POS];
		if (pos === null) { return []; }
		var cx = getCellX(pos);
		var cy = getCellY(pos);
		var minr = 2;
		var ret = [];
		var weapon = WEAPON_B_LASER;

		var codir = sameDir(pos);
		var all_id =@ aAppend(state[S_ALLIES])(state[S_ENEMIES]);
		var all_entities = aFilter(function(@x) {
				var tgt =@ x[POS];
				return !x[SUMMON]
					&& x[NAME] !== 'puny_bulb'
					&& inRange(weapon)(pos)(tgt)
					&& lineOfSight(pos, tgt, all_id); })(state[S_ALL]);

		var trigg = getCellFromXY(cx + minr, cy);
		if (trigg !== null) {
			var codir2 =@ codir(trigg);
			if (lineOfSight(pos, trigg) && aAny(function(@target) {
					return codir2(target[POS]);
				})(all_entities)) {
				push(ret, trigg);
			}
		}

		trigg =@ getCellFromXY(cx - minr, cy);
		if (trigg !== null) {
			var codir2 =@ codir(trigg);
			if (lineOfSight(pos, trigg) && aAny(function(@target) {
					return codir2(target[POS]);
				})(all_entities)) {
				push(ret, trigg);
			}
		}

		trigg =@ getCellFromXY(cx, cy + minr);
		if (trigg !== null) {
			var codir2 =@ codir(trigg);
			if (lineOfSight(pos, trigg) && aAny(function(@target) {
					return codir2(target[POS]);
				})(all_entities)) {
				push(ret, trigg);
			}
		}

		trigg =@ getCellFromXY(cx, cy - minr);
		if (trigg !== null) {
			var codir2 =@ codir(trigg);
			if (lineOfSight(pos, trigg) && aAny(function(@target) {
					return codir2(target[POS]);
				})(all_entities)) {
				push(ret, trigg);
			}
		}

		return ret;
	},
	WEAPON_BROADSWORD : WEAPON_BROADSWORD,
	WEAPON_DESTROYER : WEAPON_DESTROYER,
	WEAPON_DOUBLE_GUN : WEAPON_DOUBLE_GUN,
	WEAPON_ELECTRISOR : WEAPON_ELECTRISOR,
	WEAPON_FLAME_THROWER : WEAPON_FLAME_THROWER,
	WEAPON_GAZOR : function(@state) {
		return aConcatFilterMap(function(@x){
			if (x[ALLY] || x[SUMMON]) { return []; }
			return x["A" + AREA_CIRCLE_3]; })
			(aligned(getSelf(state)[POS]))
			(state[S_ALL]);
	},
	WEAPON_GRENADE_LAUNCHER : WEAPON_GRENADE_LAUNCHER,
	WEAPON_KATANA : WEAPON_KATANA,
	WEAPON_LASER : function(@state) {
		var pos = getSelf(state)[POS];
		var cx = getCellX(pos);
		var cy = getCellY(pos);
		var minr = 2;
		var ret = [];
		var weapon = WEAPON_LASER;

		var codir = sameDir(pos);
		var all_id =@ aAppend(state[S_ALLIES])(state[S_ENEMIES]);
		var all_entities = aFilter(function(@x) {
				var tgt =@ x[POS];
				return x[ENEMY]
					&& x[NAME] !== 'puny_bulb'
					&& inRange(weapon)(pos)(tgt)
					&& lineOfSight(pos, tgt, all_id); })
			(state[S_ALL]);

		var trigg = getCellFromXY(cx + minr, cy);
		if (trigg !== null) {
			var codir2 =@ codir(trigg);
			if (lineOfSight(pos, trigg) && aAny(function(@target) {
					return codir2(target[POS]);
				})(all_entities)) {
				push(ret, trigg);
			}
		}

		trigg =@ getCellFromXY(cx - minr, cy);
		if (trigg !== null) {
			var codir2 =@ codir(trigg);
			if (lineOfSight(pos, trigg) && aAny(function(@target) {
					return codir2(target[POS]);
				})(all_entities)) {
				push(ret, trigg);
			}
		}

		trigg =@ getCellFromXY(cx, cy + minr);
		if (trigg !== null) {
			var codir2 =@ codir(trigg);
			if (lineOfSight(pos, trigg) && aAny(function(@target) {
					return codir2(target[POS]);
				})(all_entities)) {
				push(ret, trigg);
			}
		}

		trigg =@ getCellFromXY(cx, cy - minr);
		if (trigg !== null) {
			var codir2 =@ codir(trigg);
			if (lineOfSight(pos, trigg) && aAny(function(@target) {
					return codir2(target[POS]);
				})(all_entities)) {
				push(ret, trigg);
			}
		}

		return ret;
	},
	WEAPON_MACHINE_GUN : WEAPON_MACHINE_GUN,
	WEAPON_MAGNUM : WEAPON_MAGNUM,
	WEAPON_M_LASER : function(@state) {
		var pos = getSelf(state)[POS];
		var cx = getCellX(pos);
		var cy = getCellY(pos);
		var minr = 4;
		var ret = [];
		var weapon = WEAPON_M_LASER;

		var codir = sameDir(pos);
		var all_id =@ aAppend(state[S_ALLIES])(state[S_ENEMIES]);
		var all_entities = aFilter(function(@x) {
				var tgt =@ x[POS];
				return x[ENEMY]
					&& x[NAME] !== 'puny_bulb'
					&& inRange(weapon)(pos)(tgt)
					&& lineOfSight(pos, tgt, all_id); })
			(state[S_ALL]);

		var trigg = getCellFromXY(cx + minr, cy);
		var codir2 =@ codir(trigg);
		if (trigg !== null && lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}

		trigg =@ getCellFromXY(cx - minr, cy);
		codir2 =@ codir(trigg);
		if (trigg !== null && lineOfSight(pos, trigg) && aAny(function(@target) {
				var tgt = target[POS];
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}

		trigg =@ getCellFromXY(cx, cy + minr);
		codir2 =@ codir(trigg);
		if (trigg !== null && lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}

		trigg =@ getCellFromXY(cx, cy - minr);
		codir2 =@ codir(trigg);
		if (trigg !== null && lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}

		return ret;
	},
	WEAPON_PISTOL : WEAPON_PISTOL,
	WEAPON_SHOTGUN : WEAPON_SHOTGUN,
	CHIP_ACCELERATION : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_ADRENALINE : null,
	CHIP_ANTIDOTE : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_ARMOR : CHIP_ARMOR,
	CHIP_ARMORING : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_BALL_AND_CHAIN : CHIP_BALL_AND_CHAIN,
	CHIP_BANDAGE : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && x[HP] != x[THP]; })
			  (state[S_ALL]));
	},
	CHIP_BARK : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_BURNING : CHIP_BURNING,
	CHIP_CARAPACE : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_COLLAR : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_CURE : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && x[HP] != x[THP]; })
			  (state[S_ALL]));
	},
	CHIP_DEVIL_STRIKE : CHIP_DEVIL_STRIKE,
	CHIP_DOPING : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_DRIP : CHIP_DRIP,
	CHIP_FEROCITY : CHIP_FEROCITY,
	CHIP_FERTILIZER : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_FIRE_BULB : CHIP_FIRE_BULB,
	CHIP_FLAME : CHIP_FLAME,
	CHIP_FLASH : CHIP_FLASH,
	CHIP_FORTRESS : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_FRACTURE : CHIP_FRACTURE,
	CHIP_HEALER_BULB : function(@state) {
		return getCellsToUseChipOnCell(CHIP_HEALER_BULB, getSelf(state)[POS]);
	},
	CHIP_HELMET : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_ICE : CHIP_ICE,
	CHIP_ICEBERG : CHIP_ICEBERG,
	CHIP_ICED_BULB : CHIP_ICED_BULB,
	CHIP_INVERSION : CHIP_INVERSION,
	CHIP_LEATHER_BOOTS : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_LIBERATION : function(@state) {
		return daMap(function(@x){return x[POS];})
			(aFilter(function(@x){
			return inArray(state[S_ALLIES], x[ID]) ?
				aAny(function(@y){return negativeEffects[y[0]];})(x[EFFS])
				: aAny(function(@y){return positiveEffects[y[0]];})(x[EFFS]);
			})(state[S_ALL]));
	},
	CHIP_LIGHTNING : CHIP_LIGHTNING,
	CHIP_LIGHTNING_BULB : CHIP_LIGHTNING_BULB,
	CHIP_LOAM : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_METALLIC_BULB : CHIP_METALLIC_BULB,
	CHIP_METEORITE : CHIP_METEORITE,
	CHIP_MIRROR : CHIP_MIRROR,
	CHIP_MOTIVATION : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_PEBBLE : CHIP_PEBBLE,
	CHIP_PLAGUE : CHIP_PLAGUE,
	CHIP_PROTEIN : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_PUNY_BULB : CHIP_PUNY_BULB,
	CHIP_RAGE : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_RAMPART : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_REFLEXES : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_REGENERATION : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){
					if (x[ALLY] && !x[SUMMON]) {
						var hp = x[HP], thp = x[THP];
						return hp < 150 || (hp / thp) < 0.45;
					}
					return false;
				})
			  (state[S_ALL]));
	},
	CHIP_REMISSION : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_RESURRECTION : CHIP_RESURRECTION,
	CHIP_ROCK : CHIP_ROCK,
	CHIP_ROCKFALL : CHIP_ROCKFALL,
	CHIP_ROCKY_BULB : CHIP_ROCKY_BULB,
	CHIP_SEVEN_LEAGUE_BOOTS : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_SHIELD : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_SHOCK : CHIP_SHOCK,
	CHIP_SLOW_DOWN : CHIP_SLOW_DOWN,
	CHIP_SOLIDIFICATION : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_SOPORIFIC : CHIP_SOPORIFIC,
	CHIP_SPARK : CHIP_SPARK,
	CHIP_STALACTITE : CHIP_STALACTITE,
	CHIP_STEROID : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_STRETCHING : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_TELEPORTATION : function(@state) {
		return getCellsToUseChipOnCell(CHIP_TELEPORTATION, getSelf(state)[POS]);
	},
	CHIP_THORN : CHIP_THORN,
	CHIP_TOXIN : CHIP_TOXIN,
	CHIP_TRANQUILIZER : CHIP_TRANQUILIZER,
	CHIP_VACCINE : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_VENOM : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ENEMY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_WALL : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_WARM_UP : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_WHIP : function(@state) {
		return daMap(function(@x){ return x[POS]; })
			  (aFilter(function(@x){ return x[ALLY] && x[SUMMON]; })
			  (state[S_ALL]));
	},
	CHIP_WINGED_BOOTS : null,
	];
