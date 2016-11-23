include("functional.js");
include("bool.js");
include("array.js");
include('math.js');
include("map");
include("item");

global S_SELF = "self";
global S_ALLIES = "allies";
global S_ENEMIES = "enemies";
global S_ALL = "all";
global S_ORDER = 'order';
global S_MAX_ID = 'max_id';

global THP = "THP";
global HP = "HP";
global TMP = "TMP";
global MP = "MP";
global TTP = "TTP";
global TP = "TP";
global SCI = "SCI";
global STR = "STR";
global MAG = "MAG";
global WIS = "WIS";
global AGI = "AGI";
global RES = "RES";
global ASH = "ASH";
global RSH = "RSH";
global RET = "RET";
global POS = "POS";
global TYPE = "TYPE";
global EFFS = "EFFS";
global CHIPS = "CHIPS";
global EQ = "EQ";
global UNEQ = 'UNEQ';
global ID = "ID";
global ORDER = "ORDER";
global ALLY = "ALLY";
global ENEMY = "ENEMY";
global SUMMON = "SUMMON";
global SUMMONER = "SUMMONER";
global NAME = "NAME";
global LEVEL = "LEVEL";

function getGameState() {
	var ret = [];
	var allies =@ getAliveAllies();
	var enemies =@ getAliveEnemies();
	var all =@( allies + enemies );
	var os =@ kvsFromMap(compose(subTo(1))(getEntityTurnOrder))(getAliveAllies() + getAliveEnemies());
keySort(os);
	var max_id = getAlliesCount() + getEnemiesCount();
	return 	[ S_SELF	: getLeek()
			, S_ALLIES	: allies
			, S_ENEMIES	: enemies
			, S_ALL		: keysMap(getEntityState)(all)
			, S_ORDER	: os
			, S_MAX_ID	: max_id
			];
}

function getEntityState(e) {
	var unequipped = getWeapons(e);
	var equipped = getWeapon(e);
	removeElement(unequipped, equipped);
	return	[ THP	: getTotalLife(e)
			, HP	: getLife(e)
			, TMP	: getTotalMP(e)
			, MP	: getMP(e)
			, TTP	: getTotalTP(e)
			, TP	: getTP(e)
			, SCI	: getScience(e)
			, STR	: getStrength(e)
			, MAG	: getMagic(e)
			, WIS	: getWisdom(e)
			, AGI	: getAgility(e)
			, RES	: getResistance(e)
			, ASH	: getAbsoluteShield(e)
			, RSH	: getRelativeShield(e)
			, RET : getDamageReturn(e)
			, POS	: getCell(e)
			, TYPE: getType(e)
			, EFFS: getEffects(e)
			, CHIPS: keysMap(getCooldown)(getChips(e))
			, EQ	: equipped
			, UNEQ: unequipped
			, ID	: e
			, ORDER	: getEntityTurnOrder(e)
			, AREA_POINT		: getApplicableArea(AREA_POINT)(getCell(e))
			, AREA_CIRCLE_1	: getApplicableArea(AREA_CIRCLE_1)(getCell(e))
			, AREA_CIRCLE_2	: getApplicableArea(AREA_CIRCLE_2)(getCell(e))
			, AREA_CIRCLE_3	: getApplicableArea(AREA_CIRCLE_3)(getCell(e))
			, ALLY	: isAlly(e)
			, ENEMY	: isEnemy(e)
			, SUMMON	: isSummon(e)
			, SUMMONER: getSummoner(e)
			, NAME	: getName(e)
			, LEVEL	: getLevel(e)
			];
}

function getSelf(@state) { return state["all"][state["self"]]; }

function getActionListFromState(@s) {
	var self =@ getSelf(s);
	var tp =@ self[TP];
	var thp =@ self[THP];
	var hp =@ self[HP];
	var eq =@ self[EQ];
	var fWeap =@ function(@w) { return tp >= getWeaponCost(w) + 1; };
	var weapons =@ aFilter(fWeap)(self[UNEQ]);
	if (eq !== null && tp >= getWeaponCost(eq)) { push(weapons, eq); }
	var chips = [];
	for (var c : var cd in self[CHIPS]) {
		if (cd > 0) { continue; }
		if (tp >= getChipCost(c)) {
			push(chips, c);
		}
	}
	return	aAppend(weapons)(chips);
}

