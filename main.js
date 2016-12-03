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

function getTargets(@state, @item) {
	var area = getItemArea(item);
	var validCells = [];
	var _getTargets =@ ITEMS_TARGETS[item];
	if (typeOf(_getTargets) === TYPE_FUNCTION) {
		validCells =@ _getTargets(state);
	}
	else {
		var states =@ state[S_ALL];
		var validTargets =@ (isWeapon(item) || cAttaques[item] || cDebuffs[item] || cPoisons[item]	? state[S_ENEMIES] : state[S_ALLIES]);
		validCells =@ aConcatMap(function(@x){return (states[x][SUMMON] && states[x][NAME] == 'puny_bulb') ? [] : states[x][area];})(validTargets);
	}
	return validCells;
}

function getMove(@gameState) {
	if (getSelf(gameState)[MP] === 0) { return []; }
	var moveList =@ getMovementListFromState(gameState);
	return delay(aMap(delay(function(@cell) {
		var moved = moveList["mcosts"][cell];
		getSelf(gameState)[MP] -= moved;
		getSelf(gameState)[POS] = cell;
		getSelf(gameState)[AREA_POINT] = getApplicableArea(AREA_POINT)(cell);
		getSelf(gameState)[AREA_CIRCLE_1] = getApplicableArea(AREA_CIRCLE_1)(cell);
		getSelf(gameState)[AREA_CIRCLE_2] = getApplicableArea(AREA_CIRCLE_2)(cell);
		getSelf(gameState)[AREA_CIRCLE_3] = getApplicableArea(AREA_CIRCLE_3)(cell);
		return [delay(compose(moveTowardCell)(function(x) {
			mark(x, COLOR_YELLOW);
			debug("M -> " + x);
			return x;
		}))(cell)];
	})))(moveList["moves"]);
}

function getAction(@gameState) {
	var itemList =@ getActionListFromState(gameState);
	var self =@ getSelf(gameState);
	var pos = self[POS];
	return aMap(delay(function(@item) {
		//opsin();
		var targets =@ getTargets(gameState, item);
		//opsout('var target = getRandomTarget(gameState, item);', 0);
		return daMap(function(target) {
			return function() {
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
							debug(getItemName(item) + " -> " + target);
							return x;
						}))(target));
				}
				return ret;
			};
		})(targets);
	}))(itemList);
}

function getActions(@gameState) {
	//opsin();
	//opsout('var clonedState = gameState;', BEST_COLOR);
	//var opin0 = getOperations();
	var ret = ["actions": [], "state": gameState];
	var clonedState =@ ret["state"];
	var actions_queue =@ ret["actions"];
	//var opout0 = getOperations();
	//debugC((opout0 - opin0) * 100 / OPERATIONS_LIMIT, COLOR_GREEN);
	//var opin1 = getOperations();
	do {
		var actions =@ (actions_queue[count(actions_queue)] = []);
		//for(var i = 0; i < 15; i++) {
		while (true) {
			var breakout = false;
			var list =@ [getMove(clonedState)];
			list += list; // I want more chance to move.
			list += getAction(clonedState);
			if (list === []) { break; }
			var curratedList =@ aFilter(notEqual([]))(list);
			do {
				var actionGenerator =@ curratedList[randInt(0, count(curratedList) + 1)];
				if (actionGenerator === null) { breakout =@ true; break; }
				var actionsGenerated =@ actionGenerator();
				if (actionsGenerated !== []) {
					actions += actionsGenerated[randInt(0, count(actionsGenerated))]();
					break ;
				}
			} while (true);
			if (breakout) { break ; }
		}
		clonedState[S_SELF] = clonedState[S_ORDER][getSelf(clonedState)[ORDER]];
	} while (getSelf(clonedState)[SUMMON]);
	//var opout1 = getOperations();
	//debugC((opout1 - opin1) * 100 / OPERATIONS_LIMIT, COLOR_BLUE);
	return ret;
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
		var xSelfHPR = xs[oID] === null ? -log(0) : xs[oID][THP] / min(xs[oID][THP], 1 * xs[oID][HP]);

		var xeDist = 1;
		var xaDist = 1;
		var spos = xs[oID][POS];
		if (spos !== null) {
			var getDist =@ function(@e) {
				return getPathLength(spos, xs[e][POS]);
				};
			xeDist =@ arrayMin(aMap(getDist)(enemies));
			xeDist =@ max(1, (100 + max(0, xeDist - 7 - getSelf(state)[TMP])) / 100);
			if (xaAlives > 1) {
				xaDist =@ sum(aMap(getDist)(allies)) / xaAlives;
				xaDist =@ max(1, (100 + max(0, xaDist - getSelf(state)[TMP])) / 100);
			}
		}

		return (1 + xeDist)
			 * (1 + xaDist)
			 * (1 + ninfDiv(xeLifes)(oeLifes))
			 * (1 + ninfDiv(xeAlives)(oeAlives))
			 * (1 + xeminHPR)
			 * (1 + infDiv(oaLifes)(xaLifes))
			 * (1 + infDiv(oaAlives)(xaAlives))
			 * (1 + xaminHPR)
			 * (1 + xSelfHPR)
			 * (1 + oneOr(oaASH)(xaASH))
			 * (1 + oneOr(oaRSH)(xaRSH))
			 * (1 + oneOr(oaSTR)(xaSTR))
			 * (1 + oneOr(oaAGI)(xaAGI))
			 * (1 + oneOr(xeTTP)(oeTTP))
			 * (1 + oneOr(xeTMP)(oeTMP))
			 * (1 + infDiv(oaTTP)(xaTTP))
			 * (1 + infDiv(oaTMP)(xaTMP));
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
	//aIter(compose(mark)(access(AREA_CIRCLE_2)))(gameState[S_ALL]);
	//arrayIter(gameState, function(@k, @v) { debug(k + " : " + v); });

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

	//var safeMod = 1 - 0.25 * (32 - getTurn()) / 64;
	var maxOp = 18500000;
	while (getOperations() < maxOp) {
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
