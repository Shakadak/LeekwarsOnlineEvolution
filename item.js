include("memo.js");


global GLOBAL_LEEK_ID = getLeek();

function getDangerousItems(leek) {
	var strength = getStrength(leek);
	var aShield = getAbsoluteShield();
	var rShield = getRelativeShield();
	return getDangerousChips(leek) + getWeapons(leek);
}

function getDangerousChips(leek){
	var cs = getChips(leek);
	var dChips = [];
	var effs;
	for (var c in cs) {
		if (c === CHIP_SPARK){ continue; }
		effs = getChipEffects(c);
		for (var e in effs) {
			if (inArray(e, EFFECT_DAMAGE)) { push(dChips, c); break;}
		}
	}
	//debug("dChips: " + dChips);
	return @dChips;
}

global getItemEffects = memo1(function(item) {
	return isWeapon(item)	? getWeaponEffects(item)
							: getChipEffects(item);
});

global getCellsToUseItemOnCell = memou2(function(item, cell) {
	return isWeapon(item)	? getCellsToUseWeaponOnCell(item, cell)
							: getCellsToUseChipOnCell(item, cell);
});

global getItemCost = memo1(function(item) {
	return isWeapon(item)	? getWeaponCost(item)
							: getChipCost(item);
});

function useItemOnCell(item) { return function(cell) {
	return isWeapon(item)	? useWeaponOnCell(cell)
							: useChipOnCell(item, cell);
};}

function getItemName(item) {
	return isWeapon(item)	? getWeaponName(item)
							: getChipName(item);
}

global getItemArea = bmemo(function(item) {
	return isWeapon(item)	? getWeaponArea(item)
							: getChipArea(item);
});

global canUseItemOn = bmemo(null);

global getAverageEffect = memo2(function(effect_type) { return function(item){
	return arrayFoldLeft(getItemEffects(item), function(@acc, @x) {
		return x[0] === effect_type	? acc + (x[1] + x[2]) / 2
									: acc;
	}, 0);
};});

function getItemTargets(@item, @cell) {
	return isWeapon(item)	? getWeaponTargets(item, cell)
							: getChipTargets(item, cell);
}

global isInlineItem = bmemo(function(@item) {
	return isWeapon(item)	? isInlineWeapon(item)
							: isInlineChip(item);
});

function aligned(@c1, @c2) {
	return getCellX(c1) == getCellX(c2) || getCellY(c1) == getCellY(c2);
}

function sameDir(@c0) {
	var x0 = getCellX(c0);
	var y0 = getCellY(c0);
	return function(@c1) {
		var x1 = getCellX(c1);
		var y1 = getCellY(c1);
		var x01 = x1 - x0;
		var y01 = y1 - y0;
		return function(@c2) {
			var x2 = getCellX(c2);
			var y2 = getCellY(c2);
			var x02 = x2 - x0;
			var y02 = y2 - y0;
			return x1 == x2 && y01 * y02 > 0	? true
				 : y1 == y2 && x01 * x02 > 0	? true
				 								: false;
};};}

global itemNeedLOS = bmemo(function(@item) {
	return isWeapon(item)	? weaponNeedLos(item)
							: chipNeedLos(item);
});

global getItemMinRange = bmemo(function(@item) {
	return isWeapon(item)	? getWeaponMinRange(item)
							: getChipMinRange(item);
});

global getItemMaxRange = bmemo(function(@item) {
	return isWeapon(item)	? getWeaponMaxRange(item)
							: getChipMaxRange(item);
});

function inRange(@item) { return function(@trigger) { return function(@target) {
	var dist = getCellDistance(trigger, target);
	return ITEM_MIN_RANGE[item] <= dist && dist <= ITEM_MAX_RANGE[item];
};};}

function canAim(@item) { return function(@trigger) { return function(@target) {
	return itemNeedLOS(item)	? lineOfSight(trigger, target, GLOBAL_LEEK_ID)
								: true;
};};}

function canLine(@item) { return function(@trigger) { return function(@target) {
	return isInlineItem(item)	? aligned(trigger, target)
								: true;
};};}

function canTargetCell(@item) { return function(@trigger) { return function(@target) {
	return inRange(item)(trigger)(target) && canAim(item)(trigger)(target) && canLine(item)(trigger)(target);
};};}