function getMovementListFromState(@s) {
	var moves =@ getlAccessibleCells(/*min(1, */getSelf(s)[MP]/*)*/)(getSelf(s)[POS]);
	return	[ "moves"	: getKeys(moves)
			, "mcosts"	: moves ];
}

function updateState(@s) { return function(@f) { s =@ f(s); };}

function getRandomChip(@s) {
}

function getItemTargetsFromState(@state, @item, @cell) {
	var cells = getApplicableArea(getItemArea(item))(cell);
	return arrayFoldLeft(state[S_ALL], function(@acc, @x) {
		if (inArray(cells, x[POS])) { push(acc, x[ID]);}
		return acc;
	}, []);
}

global positiveEffects = [
	EFFECT_ABSOLUTE_SHIELD	: true,
	EFFECT_BUFF_AGILITY	: true,
	EFFECT_BUFF_MP	: true,
	EFFECT_BUFF_RESISTANCE	: true,
	EFFECT_BUFF_STRENGTH	: true,
	EFFECT_BUFF_TP	: true,
	EFFECT_BUFF_WISDOM	: true,
	EFFECT_DAMAGE_RETURN	: true,
	EFFECT_HEAL		: true,
	EFFECT_POISON	: false,
	EFFECT_RELATIVE_SHIELD	: true,
	EFFECT_SHACKLE_MAGIC	: false,
	EFFECT_SHACKLE_MP	: false,
	EFFECT_SHACKLE_STRENGTH : false,
	EFFECT_SHACKLE_TP	: false,
	];

global negativeEffects = daMap(not)(@@positiveEffects);

function applyEffect(@wearer) { return function(@effect) {
	var type = effect[0];
	if (type === EFFECT_POISON) {
		wearer[HP] -= effect[1];
	}
	else if (type === EFFECT_HEAL) {
		wearer[HP] = heal(effect[1], wearer);
	}
};}

function addEffect(@buff) { return function(@wearer) { return function(@effect) {
	var item_id = effect[5];
	if (buff) {
		wearer[EFFS] = aFilter(function(@eff) {return eff[5] !== item_id; })(wearer[EFFS]);
	}
	push(wearer[EFFS], effect);
};};}

function removeEffect(@wearer) { return function(@effect) {
	var type = effect[0];
	if (type === EFFECT_ABSOLUTE_SHIELD) {
		wearer[ASH] -= effect[1];
	}
	else if (type === EFFECT_RELATIVE_SHIELD) {
		wearer[RSH] -= effect[1];
	}
	else if (type === EFFECT_BUFF_AGILITY) {
		wearer[AGI] -= effect[1];
	}
	else if (type === EFFECT_BUFF_RESISTANCE) {
		wearer[RES] -= effect[1];
	}
	else if (type === EFFECT_BUFF_STRENGTH) {
		wearer[STR] -= effect[1];
	}
	else if (type === EFFECT_BUFF_WISDOM) {
		wearer[WIS] -= effect[1];
	}
	else if (type === EFFECT_BUFF_MP) {
		wearer[TMP] -= effect[1];
		wearer[MP] -= effect[1];
	}
	else if (type === EFFECT_BUFF_TP) {
		wearer[TTP] -= effect[1];
		wearer[TP] -= effect[1];
	}
	else if (type === EFFECT_SHACKLE_MAGIC) {
		wearer[MAG] += effect[1];
	}
	else if (type === EFFECT_SHACKLE_STRENGTH) {
		wearer[STR] += effect[1];
	}
	else if (type === EFFECT_SHACKLE_MP) {
		wearer[TMP] += effect[1];
		wearer[MP] += effect[1];
	}
	else if (type === EFFECT_SHACKLE_TP) {
		wearer[TTP] += effect[1];
		wearer[TP] += effect[1];
	}
	else if (type === EFFECT_DAMAGE_RETURN) {
		wearer[RET] -= effect[1];
	}
};}

function rawEff(@base, @stat) {
	return base * (100 + stat) / 100;
}

function damage(@raw, @target) {
	return max(0, raw * (1 - target[RSH] / 100) - target[ASH]);
}

function heal(@raw, @target) {
	return min(target[THP], target[HP] + raw);
}

