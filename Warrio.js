include("functional.js");
include("array.js");
include("map");

/**
* checkDirectlyUsable : ItemID -> Trigger Cell -> Target Cell -> Bool
*/
function checkDirectlyUsable(weapon) { return function(target) { return function(trigger){
	var effArea = isChip(weapon) ? getChipEffectiveArea : getWeaponEffectiveArea;
	return lineOfSight(trigger, target) && isNonEmpty(effArea(weapon, target, trigger));
};};}

//       dumpWeapon : WeaponID -> (() -> LeekID) -> TP -> TP
function dumpWeapon(weapon, leek, tp) {
  var cost = getWeaponCost(weapon);
  while (tp >= cost and canUseWeapon(leek(getCell()))) {
    if (useWeapon(leek(getCell())) === USE_SUCCESS) { tp -= cost; }
    else { break ; }}
	return tp; }

//       maxCurrentWRange : LeekID -> Range
function maxCurrentWRange(leek) {
  return getWeaponMaxRange(getWeapon(leek)); }

// --  equipWeapon : WeaponID -> TP -> TP
global equipWeapon = curry2(function(weapon, tp){
  if (getWeapon() !== weapon) {
    setWeapon(weapon); tp -= 1;} // Warning: costs 1 TP
  return tp;
});
