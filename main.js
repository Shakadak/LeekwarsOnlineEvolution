include("functional.js");
include("bool.js");
include("list.js");
include("map");
include("item");
include("target");
include("math.js");
include("chips");
include("game-state.js");
include("pq.js");
include('Funno');
include('danger');

global totalPop;
totalPop =@ 0;

global ACTIONS_QUEUE = [];

main();

function getRandomTarget(@state, @item) {
	//debugC(state, COLOR_BLUE);
	var area = getItemArea(item);
	var validCells = [];
	var getTargets =@ ITEMS_TARGETS[item];
	if (typeOf(getTargets) === TYPE_FUNCTION) {
		validCells =@ getTargets(state);
	}
	else {
		var states =@ state[S_ALL];
		var validTargets =@ (isWeapon(item) || cAttaques[item] || cDebuffs[item] || cPoisons[item]	? state[S_ENEMIES]
							: state[S_ALLIES]);
		validCells =@ aConcatMap(function(@x){return isSummon(x) && getName(x) == 'puny_bulb' ? [] : states[x][area];})(validTargets);
	}
	shuffle(validCells);
	var target;
	do {
		target = shift(validCells);
	} while (  target !== null
				&& !canTargetCell(item)(getSelf(state)[POS])(target));
	return target;
}

function getMove(@gameState) {
	if (getSelf(gameState)[MP] === 0) { return []; }
	var moveList =@ getMovementListFromState(gameState);
	return aMap(delay(function(@cell) {
		var moved = moveList["mcosts"][cell];
		updateState(getSelf(gameState)[MP])(subTo(moved));
		updateState(getSelf(gameState)[POS])(const(cell));
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
		var self =@ getSelf(gameState);
		//opsin();
		var target = getRandomTarget(gameState, item);
		//opsout('var target = getRandomTarget(gameState, item);', 0);
		if (target === null) { return []; }
		var ret = [];
		var cost = getItemCost(item);
		if (isWeapon(item) && item !== self[EQ]) {
			cost += 1;
			push(ret, delay(setWeapon)(item));
			removeElement(self[UNEQ], item);
			push(self[UNEQ], self[EQ]);
			self[EQ] = item;
		}
		updateState(self[TP])(subTo(cost));
		//opsin();
		aIter(ITEMS_EFFECT[item](gameState, self, target))(gameState[S_ALL]);
		//opsout('aIter(ITEMS_EFFECT[item](gameState, getSelf(gameState), target))(gameState[S_ALL]);', 0);
		if (isChip(item)) {
			self[CHIPS][item] = getChipCooldown(item);
		}
		if (cBulbes[item]) {
			push(ret, function() {
					summon(item, target, function() {
							aIter(yield)(shift(ACTIONS_QUEUE));
						});
				});
		}
		else {
			push(ret, delay(compose(useItemOnCell(item))(function(x){
					mark(x, BEST_COLOR);
					//debug(getItemName(item) + " -> " + target);
					return x;
				}))(target));
		}
		return ret;
	}))(itemList);
}

function getActions(@gameState) {
	//opsin();
	var clonedState = gameState;
	//opsout('var clonedState = gameState;', BEST_COLOR);
	var actions_queue = [];
	do {
		var actions =@ (actions_queue[count(actions_queue)] = []);
		for(var i = 0; i < 15; i++) {
			var list =@ getMove(clonedState);
			list += getAction(clonedState);
			if (list === []) { break; }
			var actionGenerator =@ list[randInt(0, count(list) + 1)];
			if (actionGenerator === null) { break; }
			//opsin();
			actions += actionGenerator();
			//opsout('actions += list[randInt(0, count(list))]();', COLOR_RED);
		}
		clonedState[S_SELF] = clonedState[S_ORDER][getSelf(clonedState)[ORDER]];
	} while (getSelf(clonedState)[SUMMON]);
	return ["actions": actions_queue, "state": clonedState];
}

function sumState(@all, @ls, @stat) {
	return arrayFoldLeft(ls, function(@tlife, @leek) {
			return tlife + all[leek][stat];
	}, 0);
}

