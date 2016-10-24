include("functional.js");
include("bool.js");
include("list.js");
include("map");
include("item");
include("math.js");
include("chips");
include("game-state.js");
include("pq.js");

global totalPop;
totalPop =@ 0;
main();

function getLaserTargets(@item, @caster) {
	var center = caster['POS'];
	var cx = getCellX(center);
	var cy = getCellY(center);
	var minr = getWeaponMinRange(item);
	var ret =@ [];
	var tgt = getCellFromXY(cx + minr, cy);
	if (lineOfSight(center, tgt)) {
		push(ret, tgt);
	}
	tgt =@ getCellFromXY(cx - minr, cy);
	if (lineOfSight(center, tgt)) {
		push(ret, tgt);
	}
	tgt =@ getCellFromXY(cx, cy + minr);
	if (lineOfSight(center, tgt)) {
		push(ret, tgt);
	}
	tgt =@ getCellFromXY(cx, cy - minr);
	if (lineOfSight(center, tgt)) {
		push(ret, tgt);
	}
	return ret;
}

function getRandomTarget(@state, @item) {
	var area = getItemArea(item);
	var validCells;
	if (area == AREA_LASER_LINE) {
		validCells =@ getLaserTargets(item, getSelf(state));
	}
	else if (item === CHIP_TELEPORTATION) {
		validCells =@ getCellsToUseChipOnCell(CHIP_TELEPORTATION, getSelf(state)['POS']);
	}
	else {
		var states =@ state["all"];
		var validTargets =@ (isWeapon(item) || cAttaques[item]	? state["enemies"]
							: item === CHIP_LIBERATION			? state['allies'] + state['enemies']
							: state['allies']);
		validCells =@ arrayFlatten(aMap(function(@x){return states[x]["A"+area];})(validTargets));
	}
	shuffle(validCells);
	var target;
	do {
		target = shift(validCells);
	} while (  target !== null
				&& !canTargetCell(item)(getSelf(state)["POS"])(target));
	return target;
}

function getMove(@gameState) {
	if (getSelf(gameState)["MP"] === 0) { return []; }
	var moveList =@ getMovementListFromState(gameState);
	return aMap(delay(function(@cell) {
		var moved = moveList["mcosts"][cell];
		updateState(getSelf(gameState)["MP"])(subTo(moved));
		updateState(getSelf(gameState)["POS"])(const(cell));
		updateState(getSelf(gameState)["A1"])(const(getApplicableArea(AREA_POINT)(cell)));
		updateState(getSelf(gameState)["A3"])(const(getApplicableArea(AREA_CIRCLE_1)(cell)));
		updateState(getSelf(gameState)["A4"])(const(getApplicableArea(AREA_CIRCLE_2)(cell)));
		updateState(getSelf(gameState)["A5"])(const(getApplicableArea(AREA_CIRCLE_3)(cell)));
		return [delay(compose(moveTowardCell)(function(x){
			//mark(x, COLOR_YELLOW);
			//debug("M -> " + x);
			return x;
		}))(cell)];
	}))(moveList["moves"]);
}

function getAction(@gameState) {
	var itemList =@ getActionListFromState(gameState);
	return aMap(delay(function(@item) {
		var target = getRandomTarget(gameState, item);
		if (target === null) { return void; }
		var ret = [];
		var cost = getItemCost(item);
		if (isWeapon(item) && item !== gameState["equipped"]) {
			cost += 1;
			push(ret, delay(setWeapon)(item));
			gameState["equipped"] = item;
		}
		updateState(getSelf(gameState)["TP"])(subTo(cost));
		aIter(ITEMS_EFFECT[item](gameState, getSelf(gameState), target))(gameState["all"]);
		if (isChip(item) && getChipCooldown(item) !== 0) { removeElement(gameState["chips"], item); }
		push(ret, delay(compose(useItemOnCell(item))(function(x){
				//mark(x, BEST_COLOR);
				//debug(getItemName(item) + " -> " + target);
				return x;
		}))(target));
		return ret;
	}))(itemList);
}

function getActions(@gameState) {
	var clonedState = gameState;
	var actions = [];
	for(var i = 0; i < 15; i++) {
		var list = getMove(clonedState) + getAction(clonedState);
		if (list === []) { break; }
		actions += list[randInt(0, count(list))]();
	}
	return ["actions": actions, "state": clonedState];
}

function sumState(@all, @ls, @stat) {
	return arrayFoldLeft(ls, function(@tlife, @leek) {
			return tlife + all[leek][stat];
	}, 0);
}