function shackle(@base, @caster) {
	var mag = caster[MAG];
	return function(@target) {
		return round(base * (100 + max(0, mag - target[SCI])) / 100);
	};
}

function atk(@dmg, @ls, @target, @caster) {
	var effDmg = damage(dmg, target);
	target[HP] -= effDmg;
	caster[HP] = heal(ls * effDmg, caster);
	caster[HP] -= dmg * target[RET] / 100;
}

function removeDead(@state) {
	return function(@target) {
		if (target[HP] <= 0) {
			var ident = target[ID];
			removeElement(state[S_ALLIES], ident);
			removeElement(state[S_ENEMIES], ident);
			removeElement(state[S_ALL], target);
			/*
			if (!target[summon]) {
				var summons =@ aFilter(function(@x) { return x[SUMMONER] === target[ID]; })(state[all]);
			}
			*/
		}
};}

global ITEMS_EFFECT = [
WEAPON_AXE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(60.5, caster[STR]) * crit;
	var shack = shackle(0.55 * crit, caster);
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			var debuff = shack(target);
			target[MP] -= debuff;
			target[TMP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_MP, debuff, caster[ID], 1, false, WEAPON_AXE, target[ID]]);
			removeDead(state)(target);
		}
	};}
WEAPON_B_LASER : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(55, caster[STR]) * crit;
	var rheal = rawEff(55, caster[WIS]) * crit;
	var ls = caster[WIS] / 1000;
	var pos = caster[POS];
	var codir = sameDir(pos)(center);
	var all_id =@ aAppend(state[S_ALLIES])(state[S_ENEMIES]);
	return function(@target) {
		var tgt = target[POS];
		if (codir(tgt) && inRange(WEAPON_B_LASER)(pos)(tgt) && lineOfSight(pos, tgt, all_id)) {
			atk(dmg, ls, target, caster);
			if (target[HP] > 0) {
				target[HP] = heal(rheal, target);
			}
			else {
				removeDead(state)(target);
			}
		}
	};},
WEAPON_BROADSWORD : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(40, caster[STR]) * crit;
	var shack = shackle(0.35 * crit, caster);
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			var debuff = shack(target);
			target[TTP] -= debuff;
			target[TP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_TP, debuff, caster[ID], 1, false, WEAPON_BROADSWORD, target[ID]]);
			removeDead(state)(target);
		}
	};},
WEAPON_DESTROYER : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(50, caster[STR]) * crit;
	var shack = shackle(12 * crit, caster);
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			target[STR] -= shack(target);
			removeDead(state)(target);
		}
	};},
WEAPON_DOUBLE_GUN : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(21.5, caster[STR]) * crit;
	var dmg2 = rawEff(6.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			atk(dmg2, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_ELECTRISOR : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(75, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_FLAME_THROWER : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(WEAPON_FLAME_THROWER);
	};},
WEAPON_GAZOR : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(32, caster[MAG]) * crit;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			addEffect(false)(target)([EFFECT_POISON, dmg, caster[ID], 3, false, WEAPON_GAZOR, target[ID]]);
		}
		else if (getCellDistance(center, tgt) === 1) {
			addEffect(false)(target)([EFFECT_POISON, dmg * 0.833, caster[ID], 3, false, WEAPON_GAZOR, target[ID]]);
		}
		else if (getCellDistance(center, tgt) === 2) {
			addEffect(false)(target)([EFFECT_POISON, dmg * 0.666, caster[ID], 3, false, WEAPON_GAZOR, target[ID]]);
		}
		else if (getCellDistance(center, tgt) === 3) {
			addEffect(false)(target)([EFFECT_POISON, dmg * 0.5, caster[ID], 3, false, WEAPON_GAZOR, target[ID]]);
		}
	};},
