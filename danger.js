include('chips');
include('item');
include('math.js');
include('array.js');
include('game-state.js');

/**
* averageDamageOnCell : Cell -> LeekState -> Int
*/
function averageDmgFromLeekOnCell(@cell) { return function(@leek) {
	var pos = leek[POS];
	var dist = getCellDistance(cell, pos) + (lineOfSight(cell, pos) ? 0 : 2) - leek[MP];
	var dmgMultiplier = (100 + leek[STR]) / 100;
	var poiMultiplier = (100 + leek[MAG]) / 100;
	var critMultiplier = 1 + 0.4 * (leek[AGI] / 1000);
	var dangerousItems =@ aFilter(lookup(cAttaques))(leek[CHIPS]);
	dangerousItems += leek[UNEQ];
	var eq = leek[EQ];
	if (eq !== null) { push(dangerousItems, eq); }
	dangerousItems =@ aFilter(compose(inferior(dist))(lookup(ITEM_MAX_RANGE)))(dangerousItems);
	var dmgAvg = defaultDiv(0)(sum(daMap(lookup(ITEM_DMG_TP))(dangerousItems)))(count(dangerousItems));
	return dmgAvg * dmgMultiplier * critMultiplier * leek[TP];
};}

/**
* averageDmgFromLeeksOnCell : (LeekState -> Bool) -> Cell -> Array LeekState -> Int
*/
function averageDmgFromLeeksOnCell(@p) { return function(@cell) { return function(@leeks) {
	return arrayFoldLeft(leeks, function(@acc, @l) {
		return acc + (p(l) ? averageDmgFromLeekOnCell(cell)(l) : 0);
	}, 0);
};};}
