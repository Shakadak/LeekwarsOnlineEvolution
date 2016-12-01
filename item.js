include("memo.js");
include('functional.js');

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

function aligned(@c1) {
	var x1 = getCellX(c1), y1 = getCellY(c1);
	return function(@c2) {
	return x1 == getCellX(c2) || y1 == getCellY(c2);
};}

function ualigned(@c1, @c2) {
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

function inRange(@item) {
	var minrange = ITEM_MIN_RANGE[item];
	var maxrange = ITEM_MAX_RANGE[item];
	return function(@trigger) { return function(@target) {
	var dist = getCellDistance(trigger, target);
	return maxrange >= dist && dist >= minrange;
};};}

function canAim(@item) {
	var needLos = itemNeedLOS(item);
	return function(@trigger) { return function(@target) {
	return needLos	? lineOfSight(trigger, target, GLOBAL_LEEK_ID)
					: true;
};};}

function canLine(@item) {
	return isInlineItem(item)	? function(@trigger) {
			var triggAlign =@ aligned(trigger);
			return function(@target) {
				return triggAlign(target);
			};}
								: const(const(true));
}

function canTargetCell(@item) {
	var itemInRange =@ inRange(item);
	var itemCanAim =@ canAim(item);
	var itemCanLine =@ canLine(item);
	return function(@trigger) {
		var triggerInRange =@ itemInRange(trigger);
		var triggerCanAim =@ itemCanAim(trigger);
		var triggerCanLine =@ itemCanLine(trigger);
		return function(@target) {
			return triggerInRange(target)
				&& triggerCanAim(target)
				&& triggerCanLine(target);
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

global ITEM_DMG_TP = [
WEAPON_AXE : 10.08,
WEAPON_B_LASER : 11,
WEAPON_BROADSWORD : 8,
WEAPON_DESTROYER : 8.33,
WEAPON_DOUBLE_GUN : 7,
WEAPON_ELECTRISOR : 10.71,
WEAPON_FLAME_THROWER : 6.25,
WEAPON_GAZOR : 0,
WEAPON_GRENADE_LAUNCHER : 8.17,
WEAPON_KATANA : 11,
WEAPON_LASER : 8.5,
WEAPON_MACHINE_GUN : 5.5,
WEAPON_MAGNUM : 6.5,
WEAPON_M_LASER : 11.88,
WEAPON_PISTOL : 5.83,
WEAPON_SHOTGUN : 7.6,
CHIP_ACCELERATION : 0,
CHIP_ADRENALINE : 0,
CHIP_ANTIDOTE : 0,
CHIP_ARMOR : 0,
CHIP_ARMORING : 0,
CHIP_BALL_AND_CHAIN : 0,
CHIP_BANDAGE : 0,
CHIP_BARK : 0,
CHIP_BURNING : 16.5,
CHIP_CARAPACE : 0,
CHIP_COLLAR : 0,
CHIP_CURE : 0,
CHIP_DEVIL_STRIKE : 20.83,
CHIP_DOPING : 0,
CHIP_DRIP : 0,
CHIP_FEROCITY : 0,
CHIP_FERTILIZER : 0,
CHIP_FIRE_BULB : 0,
CHIP_FLAME : 6.5,
CHIP_FLASH : 5.38,
CHIP_FORTRESS : 0,
CHIP_FRACTURE : 0,
CHIP_HEALER_BULB : 0,
CHIP_HELMET : 0,
CHIP_ICE : 4.5,
CHIP_ICEBERG : 10.86,
CHIP_ICED_BULB : 0,
CHIP_INVERSION : 0,
CHIP_LEATHER_BOOTS : 0,
CHIP_LIBERATION : 0,
CHIP_LIGHTNING : 10.25,
CHIP_LIGHTNING_BULB : 0,
CHIP_LOAM : 0,
CHIP_METALLIC_BULB : 0,
CHIP_METEORITE : 9.38,
CHIP_MIRROR : 0,
CHIP_MOTIVATION : 0,
CHIP_PEBBLE : 4.75,
CHIP_PLAGUE : 0,
CHIP_PROTEIN : 0,
CHIP_PUNY_BULB : 0,
CHIP_RAGE : 0,
CHIP_RAMPART : 0,
CHIP_REFLEXES : 0,
CHIP_REGENERATION : 0,
CHIP_REMISSION : 0,
CHIP_RESURRECTION : 0,
CHIP_ROCK : 6.1,
CHIP_ROCKFALL : 10.4,
CHIP_ROCKY_BULB : 0,
CHIP_SEVEN_LEAGUE_BOOTS : 0,
CHIP_SHIELD : 0,
CHIP_SHOCK : 3,
CHIP_SLOW_DOWN : 0,
CHIP_SOLIDIFICATION : 0,
CHIP_SOPORIFIC : 0,
CHIP_SPARK : 4,
CHIP_STALACTITE : 10.92,
CHIP_STEROID : 0,
CHIP_STRETCHING : 0,
CHIP_TELEPORTATION : 0,
CHIP_THORN : 0,
CHIP_TOXIN : 0,
CHIP_TRANQUILIZER : 0,
CHIP_VACCINE : 0,
CHIP_VENOM : 0,
CHIP_WALL : 0,
CHIP_WARM_UP : 0,
CHIP_WHIP : 0,
CHIP_WINGED_BOOTS : 0,
];
