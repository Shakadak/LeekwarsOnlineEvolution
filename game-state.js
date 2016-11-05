include("functional.js");
include("bool.js");
include("array.js");
include("map");
include("item");

function getGameState() {
	var ret = [];
	var allies = getAliveAllies();
	var enemies = getAliveEnemies();
	var all = allies + enemies;
	return 	[ "self"	: getLeek()
			, "allies"	: allies
			, "enemies"	: enemies
			, "all"		: keysMap(getEntityState)(all)
			, "weapons"	: getWeapons()
			, "equipped": getWeapon()
			, "chips"	: aFilter(compose(equal(0))(getCooldown))(getChips())
			, "n" : 0 ];
}

function getEntityState(e) {
	return	[ "THP"	: getTotalLife(e)
			, "HP"	: getLife(e)
			, "TMP"	: getTotalMP(e)
			, "MP"	: getMP(e)
			, "TTP"	: getTotalTP(e)
			, "TP"	: getTP(e)
			, "SCI"	: getScience(e)
			, "STR"	: getStrength(e)
			, "MAG"	: getMagic(e)
			, "WIS"	: getWisdom(e)
			, "AGI"	: getAgility(e)
			, "RES"	: getResistance(e)
			, "ASH"	: getAbsoluteShield(e)
			, "RSH"	: getRelativeShield(e)
			, "RET" : getDamageReturn(e)
			, "POS"	: getCell(e)
			, "TYPE": getType(e)
			, "EFFS": getEffects(e)
			, "ID"	: e
			, "A" + AREA_POINT		: getApplicableArea(AREA_POINT)(getCell(e))
			, "A" +	AREA_CIRCLE_1	: getApplicableArea(AREA_CIRCLE_1)(getCell(e))
			, "A" +	AREA_CIRCLE_2	: getApplicableArea(AREA_CIRCLE_2)(getCell(e))
			, "A" +	AREA_CIRCLE_3	: getApplicableArea(AREA_CIRCLE_3)(getCell(e)) ];
}

function getSelf(@state) {return state["all"][state["self"]];}

function getActionListFromState(@s) {
	var tp =@ getSelf(s)["TP"];
	var eq =@ s["equipped"];
	var fWeap =@ function(@w) { return tp >= getWeaponCost(w) + (eq != w); };
	var weapons =@ aFilter(fWeap)(s["weapons"]);
	var fChip =@ function(@c) { return tp >= getChipCost(c); };
	var chips =@ aFilter(fChip)(s["chips"]);
	return	weapons + chips;
}

function getMovementListFromState(@s) {
	var moves =@ getlAccessibleCells(/*min(1, */getSelf(s)["MP"]/*)*/)(getSelf(s)["POS"]);
	return	[ "moves"	: getKeys(moves)
			, "mcosts"	: moves ];
}

function updateState(@s) { return function(@f) { s =@ f(s); };}

function getRandomChip(@s) {
}

function getItemTargetsFromState(@state, @item, @cell) {
	var cells = getApplicableArea(getItemArea(item))(cell);
	return arrayFoldLeft(state["all"], function(@acc, @x) {
		if (inArray(cells, x["POS"])) { push(acc, x["ID"]);}
		return acc;
	}, []);
}

function applyEffect(@wearer) { return function(@effect) {
	var type = effect[0];
	if (type === EFFECT_POISON) {
		wearer['HP'] -= effect[1];
	}
	else if (type === EFFECT_HEAL) {
		wearer['HP'] = heal(effect[1], wearer);
	}
};}

function addEffect(@buff) { return function(@wearer) { return function(@effect) {
	var item_id = effect[5];
	if (buff) {
		wearer['EFFS'] =@ aFilter(function(@eff) {return eff[5] === item_id; })(wearer['EFFS']);
	}
	push(wearer['EFFS'], effect);
};};}