function getStats(@all, @ls) {
	var zeroDiv = defaultDiv(0);
return function(@sHP, @sTTP, @sTMP, @sASH, @sRSH, @sSTR, @sAGI, @sminHPR) {
	return arrayFoldLeft(ls, function(@_, @leek) {
		var lstat =@ all[leek];
		var lHP =@ lstat[HP];
		var lTHP =@ lstat[THP];
		var hpr = lHP / lTHP;
		sHP += lHP;
		sTTP += all[leek][TTP];
		sTMP += all[leek][TMP];
		sASH += all[leek][ASH];
		sRSH += all[leek][RSH];
		sSTR += all[leek][STR];
		hpr < sminHPR ? sminHPR =@ hpr : null;
	}, null);
};}

function applyEffects(@wearer) {
	aIter(applyEffect(wearer))(wearer[EFFS]);
	return wearer;
}

function evaluateState(o) {
	var oID = getSelf(o)[ID];
	var os =@ o[S_ALL];
	aIter(compose(removeDead(o))(applyEffects))(os);
	var oeAlives = count(o[S_ENEMIES]);
	var oaAlives = count(o[S_ALLIES]);

	var oeLifes = sumState(os, o[S_ENEMIES], HP);
	var oeTTP = sumState(os, o[S_ENEMIES], TTP);
	var oeTMP = sumState(os, o[S_ENEMIES], TMP);
	var oeMinLife;

	var oaLifes = sumState(os, o[S_ALLIES], HP);
	var oaTTP = sumState(os, o[S_ALLIES], TTP);
	var oaTMP = sumState(os, o[S_ALLIES], TMP);
	var oaASH = sumState(os, o[S_ALLIES], ASH);
	var oaRSH = sumState(os, o[S_ALLIES], RSH);
	var oaSTR = sumState(os, o[S_ALLIES], STR);
	var oaAGI = sumState(os, o[S_ALLIES], AGI);
	var oneOr = defaultDiv(1);
	var thousandOr = defaultDiv(1000);
	var infDiv = defaultDiv(-log(0));
	var ninfDiv = defaultDiv(log(0));
	return /*memo1*/(function(@state) {
		var xs =@ state[S_ALL];
		var dmgOnSelf = averageDmgFromLeeksOnCell(access(ENEMY))(xs[oID][POS])(xs);
		xs[oID][HP] -= dmgOnSelf;
		//debugC(dmgOnSelf, COLOR_RED);

		aIter(compose(removeDead(state))(applyEffects))(xs);

		var enemies =@ state[S_ENEMIES];
		var allies =@ state[S_ALLIES];
		var xeAlives = count(enemies);
		var xaAlives = count(allies);
		/*
		var xeLifes = sumState(xs, x[S_ENEMIES], HP);
		var xeTTP = sumState(xs, x[S_ENEMIES], TTP);
		var xeTMP = sumState(xs, x[S_ENEMIES], TMP);
		*/


		var xeLifes = 0;
		var xeTTP = 0;
		var xeTMP = 0;
		var xeminHPR = xeAlives < 1 ? 0 : -log(0);
		getStats(xs, enemies)(xeLifes, xeTTP, xeTMP, 0, 0, 0, 0, xeminHPR);
		xeminHPR /= 13;
		xeminHPR += 12 / 13;
		//debug('getStats + xeminHPR');

		/*
		var xaLifes = sumState(xs, x[S_ALLIES], HP);
		var xaTTP = sumState(xs, x[S_ALLIES], TTP);
		var xaTMP = sumState(xs, x[S_ALLIES], TMP);
		var xaASH = sumState(xs, x[S_ALLIES], ASH);
		var xaRSH = sumState(xs, x[S_ALLIES], RSH);
		var xaSTR = sumState(xs, x[S_ALLIES], STR);
		var xaAGI = sumState(xs, x[S_ALLIES], AGI);
		*/


		var xaLifes = 0;
		var xaTTP = 0;
		var xaTMP = 0;
		var xaASH = 0;
		var xaRSH = 0;
		var xaSTR = 0;
		var xaAGI = 0;
		var xaminHPR = xaAlives < 1 ? 0 : -log(0);
		getStats(xs, allies)
			(xaLifes, xaTTP, xaTMP, xaASH, xaRSH, xaSTR, xaAGI, xaminHPR);
		xaminHPR = 1 - xaminHPR;
		xaminHPR /= 13;
		xaminHPR += 12 / 13;
		var xSelfHPR = xs[oID] === null ? -log(0) : infDiv(1)(xs[oID][HP] / xs[oID][THP]);

		var xeDist = 1;
		var xaDist = 1;
		var spos = xs[oID][POS];
		if (spos !== null) {
			var getDist =@ function(@e) {
				return getPathLength(spos, xs[e][POS]);
				};
			xeDist =@ arrayMin(aMap(getDist)(enemies));
			xeDist =@ max(1, (1000 + max(0, xeDist - 7 - getSelf(state)[TMP])) / 1000);
			if (xaAlives > 1) {
				xaDist =@ sum(aMap(getDist)(allies)) / xaAlives;
				xaDist =@ max(1, (100 + max(0, xaDist - getSelf(state)[TMP])) / 100);
			}
		}

		return xeDist
			 * xaDist
			 * ninfDiv(xeLifes)(oeLifes)
			 * ninfDiv(xeAlives)(oeAlives)
			 * xeminHPR
			 * infDiv(oaLifes)(xaLifes)
			 * infDiv(oaAlives)(xaAlives)
			 * xaminHPR
			 * xSelfHPR
			 * oneOr(oaASH)(xaASH)
			 * oneOr(oaRSH)(xaRSH)
			 * oneOr(oaSTR)(xaSTR)
			 * oneOr(oaAGI)(xaAGI)
			 * oneOr(xeTTP)(oeTTP)
			 * oneOr(xeTMP)(oeTMP)
			 * infDiv(oaTTP)(xaTTP)
			 * infDiv(oaTMP)(xaTMP);
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
	//opsin();
	var gameState = getGameState();
	//opsout('var gameState = getGameState();', BEST_COLOR);

	/*var enemies = aFilter(negate(isSummon))(getAliveEnemies());
	var moves = getlAccessibleCells(getMP())(getCell());
	var simpleMoves = getKeys(moves);
	mark(simpleMoves, COLOR_RED);
	var safeAccessibleCells =@ getSomewhatSafeCells(getDangerousItems)(simpleMoves)(enemies);
	var checkSafeCell = bmemo(curry2(inArray)(safeAccessibleCells));
	mark(safeAccessibleCells, COLOR_GREEN);*/

	debug(getOperations() + 'op');

	var evaluate = evaluateState(gameState);
	var population = pqEmpty();
	var popInsert = pqInsert(population);
	var popSelect = pqPop(population);
	var existing = [];

	var safeMod = 1 - 0.25 * (32 - getTurn()) / 64;

	while (getOperations() < 19500000) {
		//opsin();
		var actions =@ getActions(gameState);
		//opsout('var actions =@ getActions(gameState);', COLOR_BLUE);
		//debug('');
		var value = evaluate(actions["state"]);
		/*if (checkSafeCell(getSelf(actions['state'])[POS])) {
			value *= safeMod;
		}*/
	//	if (existing["" + actions["state"]])	{ continue; }
	//	else						{ existing["" + actions["state"]] = true; }
		totalPop++;
		popInsert(value, actions);
	}

	var value;
	var elected = population[0](value);
	debug('value = ' + value);
	//aIter(function(@x) { debugC(x[EFFS], COLOR_BLUE); })(gameState[S_ALL]);
	//debug('');
	//aIter(function(@x) { debugC(x[EFFS], COLOR_BLUE); })(elected["state"][S_ALL]);
	debugC('action count: ' + count(elected['actions'][0]), BEST_COLOR);
	ACTIONS_QUEUE =@ elected['actions'];
	debug(getOperations() + 'op');
	aIter(yield)(shift(ACTIONS_QUEUE));
	sayShit();
}
debug(getOperations() + 'op');
debug("totalPop: " + totalPop);