WEAPON_GRENADE_LAUNCHER : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(49, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			atk(dmg * 0.75, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 2) {
			atk(dmg * 0.5, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_KATANA : function(@state, @caster, @center) {
	return function(@target) {
		debugE("Item " + getItemName(WEAPON_KATANA) + " not implemented.");
	};},
WEAPON_LASER : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(51, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	var pos = caster[POS];
	var codir = sameDir(pos)(center);
	var all_id =@ aAppend(state[S_ALLIES])(state[S_ENEMIES]);
	return function(@target) {
		var tgt = target[POS];
		if (codir(tgt) && inRange(WEAPON_LASER)(pos)(tgt) && lineOfSight(pos, tgt, all_id)) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_MACHINE_GUN : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(22, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_MAGNUM : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(32.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_M_LASER : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(WEAPON_M_LASER);
	};},
WEAPON_PISTOL : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(17.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_SHOTGUN : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(38, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_ACCELERATION : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_ACCELERATION);
	};},
CHIP_ADRENALINE : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_ADRENALINE);
	};},
CHIP_ANTIDOTE : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_ANTIDOTE);
	};},
CHIP_ARMOR : function(@state, @caster, @center) {
	var sh = rawEff(25, caster[RES]);
	return function(@target) {
		if (center == target[POS]) {
			target[ASH] += sh;
			addEffect(true)(target)([EFFECT_ABSOLUTE_SHIELD, sh, caster[ID], 4, false, CHIP_ARMOR, target[ID]]);
		}
	};},
CHIP_ARMORING : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var boost = rawEff(22.5, caster[WIS]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[THP] += boost;
			target[HP] += boost;
		}
	};},
CHIP_BALL_AND_CHAIN : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_BALL_AND_CHAIN);
	};},
CHIP_BANDAGE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var rheal = rawEff(12.5, caster[WIS]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[HP] = heal(rheal, target);
		}
	};},
CHIP_BARK : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_BARK);
	};},
CHIP_BURNING : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_BURNING);
	};},
CHIP_CARAPACE : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_CARAPACE);
	};},
CHIP_COLLAR : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_COLLAR);
	};},
CHIP_CURE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var rheal = rawEff(39, caster[WIS]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[HP] = heal(rheal, target);
		}
	};},
CHIP_DEVIL_STRIKE : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_DEVIL_STRIKE);
	};},
CHIP_DOPING : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = rawEff(42.5, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[STR] += buff;
			addEffect(true)(target)([EFFECT_BUFF_STRENGTH, buff, caster[ID], 4, false, CHIP_DOPING, target[ID]]);
		}
	};},
CHIP_DRIP : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var rheal = rawEff(39, caster[WIS]) * crit;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			target[HP] = heal(rheal, target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			target[HP] = heal(rheal * 0.75, target);
		}
		else if (getCellDistance(center, tgt) === 2) {
			target[HP] = heal(rheal * 0.5, target);
		}
	};},
CHIP_FEROCITY : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_FEROCITY);
	};},
CHIP_FERTILIZER : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_FERTILIZER);
	};},
CHIP_FIRE_BULB : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_FIRE_BULB);
	};},
CHIP_FLAME : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(26, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_FLASH : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(21.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			atk(dmg * 0.5, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_FORTRESS : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var sh = rawEff(9, caster[RES]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[RSH] += sh;
			addEffect(true)(target)([EFFECT_RELATIVE_SHIELD, sh, caster[ID], 3, false, CHIP_FORTRESS, target[ID]]);
		}
	};},
CHIP_FRACTURE : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_FRACTURE);
	};},
CHIP_HEALER_BULB : function(@state, @caster, @center) {
	var clevel = caster[LEVEL] - 1;
	var corder = caster[ORDER];
	var new_id = state[S_MAX_ID]++;
	var entity =@	[ THP	: 400 + round(clevel / 300)
					, HP	: 400 + round(clevel / 300)
					, TMP	: 3 + round(3 * clevel / 300)
					, TMP	: 3 + round(3 * clevel / 300)
					, TMP	: 4 + round(4 * clevel / 300)
					, TP	: 4 + round(4 * clevel / 300)
					, SCI	: 0
					, STR	: 0
					, MAG	: 0
					, WIS	: 0 + round(300 * clevel / 300)
					, AGI	: 0 + round(300 * clevel / 300)
					, RES	: 0
					, ASH	: 0
					, RSH	: 0
					, RET : 0
					, POS	: center
					, TYPE: ENTITY_BULB
					, EFFS: []
					, CHIPS:	[ CHIP_BANDAGE: 0
								, CHIP_DRIP: 0
								, CHIP_CURE: 0
								, CHIP_VACCINE: 0 ]
					, EQ	: null
					, UNEQ: []
					, ID	: new_id
					, ORDER	: corder + 1
					, AREA_POINT		: getApplicableArea(AREA_POINT)(center)
					, AREA_CIRCLE_1	: getApplicableArea(AREA_CIRCLE_1)(center)
					, AREA_CIRCLE_2	: getApplicableArea(AREA_CIRCLE_2)(center)
					, AREA_CIRCLE_3	: getApplicableArea(AREA_CIRCLE_3)(center)
					, ALLY	: true
					, ENEMY	: false
					, SUMMON	: true
					, SUMMONER: caster[ID]
					, NAME	: 'healer_bulb'
					, LEVEL	: clevel
					];
	aIter(function(@x) { if (x[ORDER] > corder) { x[ORDER]++; }})(state[S_ALL]);
	push(state[S_ALLIES], new_id);
	state[S_ALL][new_id] = entity;
	insert(state[S_ORDER], new_id, corder);
	return function(@target) {
	};},