function removeEffect(@wearer) { return function(@effect) {
	var type = effect[0];
	if (type === EFFECT_ABSOLUTE_SHIELD) {
		wearer['ASH'] -= effect[1];
	}
	else if (type === EFFECT_RELATIVE_SHIELD) {
		wearer['RSH'] -= effect[1];
	}
	else if (type === EFFECT_BUFF_AGILITY) {
		wearer['AGI'] -= effect[1];
	}
	else if (type === EFFECT_BUFF_RESISTANCE) {
		wearer['RES'] -= effect[1];
	}
	else if (type === EFFECT_BUFF_STRENGTH) {
		wearer['STR'] -= effect[1];
	}
	else if (type === EFFECT_BUFF_WISDOM) {
		wearer['WIS'] -= effect[1];
	}
	else if (type === EFFECT_BUFF_MP) {
		wearer['TMP'] -= effect[1];
		wearer['MP'] -= effect[1];
	}
	else if (type === EFFECT_BUFF_TP) {
		wearer['TTP'] -= effect[1];
		wearer['TP'] -= effect[1];
	}
	else if (type === EFFECT_SHACKLE_MAGIC) {
		wearer['MAG'] += effect[1];
	}
	else if (type === EFFECT_SHACKLE_STRENGTH) {
		wearer['STR'] += effect[1];
	}
	else if (type === EFFECT_SHACKLE_MP) {
		wearer['TMP'] += effect[1];
		wearer['MP'] += effect[1];
	}
	else if (type === EFFECT_SHACKLE_TP) {
		wearer['TTP'] += effect[1];
		wearer['TP'] += effect[1];
	}
	else if (type === EFFECT_DAMAGE_RETURN) {
		wearer['RET'] -= effect[1];
	}
};}

function rawEff(@base, @stat) {
	return base * (100 + stat) / 100;
}

function damage(@raw, @target) {
	return max(0, raw * (1 - target["RSH"] / 100) - target["ASH"]);
}

function heal(@raw, @target) {
	return min(target["THP"], target["HP"] + raw);
}

function shackle(@base, @caster) {
	var mag = caster["mag"];
	return function(@target) {
		return round(base * (100 + max(0, mag - target["SCI"])) / 100);
	};
}

function atk(@dmg, @ls, @target, @caster) {
	var effDmg = damage(dmg, target);
	target["HP"] -= effDmg;
	caster["HP"] = heal(ls * effDmg, caster);
	caster["HP"] -= dmg * target['RET'] / 100;
}

function removeDead(@state) {
	//debug("[removeDead] state: " + state);
	return function(@target) {
	if (target['HP'] <= 0) {
		removeElement(state['allies'], target['ID']);
		removeElement(state['enemies'], target['ID']);
		removeElement(state['all'], target);
	}
};}

global ITEMS_EFFECT = [
WEAPON_AXE : function(@state, @caster, @center) {
	var dmg = rawEff(60.5, caster["STR"]);
	var shack = shackle(0.55, caster);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
			atk(dmg, ls, target, caster);
			target["MP"] -= shack(target);
			target["TMP"] -= shack(target);
			removeDead(state)(target);
		}
	};}
WEAPON_B_LASER : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(WEAPON_B_LASER);
	};},
WEAPON_BROADSWORD : function(@state, @caster, @center) {
	var dmg = rawEff(40, caster["STR"]);
	var shack = shackle(0.35, caster);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
			atk(dmg, ls, target, caster);
			target["TP"] -= shack(target);
			removeDead(state)(target);
		}
	};},
WEAPON_DESTROYER : function(@state, @caster, @center) {
	var dmg = rawEff(50, caster["STR"]);
	var shack = shackle(12, caster);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
			atk(dmg, ls, target, caster);
			target["STR"] -= shack(target);
			removeDead(state)(target);
		}
	};},
