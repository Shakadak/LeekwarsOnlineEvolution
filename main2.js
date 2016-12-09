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
include('struct.js');

global opin_move = 0, opout_move = 0;
global opin_attack = 0, opout_attack = 0;
global opin_select = 0, opout_select = 0;

global totalPop;
totalPop =@ 0;

global ACTIONS_QUEUE = [];

global ACTION = 0, STATE = 1, GENERATOR = 2;

main();

function act(@x) { var a; x(a, 0, 0); aIter(yield)(a); }

function getTargets(@state, @item) {
	var area = getItemArea(item);
	var validCells = [];
	var _getTargets =@ ITEMS_TARGETS[item];
	if (typeOf(_getTargets) === TYPE_FUNCTION) {
		validCells =@ _getTargets(state);
	}
	else {
		debugE("getTargets not implemented for " + getItemName(item));
	}
	return validCells;
}

function getMove(@gameState) {
	if (getSelf(gameState)[MP] === 0) { return []; }
	return [function() {
		var costs, moves;
		getMovementListFromState(gameState, moves, costs);
		return daMap(function(cell) { return function() {
			var moved = costs[cell];
			var self =@ getSelf(gameState);
			__obstacles[self[POS]] = false;
			__obstacles[cell] = true;
			self[MP] -= moved;
			self[POS] = cell;
			self[AREA_POINT] = getApplicableArea(AREA_POINT)(cell);
			self[AREA_CIRCLE_1] = getApplicableArea(AREA_CIRCLE_1)(cell);
			self[AREA_CIRCLE_2] = getApplicableArea(AREA_CIRCLE_2)(cell);
			self[AREA_CIRCLE_3] = getApplicableArea(AREA_CIRCLE_3)(cell);
			return [delay(compose(moveTowardCell)(function(x) {
				//mark(x, COLOR_YELLOW);
				debug("M -> " + x);
				return x;
			}))(cell)];
		};})(moves);
	}];
}

function getAction(@gameState) {
	var itemList =@ getActionListFromState(gameState);
	var self =@ getSelf(gameState);
	var pos = self[POS];
	return aMap(delay(function(@item) {
		var targets =@ getTargets(gameState, item);
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
				aIter(ITEMS_EFFECT[item](gameState, self, target))(gameState[S_ALL]);
				if (isChip(item)) {
					self[CHIPS][item] = getChipCooldown(item);
				}
				if (cBulbes[item]) {
					push(ret, function() {
							summon(item, target, function() {
									aIter(act)(shift(ACTIONS_QUEUE));
								});
						});
				}
				else {
					push(ret, delay(compose(useItemOnCell(item))(function(x){
							//mark(x, BEST_COLOR);
							debug(getItemName(item) + " -> " + target);
							return x;
						}))(target));
				}
				return ret;
			};
		})(targets);
	}))(itemList);
}

function mutateActions(@actions, @baseState) {
	var a = min(0, count(actions) - 1);
	var k = randInt(0, count(actions[a]));

	var actions_queue = [];
	var clonedState;
	var first = false;

	if (k <= 0 && a <= 0) { // Starting from scratch.
		clonedState =@ baseState;
	}
	else {
		first = true;
		actions_queue =@ uaTake(a, actions);

		if (k > 0) { // Avoid empty sequence.
			actions_queue += [uaTake(k, actions[a])];
		}
		else {
			a -= 1; // Since the sequence was empty, we have to go back to the previous entity sequence.
		}
		clonedState =@ getLastState(actions_queue);
		__obstacles =@ getLastObstacles(actions_queue);
	}
	if (getSelf(clonedState) === null) { return []; } // We died, no point continuing.

	while (true) {
		var mutated_actions;
		if (first) {
			mutated_actions =@ (actions_queue[a]);
			first = false;
		}
		else {
			mutated_actions =@ (actions_queue[a] = []);
		}

		var finished = true;
		do {
			finished = false;

			var action;
			var gameTuple = uctuple3([], clonedState, __obstacles);
			gameTuple(action, clonedState, __obstacles);

			opin_move += getOperations();
			var list =@ getMove(clonedState);
			list += list; // I want more chances to move.
			opout_move += getOperations();
			opin_attack += getOperations();
			list += getAction(clonedState);
			opout_attack += getOperations();

			var curratedList =@ list;
			opin_select += getOperations();
			do {
				var i = randInt(0, count(curratedList) + 1);
				var actionGenerator =@ curratedList[i];
				if (actionGenerator === null) {
					push(action, sayShit);
					push(mutated_actions, gameTuple);
					finished =@ true;
					break;
				}
				var actionsGenerated =@ actionGenerator();
				if (actionsGenerated !== []) {
					var j = randInt(0, count(actionsGenerated));
					action += actionsGenerated[j]();
					push(mutated_actions, gameTuple);
					break ;
				}
			} while (true);
			opout_select += getOperations();
		} while (!finished);

		var selfID = clonedState[S_ORDER][getSelf(clonedState)[ORDER]];

		if (!(clonedState[S_ALL][selfID][SUMMON])) { break; }
		clonedState = clonedState;
		clonedState[S_SELF] = selfID;

		a++;
	}

	return aFilter(isNonEmpty)(actions_queue);
}