function applyEffects(@wearer) {
	aIter(applyEffect(wearer))(wearer['EFFS']);
	return wearer;
}

function evaluateState(o) {
	var os =@ o["all"];
	aIter(compose(removeDead(os))(applyEffects))(os);
	var oeLifes = sumState(os, o["enemies"], "HP");
	var oeAlives = count(o['enemies']);
	var oaLifes = sumState(os, o["allies"], "HP");
	var oaAlives = count(o['allies']);
	var oASH = sumState(os, o['allies'], 'ASH');
	var oRSH = sumState(os, o['allies'], 'RSH');
	var oSTR = sumState(os, o['allies'], 'STR');
	var oeTTP = sumState(os, o["enemies"], "TTP");
	var oeTMP = sumState(os, o["enemies"], "TMP");
	var oaTTP = sumState(os, o["allies"], "TTP");
	var oaTMP = sumState(os, o["allies"], "TMP");
	var oneOr = defaultDiv(1);
	var thousandOr = defaultDiv(1000);
	return memo1(function(@x) {
		var xs =@ x["all"];
		aIter(applyEffects)(xs);
		var xeLifes = sumState(xs, x["enemies"], "HP");
		var xeAlives = count(x['enemies']);
		var xaLifes = sumState(xs, x["allies"], "HP");
		var xaAlives = count(x['allies']);
		var xeTTP = sumState(xs, x["enemies"], "TTP");
		var xeTMP = sumState(xs, x["enemies"], "TMP");
		var xaTTP = sumState(xs, x["allies"], "TTP");
		var xaTMP = sumState(xs, x["allies"], "TMP");
		var xASH = sumState(xs, x['allies'], 'ASH');
		var xRSH = sumState(xs, x['allies'], 'RSH');
		var xSTR = sumState(xs, x['allies'], 'STR');
		var getDist = function(@e) {
			return getPathLength(xs[GLOBAL_LEEK_ID]["POS"], xs[e]["POS"]);
			};
		var xDist = arrayMin(aMap(getDist)(x["enemies"]));
		xDist =@ max(1, (10000 + max(0, xDist - 7 - getSelf(x)['TMP'])) / 10000);
		return xDist
			 * (xeLifes / oeLifes)
			 * (xeAlives / oeAlives)
			 * thousandOr(oaLifes)(xaLifes)
			 * thousandOr(oaAlives)(xaAlives)
			 * oneOr(oASH)(xASH)
			 * oneOr(oRSH)(xRSH)
			 * (oSTR / xSTR)
			 * (xeTTP / oeTTP)
			 * (xeTMP / oeTMP)
			 * (oaTTP / xaTTP)
			 * (oaTMP / xaTMP);
	});
}

function main() {

	if (getWeapon() === null) {
		setWeapon(arraySort(getWeapons(), function(@x, @y) {
			var xr = getWeaponMaxRange(x);
			var yr = getWeaponMaxRange(y);
			return xr > yr ? -1 : xr === yr ? 0 : 1;
		})[0]);
	}
	initObstacles(aMap(getCell)(getAliveAllies() + getAliveEnemies()));
	var gameState = getGameState();

	var enemies = aFilter(negate(isSummon))(getAliveEnemies());
	var moves = getlAccessibleCells(getMP())(getCell());
	var simpleMoves = getKeys(moves);
	var safeAccessibleCells =@ lgetSomewhatSafeCells(getDangerousItems)(simpleMoves)(enemies);
	var checkSafeCell = bmemo(curry2(inArray)(safeAccessibleCells));

	debug(getOperations() + 'op');

	var evaluate = evaluateState(gameState);
	var population = pqEmpty();
	var popInsert = pqInsert(population);
	var popSelect = pqPop(population);
	var existing = [];

	var safeMod = 1 - 0.15 * (32 - getTurn()) / 64;

	while (getOperations() < 19000000) {
		var actions =@ getActions(gameState);
		var value = evaluate(actions["state"]);
		if (checkSafeCell(actions['state']['all'][GLOBAL_LEEK_ID]['POS'])) {
			value *= safeMod;
		}
	//	if (existing["" + actions["state"]])	{ continue; }
	//	else						{ existing["" + actions["state"]] = true; }
		totalPop++;
		popInsert(value, actions["actions"]);
	}
	aIter(yield)(popSelect());
}
debug(getOperations() + 'op');
debug("totalPop: " + totalPop);