WEAPON_DOUBLE_GUN : function(@state, @caster, @center) {
	var dmg = rawEff(21.5, caster["STR"]);
	var dmg2 = rawEff(6.5, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
			atk(dmg, ls, target, caster);
			atk(dmg2, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_ELECTRISOR : function(@state, @caster, @center) {
	var dmg = rawEff(75, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
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
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(WEAPON_GAZOR);
	};},
WEAPON_GRENADE_LAUNCHER : function(@state, @caster, @center) {
	var dmg = rawEff(49, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		var tgt = target["POS"];
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
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(WEAPON_KATANA);
	};},
WEAPON_LASER : function(@state, @caster, @center) {
	var dmg = rawEff(51, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	var pos = caster["POS"];
	var codir = sameDir(pos)(center);
	var all_id = state['allies'] + state['enemies'];
	return function(@target) {
		var tgt = target["POS"];
		if (codir(tgt) && inRange(WEAPON_LASER)(pos)(tgt) && lineOfSight(pos, tgt, all_id)) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_MACHINE_GUN : function(@state, @caster, @center) {
	var dmg = rawEff(22, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_MAGNUM : function(@state, @caster, @center) {
	var dmg = rawEff(32.5, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
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
	var dmg = rawEff(17.5, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_SHOTGUN : function(@state, @caster, @center) {
	var dmg = rawEff(38, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
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
	var sh = rawEff(25, caster["RES"]);
	return function(@target) {
		if (center == target["POS"]) {
			target["ASH"] += sh;
			addEffect(true)(target)([EFFECT_ABSOLUTE_SHIELD, sh, caster['ID'], 4, false, CHIP_ARMOR, target['ID']]);
		}
	};},
CHIP_ARMORING : function(@state, @caster, @center) {
	var boost = rawEff(22.5, caster["WIS"]);
	return function(@target) {
		if (center == target["POS"]) {
			target["THP"] += boost;
			target["HP"] += boost;
		}
	};},
CHIP_BALL_AND_CHAIN : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_BALL_AND_CHAIN);
	};},
CHIP_BANDAGE : function(@state, @caster, @center) {
	var rheal = rawEff(12.5, caster["WIS"]);
	return function(@target) {
		if (center == target["POS"]) {
			target["HP"] = heal(rheal, target);
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
	var rheal = rawEff(39, caster["WIS"]);
	return function(@target) {
		if (center == target["POS"]) {
			target["HP"] = heal(rheal, target);
		}
	};},
CHIP_DEVIL_STRIKE : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_DEVIL_STRIKE);
	};},
CHIP_DOPING : function(@state, @caster, @center) {
	var buff = rawEff(42.5, caster["SCI"]);
	return function(@target) {
		if (center == target["POS"]) {
			target["STR"] += buff;
			addEffect(true)(target)([EFFECT_BUFF_STRENGTH, buff, caster['ID'], 4, false, CHIP_DOPING, target['ID']]);
		}
	};},
CHIP_DRIP : function(@state, @caster, @center) {
	var rheal = rawEff(39, caster["WIS"]);
	return function(@target) {
		var tgt = target["POS"];
		if (center == tgt) {
			target["HP"] = heal(rheal, target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			target["HP"] = heal(rheal * 0.75, target);
		}
		else if (getCellDistance(center, tgt) === 2) {
			target["HP"] = heal(rheal * 0.5, target);
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
	var dmg = rawEff(26, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_FLASH : function(@state, @caster, @center) {
	var dmg = rawEff(21.5, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		var tgt = target["POS"];
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
	var sh = rawEff(9, caster["RES"]);
	return function(@target) {
		if (center == target["POS"]) {
			target["RSH"] += sh;
			addEffect(true)(target)([EFFECT_RELATIVE_SHIELD, sh, caster['ID'], 3, false, CHIP_FORTRESS, target['ID']]);
		}
	};},
CHIP_FRACTURE : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_FRACTURE);
	};},
CHIP_HEALER_BULB : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_HEALER_BULB);
	};},
CHIP_HELMET : function(@state, @caster, @center) {
	var sh = rawEff(15, caster["RES"]);
	return function(@target) {
		if (center == target["POS"]) {
			target["ASH"] += sh;
			addEffect(true)(target)([EFFECT_ABSOLUTE_SHIELD, sh, caster['ID'], 4, false, CHIP_HELMET, target['ID']]);
		}
	};},
CHIP_ICE : function(@state, @caster, @center) {
	var dmg = rawEff(18, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_ICEBERG : function(@state, @caster, @center) {
	var dmg = rawEff(76, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		var tgt = target["POS"];
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
	var buff = round(rawEff(0.45, caster["SCI"]));
	return function(@target) {
		if (center == target["POS"]) {
			target["TMP"] += buff;
			target["MP"] += buff;
			addEffect(true)(target)([EFFECT_BUFF_MP, buff, caster['ID'], 2, false, CHIP_LEATHER_BOOTS, target['ID']]);
		}
	};},
CHIP_LIBERATION : function(@state, @caster, @center) {
	return function(@target) {
		if (center == target["POS"]) {
			aIter(removeEffect(target))(target['EFFS']);
		}
	};},
CHIP_LIGHTNING : function(@state, @caster, @center) {
	var dmg = rawEff(41, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	var pos = caster['POS'];
	return function(@target) {
		var tgt = target["POS"];
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
	var dmg = rawEff(75, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		var tgt = target["POS"];
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
	var buff = round(rawEff(0.45, caster["SCI"]));
	return function(@target) {
		if (center == target["POS"]) {
			target["TTP"] += buff;
			target["TP"] += buff;
			addEffect(true)(target)([EFFECT_BUFF_TP, buff, caster['ID'], 2, false, CHIP_MOTIVATION, target['ID']]);
		}
	};},
CHIP_PEBBLE : function(@state, @caster, @center) {
	var dmg = rawEff(9.5, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
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
	var buff = rawEff(32.5, caster["SCI"]);
	return function(@target) {
		if (center == target["POS"]) {
			target["STR"] += buff;
			addEffect(true)(target)([EFFECT_BUFF_STRENGTH, buff, caster['ID'], 2, false, CHIP_PROTEIN, target['ID']]);
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
	var sh = rawEff(0.075, caster["RES"]);
	return function(@target) {
		if (center == target["POS"]) {
			target["RSH"] += sh;
			addEffect(true)(target)([EFFECT_RELATIVE_SHIELD, sh, caster['ID'], 3, false, CHIP_RAMPART, target['ID']]);
		}
	};}
CHIP_REFLEXES : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_REFLEXES);
	};},
CHIP_REGENERATION : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_REGENERATION);
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
	var dmg = rawEff(31.5, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_ROCKFALL : function(@state, @caster, @center) {
	var dmg = rawEff(52, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		var tgt = target["POS"];
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
	var buff = round(rawEff(0.55, caster["SCI"]));
	return function(@target) {
		if (center == target["POS"] && target["TYPE"] == ENTITY_LEEK) {
			target["TMP"] += buff;
			target["MP"] += buff;
			addEffect(true)(target)([EFFECT_BUFF_MP, buff, caster['ID'], 4, false, CHIP_SEVEN_LEAGUE_BOOTS, target['ID']]);
		}
	};},
CHIP_SHIELD : function(@state, @caster, @center) {
	var sh = rawEff(20, caster["RES"]);
	return function(@target) {
		if (center == target["POS"]) {
			target["ASH"] += sh;
			addEffect(true)(target)([EFFECT_ABSOLUTE_SHIELD, sh, caster['ID'], 3, false, CHIP_SHIELD, target['ID']]);
		}
	};},
CHIP_SHOCK : function(@state, @caster, @center) {
	var dmg = rawEff(6, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
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
	var buff = round(rawEff(55, caster["SCI"]));
	return function(@target) {
		if (center == target["POS"]) {
			target["RES"] += buff;
			addEffect(true)(target)([EFFECT_BUFF_RESISTANCE, buff, caster['ID'], 4, false, CHIP_SOLIDIFICATION, target['ID']]);
		}
	};},
CHIP_SOPORIFIC : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_SOPORIFIC);
	};},
CHIP_SPARK : function(@state, @caster, @center) {
	var dmg = rawEff(10, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_STALACTITE : function(@state, @caster, @center) {
	var dmg = rawEff(65.5, caster["STR"]);
	var ls = caster["WIS"] / 1000;
	return function(@target) {
		if (center == target["POS"]) {
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
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_STRETCHING);
	};},
CHIP_TELEPORTATION : function(@state, @caster, @center) {
	caster['POS'] = center;
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
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_TRANQUILIZER);
	};},
CHIP_VACCINE : function(@state, @caster, @center) {
	var rheal = rawEff(40, caster["WIS"]);
	return function(@target) {
		if (center == target["POS"]) {
			addEffect(true)(target)([EFFECT_HEAL, rheal, caster['ID'], 3, false, CHIP_VACCINE, target['ID']]);
		}
	};},
CHIP_VENOM : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_VENOM);
	};},
CHIP_WALL : function(@state, @caster, @center) {
	var sh = rawEff(0.055, caster["RES"]);
	return function(@target) {
		if (center == target["POS"]) {
			target["RSH"] += sh;
			addEffect(true)(target)([EFFECT_RELATIVE_SHIELD, sh, caster['ID'], 2, false, CHIP_WALL, target['ID']]);
		}
	};},
CHIP_WARM_UP : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_WARM_UP);
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