global ITEMS = [
WEAPON_AXE : WEAPON_AXE,
WEAPON_B_LASER : WEAPON_B_LASER,
WEAPON_BROADSWORD : WEAPON_BROADSWORD,
WEAPON_DESTROYER : WEAPON_DESTROYER,
WEAPON_DOUBLE_GUN : WEAPON_DOUBLE_GUN,
WEAPON_ELECTRISOR : WEAPON_ELECTRISOR,
WEAPON_FLAME_THROWER : WEAPON_FLAME_THROWER,
WEAPON_GAZOR : WEAPON_GAZOR,
WEAPON_GRENADE_LAUNCHER : WEAPON_GRENADE_LAUNCHER,
WEAPON_KATANA : WEAPON_KATANA,
WEAPON_LASER : WEAPON_LASER,
WEAPON_MACHINE_GUN : WEAPON_MACHINE_GUN,
WEAPON_MAGNUM : WEAPON_MAGNUM,
WEAPON_M_LASER : WEAPON_M_LASER,
WEAPON_PISTOL : WEAPON_PISTOL,
WEAPON_SHOTGUN : WEAPON_SHOTGUN,
CHIP_ACCELERATION : CHIP_ACCELERATION,
CHIP_ADRENALINE : CHIP_ADRENALINE,
CHIP_ANTIDOTE : CHIP_ANTIDOTE,
CHIP_ARMOR : CHIP_ARMOR,
CHIP_ARMORING : CHIP_ARMORING,
CHIP_BALL_AND_CHAIN : CHIP_BALL_AND_CHAIN,
CHIP_BANDAGE : CHIP_BANDAGE,
CHIP_BARK : CHIP_BARK,
CHIP_BURNING : CHIP_BURNING,
CHIP_CARAPACE : CHIP_CARAPACE,
CHIP_COLLAR : CHIP_COLLAR,
CHIP_CURE : CHIP_CURE,
CHIP_DEVIL_STRIKE : CHIP_DEVIL_STRIKE,
CHIP_DOPING : CHIP_DOPING,
CHIP_DRIP : CHIP_DRIP,
CHIP_FEROCITY : CHIP_FEROCITY,
CHIP_FERTILIZER : CHIP_FERTILIZER,
CHIP_FIRE_BULB : CHIP_FIRE_BULB,
CHIP_FLAME : CHIP_FLAME,
CHIP_FLASH : CHIP_FLASH,
CHIP_FORTRESS : CHIP_FORTRESS,
CHIP_FRACTURE : CHIP_FRACTURE,
CHIP_HEALER_BULB : CHIP_HEALER_BULB,
CHIP_HELMET : CHIP_HELMET,
CHIP_ICE : CHIP_ICE,
CHIP_ICEBERG : CHIP_ICEBERG,
CHIP_ICED_BULB : CHIP_ICED_BULB,
CHIP_INVERSION : CHIP_INVERSION,
CHIP_LEATHER_BOOTS : CHIP_LEATHER_BOOTS,
CHIP_LIBERATION : CHIP_LIBERATION,
CHIP_LIGHTNING : CHIP_LIGHTNING,
CHIP_LIGHTNING_BULB : CHIP_LIGHTNING_BULB,
CHIP_LOAM : CHIP_LOAM,
CHIP_METALLIC_BULB : CHIP_METALLIC_BULB,
CHIP_METEORITE : CHIP_METEORITE,
CHIP_MIRROR : CHIP_MIRROR,
CHIP_MOTIVATION : CHIP_MOTIVATION,
CHIP_PEBBLE : CHIP_PEBBLE,
CHIP_PLAGUE : CHIP_PLAGUE,
CHIP_PROTEIN : CHIP_PROTEIN,
CHIP_PUNY_BULB : CHIP_PUNY_BULB,
CHIP_RAGE : CHIP_RAGE,
CHIP_RAMPART : CHIP_RAMPART,
CHIP_REFLEXES : CHIP_REFLEXES,
CHIP_REGENERATION : CHIP_REGENERATION,
CHIP_REMISSION : CHIP_REMISSION,
CHIP_RESURRECTION : CHIP_RESURRECTION,
CHIP_ROCK : CHIP_ROCK,
CHIP_ROCKFALL : CHIP_ROCKFALL,
CHIP_ROCKY_BULB : CHIP_ROCKY_BULB,
CHIP_SEVEN_LEAGUE_BOOTS : CHIP_SEVEN_LEAGUE_BOOTS,
CHIP_SHIELD : CHIP_SHIELD,
CHIP_SHOCK : CHIP_SHOCK,
CHIP_SLOW_DOWN : CHIP_SLOW_DOWN,
CHIP_SOLIDIFICATION : CHIP_SOLIDIFICATION,
CHIP_SOPORIFIC : CHIP_SOPORIFIC,
CHIP_SPARK : CHIP_SPARK,
CHIP_STALACTITE : CHIP_STALACTITE,
CHIP_STEROID : CHIP_STEROID,
CHIP_STRETCHING : CHIP_STRETCHING,
CHIP_TELEPORTATION : CHIP_TELEPORTATION,
CHIP_THORN : CHIP_THORN,
CHIP_TOXIN : CHIP_TOXIN,
CHIP_TRANQUILIZER : CHIP_TRANQUILIZER,
CHIP_VACCINE : CHIP_VACCINE,
CHIP_VENOM : CHIP_VENOM,
CHIP_WALL : CHIP_WALL,
CHIP_WARM_UP : CHIP_WARM_UP,
CHIP_WHIP : CHIP_WHIP,
CHIP_WINGED_BOOTS : CHIP_WINGED_BOOTS,
];

global ITEM_MAX_RANGE = arrayMap(ITEMS, function(@item, @_) {return getItemMaxRange(item);});
global ITEM_MIN_RANGE = arrayMap(ITEMS, function(@item, @_) {return getItemMinRange(item);});
