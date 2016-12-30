include("array.js");
include("list.js");
include("functional.js");
include("bool.js");
include("neighbors");
include("Maggo");
include("Warrio");
include("memo.js");


global __corners = [0, 17, 595, 612];

global __emptyMap = function(){
	var map = [];
	for (var i = 0; i < 613; i++) {
		push(map, i);
	}
	return @map;
	}();

global __obstacles = [];

function initObstacles(leeksCells) {
	__obstacles =@ [];
	arrayFoldLeft(getCorners(), function(@_, @o){__obstacles[o] =@ true;}, null);
	arrayFoldLeft(getObstacles(), function(@_, @o){__obstacles[o] =@ true;}, null);
	arrayFoldLeft(leeksCells, function(@_, @o){__obstacles[o] =@ true;}, null);
	__obstacles[getCell()] =@ false;
}

global __leeksMap = [];

function initLeeksMap(@leeksCells) {
	fill(__leeksMap, true, 613);
	for (var lc in leeksCells) {
		__leeksMap[lc] =@ false;
	}
	__leeksMap[getCell()] =@ true;
}

// --- __edges : Array Cell
global __edges = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17
                 ,35,70,105,140,175,210,245,280,315,350,385,420,455,490,525,560,595
                 ,52,87,122,157,192,227,262,297,332,367,402,437,472,507,542,577,612
                 ,596,597,598,599,600,601,602,603,604,605,606,607,608,609,610,611];



/**
* isNotObstacle : Cell -> Bool
*/
function isNotObstacle(cell){ return !__obstacles[cell]; }

/**
* isWithoutLeek : Cell -> Bool
*/
function isWithoutLeek(cell){ return __leeksMap[cell]; }

// ---   getEdges : () -> Array Cell
//function getEdges(){ return @__edges; }

function getCorners(){ return @__corners;}

function getMap() { return @__emptyMap;}

// ---   getAliveEnemiesCells : () -> Array Cell
function getAliveEnemiesCells(){ return aMap(getCell)(getAliveEnemies()); }

// ---   getNearestEnemyLeek : Cell -> LeekID
function getNearestEnemyLeek(cell){
    var leek = -1;
    var dist = -1;
    for (var enemy in getAliveEnemies()) {
        if (!isSummon(enemy)) {
            var tmpdist = getCellDistance(cell, getCell(enemy));
            if (dist === -1 || tmpdist < dist) {
                leek = enemy;
                dist = tmpdist;
    }}}
    return leek;
}

// ---   getEffectiveMoves : (Cell -> Bool) -> Array Cell -> Array Cell
function getEffectiveMoves(weaponChecker) { return function(@moves) {
      return aFilter(weaponChecker)(moves);
};}

// ---   getXYFromCell : Cell -> (Int, Int) -> ()
function getXYFromCell(@cell) { return function (@_x, @_y) {
	_x = @getCellX(cell); _y = @getCellY(cell);
};}

/**
* checkLined : Cell -> Cell -> Bool
*/
function checkLined(@c1){ return function(@c2) {
	return getCellX(c1) == getCellX(c2) || getCellY(c1) == getCellY(c2);
};}

/**
* getLNeighbors : Cell -> List Cell
*/
function getLNeighbors(@cell) {
	var ret = null;
    var x = getCellX(cell);
    var y = getCellY(cell);
    var c1 = getCellFromXY(x + 1, y);
    var c2 = getCellFromXY(x - 1, y);
    var c3 = getCellFromXY(x, y + 1);
    var c4 = getCellFromXY(x, y - 1);
    if (c1 !== null && isNotObstacle(c1)) {ret = ulSafeTailCons(c1, ret);}
    if (c2 !== null && isNotObstacle(c2)) {ret = ulSafeTailCons(c2, ret);}
    if (c3 !== null && isNotObstacle(c3)) {ret = ulSafeTailCons(c3, ret);}
    if (c4 !== null && isNotObstacle(c4)) {ret = ulSafeTailCons(c4, ret);}
	return ret;
}

/**
* getANeighbors : Cell -> Array Cell
*/
function getANeighbors(@cell) {
	var ret = [];
    var x = getCellX(cell);
    var y = getCellY(cell);
    var c1 = getCellFromXY(x + 1, y);
    var c2 = getCellFromXY(x - 1, y);
    var c3 = getCellFromXY(x, y + 1);
    var c4 = getCellFromXY(x, y - 1);
    if (c1 !== null && isNotObstacle(c1)) { push(ret, c1); }
    if (c2 !== null && isNotObstacle(c2)) { push(ret, c2); }
    if (c3 !== null && isNotObstacle(c3)) { push(ret, c3); }
    if (c4 !== null && isNotObstacle(c4)) { push(ret, c4); }
	return ret;
}

