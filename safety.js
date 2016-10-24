include("map");
include("astar");

function getSafeCellNearestToEnemy(safeArea, eCell) {
	var tmp =@ arrayFoldLeft(safeArea, function(@acc, @x) { acc["" + x] = true; return acc; }, []);
	var goal = function(@y){return tmp["" + y];};
	var cost = function(@_, @__) {return 1;};
	//var path = aStar(getANeighbors)(cost)(const(0))(curry2(inArray)(safeArea))(eCell);
	var path = laStar(compose(lFilter(isNotObstacle))(getLVNeighbors))(cost)(const(0))(goal)(eCell);
	mark(path, BEST_COLOR);
	return path !== null ? path[count(path) - 1] : null;
}