function getLastAction(@gs) {
	return getGameAction(getLastGameTuple(gs));
}

function getGameAction(@g) {
	var a;
	g(a, 0, 0);
	return a;
}

function getLastState(@gs) {
	return getGameState(getLastGameTuple(gs));
}

function getGameState(@g) {
	var s;
	g(0, s, 0);
	return s;
}

function getLastObstacles(@gs) {
	return getGameObstacles(getLastGameTuple(gs));
}

function getGameObstacles(@g) {
	var o;
	g(0, 0, o);
	return o;
}

function getLastGameTuple(@gss) {
	var gs =@ gss[count(gss) - 1];
	return gs[count(gs) - 1];
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
		if (xs[oID] === null) { return -log(0); } // We died :(
		var dmgOnSelf = averageDmgFromLeeksOnCell(access(ENEMY))(xs[oID][POS])(xs);
		xs[oID][HP] -= dmgOnSelf;
		removeDead(state)(xs[oID]);

		aIter(compose(removeDead(state))(applyEffects))(xs);

		var enemies =@ state[S_ENEMIES];
		var allies =@ state[S_ALLIES];
		var xeAlives = count(enemies);
		var xaAlives = count(allies);

		var xeLifes = 0;
		var xeTTP = 0;
		var xeTMP = 0;
		var xeminHPR = xeAlives < 1 ? 0 : -log(0);
		getStats(xs, enemies)(xeLifes, xeTTP, xeTMP, 0, 0, 0, 0, xeminHPR);
		xeminHPR /= 13;
		xeminHPR += 12 / 13;

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
		var xSelfHPR = xs[oID] === null ? -log(0) : xs[oID][THP] / min(xs[oID][THP], 0.90 * xs[oID][HP] + (-00));

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
	var baseObstacles = __obstacles;
	var gameState = generateGameState();

	debug(getOperations() + 'op');

	var evaluate = evaluateState(gameState);
	var population = pqEmpty();
	var popInsert = pqInsert(population);
	var popSelect = pqPop(population);

	opin_move = 0;
	opout_move = 0;
	opin_attack = 0;
	opout_attack = 0;
	opin_select = 0;
	opout_select = 0;
	var opin_evaluate = 0, opout_evaluate = 0;
	var opin_prio = 0, opout_prio = 0;

	var maxOp = 18500000;
	while (getOperations() < maxOp && count(population) < 30) {
		__obstacles = baseObstacles;
		var actions =@ mutateActions([[]], gameState);
		if (actions === []) { continue; }
		opin_evaluate += getOperations();
		var value = evaluate(getLastState(actions));
		opout_evaluate += getOperations();
		totalPop++;
		opin_prio += getOperations();
		popInsert(value, actions);
		opout_prio += getOperations();
	}

	while (getOperations() < maxOp) {
		population =@ pqTake(population)(10);
		var i = 0;
		if (getFightContext() === FIGHT_CONTEXT_BATTLE_ROYALE) {
		var ancestors = [];
		ancestors += population;
		while (getOperations() < maxOp && i < 10) {
			__obstacles = baseObstacles;
			var actions =@ mutateActions(ancestors[i](null), gameState);
			i++;
			if (actions === []) { continue; }
			opin_evaluate += getOperations();
			var value = evaluate(getLastState(actions));
			opout_evaluate += getOperations();
			totalPop++;
			opin_prio += getOperations();
			popInsert(value, actions);
			opout_prio += getOperations();
		}
		}
		while (getOperations() < maxOp && count(population) < 30) {
			__obstacles = baseObstacles;
			var actions =@ mutateActions([[]], gameState);
			if (actions === []) { continue; }
			opin_evaluate += getOperations();
			var value = evaluate(getLastState(actions));
			opout_evaluate += getOperations();
			totalPop++;
			opin_prio += getOperations();
			popInsert(value, actions);
			opout_prio += getOperations();
		}
	}
		debugC((opout_move - opin_move) * 100 / OPERATIONS_LIMIT, COLOR_GREEN);
		debugC((opout_attack - opin_attack) * 100 / OPERATIONS_LIMIT, COLOR_RED);
		debugC((opout_select - opin_select) * 100 / OPERATIONS_LIMIT, COLOR_BLUE);
		debugC((opout_select - opin_move) * 100 / OPERATIONS_LIMIT, 0);
		debugC((opout_evaluate - opin_evaluate) * 100 / OPERATIONS_LIMIT, BEST_COLOR);
		debugC((opout_prio - opin_prio) * 100 / OPERATIONS_LIMIT, 0);
		debug("totalPop: " + totalPop);
		debug('');

	var value;
	var elected =@ population[0](value);
	debug('value = ' + value);
	debugC('action count: ' + count(elected[0]), BEST_COLOR);
	//debugC(elected, COLOR_BLUE);
	ACTIONS_QUEUE =@ elected;
	aIter(act)(shift(ACTIONS_QUEUE));
	//sayShit();
}

debug(getOperations() + 'op');