/**
* getLVNeighbors : Cell -> List Cell
*/
function getLVNeighbors(@cell) { return allNeighbors[cell]; }

/**
* getlAccessibleCells : MP -> Cell -> Assoc Cell MP
*/
function getlAccessibleCells(mps) { return function(cell) {
    var tmp = [cell:0];
    var ns = lSingleton(cell);
    for (var mp = 1; mp <= mps; mp++) {
		var check =@ function(@n) {
			if (tmp[n] === null && isNotObstacle(n))	{ tmp[n] = mp; return true; } // -- YUKY!!!
			else										{ return false; }
		};
        ns =@ ulConcatFilterMap(getLVNeighbors, check, ns);
    }
    return @tmp;
};}

/**
* getSomewhatSafeCells : (LeekID -> Array ItemID) -> Array Cell -> Array LeekID -> Array Cell
*/
function getSomewhatSafeCells(@getDangerousItems) { return function(@cells) { return function(@leeks) {
	var enemyDangerCheckers = function(leek) {
		var eWeapons =@ getDangerousItems(leek);
		var simpleEMoves =@ getKeys(getlAccessibleCells(getTotalMP(leek))(getCell(leek)));
		var triggerMoves =@ aMap(flip(checkDirectlyUsable))(simpleEMoves);
		return aApply(triggerMoves)(eWeapons);
	};
	var checkers =@ aConcatMap(enemyDangerCheckers)(leeks);
	return aFoldR(compose(aFilter)(negate))(cells)(checkers);
};};}

/**
* getSomewhatSafeCells : (LeekID -> Array ItemID) -> Array Cell -> Array LeekID -> Array Cell
*/
function lgetSomewhatSafeCells(@getDangerousItems) { return function(@cells) { return function(@leeks) {
	var enemyDangerCheckers = function(leek) {
		var eWeapons =@ lFromArray(getDangerousItems(leek));
		var simpleEMoves =@ lFromKeys(getlAccessibleCells(getTotalMP(leek))(getCell(leek)));
		var triggerMoves =@ lMap(flip(checkDirectlyUsable))(simpleEMoves);
		return lApply(triggerMoves)(eWeapons);
	};
	var checkers =@ lConcatMap(enemyDangerCheckers)(lFromArray(leeks));
	var checkCell = compose(flip(lAny)(checkers))(apply);
	return lToArray(lFilter(negate(checkCell))(lFromArray(cells)));
};};}

global __myMoves = [];

function updateMyMoves(@xs) {__myMoves = xs;}

function myMoves() {return @__myMoves;}

function getCellFromXYPlus(x, y) { return function(@cx, @cy) {
    return getCellFromXY(cx + x, cy + y);
};}

function initAffectingArea(@n) {
    var ret = [];
	for(var x = -n; x <= n; x++) {
		for(var y = -n; y <= n; y++) {
			if(abs(x) + abs(y) <= n) {
			    push(ret, getCellFromXYPlus(x, y));
			}
		}
    }
    return ret;
}

global AFFECTING_AREA_1 =@ initAffectingArea(1);
global AFFECTING_AREA_2 =@ initAffectingArea(2);
global AFFECTING_AREA_3 =@ initAffectingArea(3);

function getAffectedCell(@x, @y) { return function(@ret, @f) {
    var c = f(x, y);
    if (c !== null) {
        push(ret, c);
    }
    return ret;
};}

function getAffectedArea(size, cell) {
    var x = getCellX(cell);
    var y = getCellY(cell);
	if(size == AREA_POINT) {
		return [cell];
	} else if(size == AREA_CIRCLE_1) {
		return arrayFoldLeft(AFFECTING_AREA_1, getAffectedCell(x, y), []);
	} else if(size == AREA_CIRCLE_2) {
		return getChipEffectiveArea(CHIP_MIRROR, cell, cell);
	} else if(size == AREA_CIRCLE_3) {
		return getChipEffectiveArea(CHIP_DEVIL_STRIKE, cell, cell);
	}
	return [];
}

global getApplicableArea = memou2(getAffectedArea);
