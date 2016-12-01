include('game-state.js');

global ITEMS_TARGETS = [
WEAPON_AXE : function(@state) {
	var cando =@ canTargetCell(WEAPON_AXE)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && cando(x[POS]); })
		  (state[S_ALL]));
},
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
WEAPON_BROADSWORD : function(@state) {
	var canDo =@ canTargetCell(WEAPON_BROADSWORD)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (state[S_ALL]));
},
WEAPON_DESTROYER : function(@state) {
	var canDo =@ canTargetCell(WEAPON_DESTROYER)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (state[S_ALL]));
},
WEAPON_DOUBLE_GUN : function(@state) {
	var canDo =@ canTargetCell(WEAPON_DOUBLE_GUN)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (state[S_ALL]));
},
WEAPON_ELECTRISOR : function(@state) {
	return aConcatFilterMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_1]; })
		(canTargetCell(WEAPON_ELECTRISOR)(getSelf(state)[POS]))
		(state[S_ALL]);
},
WEAPON_FLAME_THROWER : WEAPON_FLAME_THROWER,
WEAPON_GAZOR : function(@state) {
	return aConcatFilterMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_3]; })
		(canTargetCell(WEAPON_GAZOR)(getSelf(state)[POS]))
		(state[S_ALL]);
},
WEAPON_GRENADE_LAUNCHER : function(@state) {
	return aConcatFilterMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_2]; })
		(canTargetCell(WEAPON_GRENADE_LAUNCHER)(getSelf(state)[POS]))
		(state[S_ALL]);
},
WEAPON_KATANA : function(@state) {
	var canDo =@ canTargetCell(WEAPON_KATANA)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (state[S_ALL]));
},
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
WEAPON_MACHINE_GUN : function(@state) {
	var canDo =@ canTargetCell(WEAPON_MACHINE_GUN)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (state[S_ALL]));
},
WEAPON_MAGNUM : function(@state) {
	var canDo =@ canTargetCell(WEAPON_MAGNUM)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (state[S_ALL]));
},
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
WEAPON_PISTOL : function(@state) {
	var canDo =@ canTargetCell(WEAPON_PISTOL)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (state[S_ALL]));
},
WEAPON_SHOTGUN : function(@state) {
	var canDo =@ canTargetCell(WEAPON_SHOTGUN)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_ACCELERATION : function(@state) {
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && x[SUMMON]; })
		  (state[S_ALL]));
},
CHIP_ADRENALINE : function(@state) {
	var canDo =@ canTargetCell(CHIP_ADRENALINE)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_ANTIDOTE : function(@state) {
	var canDo =@ canTargetCell(CHIP_ANTIDOTE)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_ARMOR : function(@state) {
	var canDo =@ canTargetCell(CHIP_ARMOR)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_ARMORING : function(@state) {
	var canDo =@ canTargetCell(CHIP_ARMORING)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
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
	var canDo =@ canTargetCell(CHIP_CURE)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && x[HP] != x[THP] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_DEVIL_STRIKE : CHIP_DEVIL_STRIKE,
CHIP_DOPING : function(@state) {
	var canDo =@ canTargetCell(CHIP_DOPING)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
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
CHIP_FLAME : function(@state) {
	var canDo =@ canTargetCell(CHIP_FLAME)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_FLASH : function(@state) {
	return aConcatFilterMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_1]; })
		(canTargetCell(CHIP_FLASH)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_FORTRESS : function(@state) {
	var canDo =@ canTargetCell(CHIP_FORTRESS)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_FRACTURE : function(@state) {
	var canDo =@ canTargetCell(CHIP_FRACTURE)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_HEALER_BULB : function(@state) {
	return getCellsToUseChipOnCell(CHIP_HEALER_BULB, getSelf(state)[POS]);
},
CHIP_HELMET : function(@state) {
	var canDo =@ canTargetCell(CHIP_HELMET)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_ICE : function(@state) {
	var canDo =@ canTargetCell(CHIP_ICE)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_ICEBERG : function(@state) {
	return aConcatFilterMap(function(@x){
		if (x[ALLY] || x[SUMMON]) { return []; }
		return x[AREA_CIRCLE_2]; })
		(canTargetCell(CHIP_ICEBERG)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_ICED_BULB : CHIP_ICED_BULB,
CHIP_INVERSION : function(@state) {
	var canDo =@ canTargetCell(CHIP_INVERSION)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_LEATHER_BOOTS : function(@state) {
	var canDo =@ canTargetCell(CHIP_LEATHER_BOOTS)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_LIBERATION : function(@state) {
	var canDo =@ canTargetCell(CHIP_LIBERATION)(getSelf(state)[POS]);
	return daMap(function(@x){return x[POS];})
		(aFilter(function(@x){
		return canDo(x[POS])
			&& (inArray(state[S_ALLIES], x[ID]) ?
			  aAny(function(@y){return negativeEffects[y[0]];})(x[EFFS])
			: aAny(function(@y){return positiveEffects[y[0]];})(x[EFFS]));
		})(state[S_ALL]));
},
CHIP_LIGHTNING : function(@state) {
	return aConcatFilterMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_2]; })
		(canTargetCell(CHIP_LIGHTNING)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_LIGHTNING_BULB : CHIP_LIGHTNING_BULB,
CHIP_LOAM : function(@state) {
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && x[SUMMON]; })
		  (state[S_ALL]));
},
CHIP_METALLIC_BULB : CHIP_METALLIC_BULB,
CHIP_METEORITE : function(@state) {
	return aConcatFilterMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_2]; })
		(canTargetCell(CHIP_METEORITE)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_MIRROR : CHIP_MIRROR,
CHIP_MOTIVATION : function(@state) {
	var canDo =@ canTargetCell(CHIP_MOTIVATION)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_PEBBLE : function(@state) {
	var canDo =@ canTargetCell(CHIP_PEBBLE)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_PLAGUE : function(@state) {
	return aConcatFilterMap(function(@x){
		if (x[ALLY] || x[SUMMON]) { return []; }
		return x[AREA_CIRCLE_3]; })
		(canTargetCell(CHIP_PLAGUE)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_PROTEIN : function(@state) {
	var canDo =@ canTargetCell(CHIP_PROTEIN)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_PUNY_BULB : CHIP_PUNY_BULB,
CHIP_RAGE : function(@state) {
	var canDo =@ canTargetCell(CHIP_RAGE)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_RAMPART : function(@state) {
	var canDo =@ canTargetCell(CHIP_RAMPART)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_REFLEXES : function(@state) {
	var canDo =@ canTargetCell(CHIP_REFLEXES)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_REGENERATION : function(@state) {
	var cando =@ canTargetCell(CHIP_REGENERATION)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){
				if (x[ALLY] && !x[SUMMON]) {
					var hp = x[HP], thp = x[THP];
					return (hp < 350 || (hp / thp) < 0.45 || (thp - hp) >= 600)
						&& cando(x[POS]);
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
CHIP_ROCK : function(@state) {
	var canDo =@ canTargetCell(CHIP_ROCK)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_ROCKFALL : function(@state) {
	return aConcatFilterMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_2]; })
		(canTargetCell(CHIP_ROCKFALL)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_ROCKY_BULB : CHIP_ROCKY_BULB,
CHIP_SEVEN_LEAGUE_BOOTS : function(@state) {
	var canDo =@ canTargetCell(CHIP_SEVEN_LEAGUE_BOOTS)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_SHIELD : function(@state) {
	var canDo =@ canTargetCell(CHIP_SHIELD)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_SHOCK : function(@state) {
	var canDo =@ canTargetCell(CHIP_SHOCK)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_SLOW_DOWN : function(@state) {
	var canDo =@ canTargetCell(CHIP_SLOW_DOWN)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_SOLIDIFICATION : function(@state) {
	var canDo =@ canTargetCell(CHIP_SOLIDIFICATION)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_SOPORIFIC : CHIP_SOPORIFIC,
CHIP_SPARK : function(@state) {
	var canDo =@ canTargetCell(CHIP_SPARK)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_STALACTITE : function(@state) {
	var cando =@ canTargetCell(CHIP_STALACTITE)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && cando(x[POS]); })
		  (state[S_ALL]));
},
CHIP_STEROID : function(@state) {
	var canDo =@ canTargetCell(CHIP_STEROID)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_STRETCHING : function(@state) {
	var canDo =@ canTargetCell(CHIP_STRETCHING)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_TELEPORTATION : function(@state) {
	return getCellsToUseChipOnCell(CHIP_TELEPORTATION, getSelf(state)[POS]);
},
CHIP_THORN : CHIP_THORN,
CHIP_TOXIN : function(@state) {
	return aConcatFilterMap(function(@x){
		if (x[ALLY] || x[SUMMON]) { return []; }
		return x[AREA_CIRCLE_1]; })
		(canTargetCell(CHIP_TOXIN)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_TRANQUILIZER : function(@state) {
	var canDo =@ canTargetCell(CHIP_TRANQUILIZER)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_VACCINE : function(@state) {
	var canDo =@ canTargetCell(CHIP_VACCINE)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_VENOM : function(@state) {
	var canDo =@ canTargetCell(CHIP_VENOM)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ENEMY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_WALL : function(@state) {
	var canDo =@ canTargetCell(CHIP_WALL)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_WARM_UP : function(@state) {
	var canDo =@ canTargetCell(CHIP_WARM_UP)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_WHIP : function(@state) {
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && x[SUMMON]; })
		  (state[S_ALL]));
},
CHIP_WINGED_BOOTS : function(@state) {
	var canDo =@ canTargetCell(CHIP_WINGED_BOOTS)(getSelf(state)[POS]);
	return daMap(function(@x){ return x[POS]; })
		  (aFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
];