CHIP_HELMET : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var sh = rawEff(15, caster[RES]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[ASH] += sh;
			addEffect(true)(target)([EFFECT_ABSOLUTE_SHIELD, sh, caster[ID], 4, false, CHIP_HELMET, target[ID]]);
		}
	};},
CHIP_ICE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(18, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_ICEBERG : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(76, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			atk(dmg * 0.75, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 2) {
			atk(dmg * 0.5, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_ICED_BULB : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_ICED_BULB);
	};},
CHIP_INVERSION : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_INVERSION);
	};},
CHIP_LEATHER_BOOTS : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = round(rawEff(0.45, caster[SCI]) * crit);
	return function(@target) {
		if (center == target[POS]) {
			target[TMP] += buff;
			target[MP] += buff;
			addEffect(true)(target)([EFFECT_BUFF_MP, buff, caster[ID], 2, false, CHIP_LEATHER_BOOTS, target[ID]]);
		}
	};},
CHIP_LIBERATION : function(@state, @caster, @center) {
	return function(@target) {
		if (center == target[POS]) {
			aIter(removeEffect(target))(target[EFFS]);
		}
	};},
CHIP_LIGHTNING : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(41, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	var pos = caster[POS];
	return function(@target) {
		var tgt = target[POS];
		if (tgt === pos) {
			return;
		}
		else if (center === tgt) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			atk(dmg * 0.75, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 2) {
			atk(dmg * 0.5, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_LIGHTNING_BULB : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_LIGHTNING_BULB);
	};},
CHIP_LOAM : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_LOAM);
	};},
CHIP_METALLIC_BULB : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_METALLIC_BULB);
	};},
CHIP_METEORITE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(75, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			atk(dmg * 0.75, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 2) {
			atk(dmg * 0.5, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_MIRROR : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_MIRROR);
	};},
CHIP_MOTIVATION : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = round(rawEff(0.45, caster[SCI]) * crit);
	return function(@target) {
		if (center == target[POS]) {
			target[TTP] += buff;
			target[TP] += buff;
			addEffect(true)(target)([EFFECT_BUFF_TP, buff, caster[ID], 2, false, CHIP_MOTIVATION, target[ID]]);
		}
	};},
CHIP_PEBBLE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(9.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_PLAGUE : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_PLAGUE);
	};},
CHIP_PROTEIN : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = rawEff(32.5, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[STR] += buff;
			addEffect(true)(target)([EFFECT_BUFF_STRENGTH, buff, caster[ID], 2, false, CHIP_PROTEIN, target[ID]]);
		}
	};},
CHIP_PUNY_BULB : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_PUNY_BULB);
	};},
CHIP_RAGE : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_RAGE);
	};},
CHIP_RAMPART : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var sh = rawEff(7.5, caster[RES]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[RSH] += sh;
			addEffect(true)(target)([EFFECT_RELATIVE_SHIELD, sh, caster[ID], 3, false, CHIP_RAMPART, target[ID]]);
		}
	};}
CHIP_REFLEXES : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = rawEff(42.5, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[AGI] += buff;
			addEffect(true)(target)([EFFECT_BUFF_AGILITY, buff, caster[ID], 4, false, CHIP_REFLEXES, target[ID]]);
		}
	};},
CHIP_REGENERATION : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var rheal = rawEff(200, caster[WIS]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[HP] = heal(rheal, target);
		}
	};},
CHIP_REMISSION : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_REMISSION);
	};},
CHIP_RESURRECTION : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_RESURRECTION);
	};},
CHIP_ROCK : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(31.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_ROCKFALL : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(52, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			atk(dmg * 0.75, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 2) {
			atk(dmg * 0.5, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_ROCKY_BULB : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_ROCKY_BULB);
	};},
CHIP_SEVEN_LEAGUE_BOOTS : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = round(rawEff(0.55, caster[SCI]) * crit);
	return function(@target) {
		if (center == target[POS] && target[TYPE] == ENTITY_LEEK) {
			target[TMP] += buff;
			target[MP] += buff;
			addEffect(true)(target)([EFFECT_BUFF_MP, buff, caster[ID], 4, false, CHIP_SEVEN_LEAGUE_BOOTS, target[ID]]);
		}
	};},
CHIP_SHIELD : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var sh = rawEff(20, caster[RES]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[ASH] += sh;
			addEffect(true)(target)([EFFECT_ABSOLUTE_SHIELD, sh, caster[ID], 3, false, CHIP_SHIELD, target[ID]]);
		}
	};},
CHIP_SHOCK : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(6, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_SLOW_DOWN : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_SLOW_DOWN);
	};},
CHIP_SOLIDIFICATION : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = round(rawEff(55, caster[SCI]) * crit);
	return function(@target) {
		if (center == target[POS]) {
			target[RES] += buff;
			addEffect(true)(target)([EFFECT_BUFF_RESISTANCE, buff, caster[ID], 4, false, CHIP_SOLIDIFICATION, target[ID]]);
		}
	};},
CHIP_SOPORIFIC : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_SOPORIFIC);
	};},
CHIP_SPARK : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(10, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_STALACTITE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(65.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_STEROID : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_STEROID);
	};},
CHIP_STRETCHING : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = rawEff(32.5, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[AGI] += buff;
			addEffect(true)(target)([EFFECT_BUFF_AGILITY, buff, caster[ID], 2, false, CHIP_STRETCHING, target[ID]]);
		}
	};},
CHIP_TELEPORTATION : function(@state, @caster, @center) {
	caster[POS] = center;
	caster[AREA_POINT] = [center];
	caster[AREA_CIRCLE_1] = getApplicableArea(AREA_CIRCLE_1)(center);
	caster[AREA_CIRCLE_2] = getApplicableArea(AREA_CIRCLE_2)(center);
	caster[AREA_CIRCLE_3] = getApplicableArea(AREA_CIRCLE_3)(center);
	return function(@target) {
	};},
CHIP_THORN : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_THORN);
	};},
CHIP_TOXIN : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_TOXIN);
	};},
CHIP_TRANQUILIZER : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var shack = shackle(0.35 * crit, caster);
	return function(@target) {
		if (center == target[POS]) {
			var debuff = shack(target);
			target[TTP] -= debuff;
			target[TP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_TP, debuff, caster[ID], 1, false, CHIP_TRANQUILIZER, target[ID]]);
		}
	};},
CHIP_VACCINE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var rheal = rawEff(40, caster[WIS]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			addEffect(true)(target)([EFFECT_HEAL, rheal, caster[ID], 3, false, CHIP_VACCINE, target[ID]]);
		}
	};},
CHIP_VENOM : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(17.5, caster[MAG]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			addEffect(false)(target)([EFFECT_POISON, dmg, caster[ID], 2, false, CHIP_VENOM, target[ID]]);
		}
	};},
CHIP_WALL : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var sh = rawEff(5.5, caster[RES]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[RSH] += sh;
			addEffect(true)(target)([EFFECT_RELATIVE_SHIELD, sh, caster[ID], 2, false, CHIP_WALL, target[ID]]);
		}
	};},
CHIP_WARM_UP : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = rawEff(37.5, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[AGI] += buff;
			addEffect(true)(target)([EFFECT_BUFF_AGILITY, buff, caster[ID], 3, false, CHIP_WARM_UP, target[ID]]);
		}
	};},
CHIP_WHIP : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_WHIP);
	};},
CHIP_WINGED_BOOTS : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_WINGED_BOOTS);
	};},
];
