
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////

global cry = ["WHY DID IT HAVE TO LEEK?!", "YOLO!","CARPE DIEM!", "AAAAAAH!", "GIVE ME YOUR SOIL!!!", "WATCH MY BULB-FLEX!!!", "JE M'AIME!", "I NEED MORE FERTILIZER!!!", "...", "DOT! DOT! DOT!", "POINT! POINT! POINT!", "PLEASE DON'T COOK ME UP!", "WHAT THE GARDEN AM I DOING ???", "BOILED!", "FRIED!", "RAW!", "FROZEN!", "HOW MUCH DET-DEDOTATED HAY?", "ACHOO!", "I WANT TO LEEKITY LEEK YOU!!!", "AUGH!", "DON'T HARVEST ME! I STILL HAVEN'T GROWN MY PISTIL!", "LEEEK! THAT'S SOME FLESHY LEAVES YOU'VE GOT HERE!", "OH BULB! MIND SHARING HOW YOU GROWED THOSE STEMS?", "BELIEVE ME, I'M USUALLY A CALM PLANT!", "MY ROOTS ARE DRY!", "BREATHE OUT, BREATHE IN!", "DO YOU EVEN HILL?!", "POURQUOI LE POIREAU A-T-IL TRAVERSÉ LA ROUTE?", "MY ROOTS BEING LUSCIOUS DON'T MEAN I'M A HIPSTER.", "YOU'VE BEEN SQUASHED!", "WHO'S INVASIVE NOW?"];
global crySize = count(cry);

function sayShit(){say(cry[randInt(0, crySize)]);}

///////////////////////////////////////////////////////////////////////////


function ppair(@p, @v) {
	return function(@p_) { p_ =@ p; return v;};
}

function pqSingleton(@p, @v) {
	return [ppair(p, v)];
}

function pqEmpty() {
	return [];
}

function pqInsert(@xs) { return function(@p, @v) {
	push(xs, ppair(p, v));
	siftUp(xs)(count(xs) - 1);
};}

function pqPop(@xs) { return function() {
	if (count(xs) === 0) { return null; }
	var ret = shift(xs)(null);
	if (count(xs) > 0) {
		unshift(xs, pop(xs));
		siftDown(xs)(0);
	}
	return ret;
};}

function siftUp(@xs) {
	var sift = function(c) {
		if (c) {
			var p = (c - 1) >> 1;
			var cp, pp;
			xs[c](cp); xs[p](pp);
			if (cp < pp) {
				dswap(xs[c], xs[p]);
				sift(p);
			}
		}
	};
	return sift;
}

function siftDown(@xs) {
	var sift = function(p) {
		var s = count(xs);
		var c, cp;
		var l = (p << 1) + 1, r = l + 1;
		if (r >= s) {
			if (l >= s) {
				return ; }
			else {
				c =@ l;
				xs[c](cp); }}
		else {
			var lp, rp;
			xs[l](lp); xs[r](rp);
			if (lp <= rp) {
				c =@ l;
				cp =@ lp; }
			else {
				c =@ r;
				cp =@ rp; }}
		var pp;
		xs[p](pp);
		if (cp < pp) {
			dswap(xs[p], xs[c]);
			sift(c);
		}
	};
	return sift;
}

function pqTake(@xs) { return function(n) {
	var ret = [];
	while (n > 0 && count(xs) > 0) {
		push(ret, shift(xs));
		if (count(xs) > 0) {
			unshift(xs, pop(xs));
			siftDown(xs)(0);
		}
		n--;
	}
	return ret;
};}

/////////////////////////////////////////////////////////////////////////

/**
* uctuple3 : (a, b, c) -> Tuple a b c
*/
function uctuple3(_x, _y, _z) {
    return function(@x_, @y_, @z_) { x_ =@ _x; y_ =@ _y; z_ =@ _z; };
}

function dswap(@x, @y) {
	var z =@ x;
	x =@ y;
	y =@ z;
}
///////////////////////////////////////////////////////////////////////////
/**
* add : Summable a => a -> a -> a
*/
function add(@x) { return function(@y) { return x + y; };}

/**
* subTo : Num a => a -> a -> a
*/
function subTo(@x) { return function(@y) { return y - x; };}

/**
* defaultDiv : Num a => a -> a -> a -> a
*/
function defaultDiv(@default) { return function(@x) { return function(@y) {
	return y !== 0	? x / y
					: default;
};};}
///////////////////////////////////////////////////////////////////////////
/**
* not : Bool -> Bool
*/
function not(@p) { return !p; }

/**
* negate : (a -> Bool) -> a -> Bool
*/
function negate(@p) { return function(@a) {return !p(a); };}

/**
* equal : a -> a -> Bool
*/
function equal(@x) { return function(@y) { return x === y; };}

/**
* notEqual : a -> a -> Bool
*/
function notEqual(@x) { return function(@y) { return x !== y; };}

/**
* comparing : (a -> b) -> (b -> b -> c) -> a -> a -> c
*/
function comparing(@f) { return function(@p) { return function(@x) { return function(@y) {
	return p(f(x))(f(y));
};};};}

/**
* comparingu : (a -> b) -> ((b, b) -> c) -> (a, a) -> c
*/
function comparingu(@f) { return function(@p) { return function(@x, @y) {
	return p(f(x), f(y));
};};}

/**
* superior : a -> a -> Bool
*/
function superior(@x) { return function(@y) { return x >= y; };}

/**
* stricltySuperior : a -> a -> Bool
*/
function strictlySuperior(@x) { return function(@y) { return x > y; };}

/**
* inferior : a -> a -> Bool
*/
function inferior(@x) { return function(@y) { return x <= y; };}

/**
* stricltyInferior : a -> a -> Bool
*/
function strictlyInferior(@x) { return function(@y) { return x < y; };}

///////////////////////////////////////////////////////////////////////////
/**
* checkDirectlyUsable : ItemID -> Trigger Cell -> Target Cell -> Bool
*/
function checkDirectlyUsable(weapon) { return function(target) { return function(trigger){
	var effArea = isChip(weapon) ? getChipEffectiveArea : getWeaponEffectiveArea;
	return lineOfSight(trigger, target) && isNonEmpty(effArea(weapon, target, trigger));
};};}
///////////////////////////////////////////////////////////////////////////
/**
* compose : (b -> c) -> (a -> b) -> a -> c
*/
function compose(@f) { return function(@g) { return function(@a) {
  return f(g(a)); };};}

/**
* apply : a -> (a -> b) -> b
*/
function apply(@a) { return function(@f) { return f(a);};}

/**
* const : a -> b -> a
*/
function const(@a) { return function (@b) { return a; };}

/**
* flip : (a -> b -> c) -> b -> a -> c
*/
function flip(@f) { return function(@b) {return function(@a) {
  return f(a)(b);};};}

/**
* uncurry2 : (a -> b -> c) -> (a, b) -> c
*/
function uncurry2(@f){ return function(@a, @b) {
	return f(a)(b);
};}

/**
* curry2 : ((a, b) -> c) -> a -> b -> c
*/
function curry2(@f) { return function(@a) { return function(@b) {
  return f(a,b) ;};};}

/**
* curry3 : ((a, b, c) -> d) -> a -> b -> c -> d
*/
function curry3(@f) { return function(@a) { return function(@b) { return function(@c) {
  return f(a,b,c); };};};}

/**
* curry4 : ((a, b, c, d) -> e) -> a -> b -> c -> d -> e
*/
function curry4(@f) {
  return function(@a) {
  return function(@b) {
  return function(@c) {
  return function(@d) {
    return f(a,b,c,d);};};};};};

/**
* id : a -> a
*/
function id(@x){ return x; }

/**
* swap : (a, b) -> (b, a) -> ()
*/
function swap(@x, @y){ return function(@x_, @y_){x_ =@ y; y_ =@ x; };}

/**
* void : () -> ();
*/
function void(){}

/**
* delay0 : (() -> b) -> () -> () -> b
*/
function delay0(@f) {return function() { return function(){ return f(); };};}

/**
* delay : (a -> b) -> a -> () -> b
*/
function delay(@f) {return function(@a) { return function(){ return f(a); };};}

/**
* delay2 : ((a, b) -> d) -> (a, b) -> () -> d
*/
function delay2(@f) {return function(@a, @b) { return function(){ return f(a,b); };};}

/**
* delay3 : ((a, b, c) -> d) -> (a, b, c) -> () -> d
*/
function delay3(@f) {return function(@a, @b, @c) { return function(){ return f(a,b,c); };};}

function yield(@f) { return f(); }
///////////////////////////////////////////////////////////////////////////
global allNeighbors = [lSingleton(18), ulCons(19, lSingleton(18)), ulCons(20, lSingleton(19)), ulCons(21, lSingleton(20)), ulCons(22, lSingleton(21)), ulCons(23, lSingleton(22)), ulCons(24, lSingleton(23)), ulCons(25, lSingleton(24)), ulCons(26, lSingleton(25)), ulCons(27, lSingleton(26)), ulCons(28, lSingleton(27)), ulCons(29, lSingleton(28)), ulCons(30, lSingleton(29)), ulCons(31, lSingleton(30)), ulCons(32, lSingleton(31)), ulCons(33, lSingleton(32)), ulCons(34, lSingleton(33)), lSingleton(34), ulCons(36, ulCons(0, ulCons(35, lSingleton(1)))), ulCons(37, ulCons(1, ulCons(36, lSingleton(2)))), ulCons(38, ulCons(2, ulCons(37, lSingleton(3)))), ulCons(39, ulCons(3, ulCons(38, lSingleton(4)))), ulCons(40, ulCons(4, ulCons(39, lSingleton(5)))), ulCons(41, ulCons(5, ulCons(40, lSingleton(6)))), ulCons(42, ulCons(6, ulCons(41, lSingleton(7)))), ulCons(43, ulCons(7, ulCons(42, lSingleton(8)))), ulCons(44, ulCons(8, ulCons(43, lSingleton(9)))), ulCons(45, ulCons(9, ulCons(44, lSingleton(10)))), ulCons(46, ulCons(10, ulCons(45, lSingleton(11)))), ulCons(47, ulCons(11, ulCons(46, lSingleton(12)))), ulCons(48, ulCons(12, ulCons(47, lSingleton(13)))), ulCons(49, ulCons(13, ulCons(48, lSingleton(14)))), ulCons(50, ulCons(14, ulCons(49, lSingleton(15)))), ulCons(51, ulCons(15, ulCons(50, lSingleton(16)))), ulCons(52, ulCons(16, ulCons(51, lSingleton(17)))), ulCons(53, lSingleton(18)), ulCons(54, ulCons(18, ulCons(53, lSingleton(19)))), ulCons(55, ulCons(19, ulCons(54, lSingleton(20)))), ulCons(56, ulCons(20, ulCons(55, lSingleton(21)))), ulCons(57, ulCons(21, ulCons(56, lSingleton(22)))), ulCons(58, ulCons(22, ulCons(57, lSingleton(23)))), ulCons(59, ulCons(23, ulCons(58, lSingleton(24)))), ulCons(60, ulCons(24, ulCons(59, lSingleton(25)))), ulCons(61, ulCons(25, ulCons(60, lSingleton(26)))), ulCons(62, ulCons(26, ulCons(61, lSingleton(27)))), ulCons(63, ulCons(27, ulCons(62, lSingleton(28)))), ulCons(64, ulCons(28, ulCons(63, lSingleton(29)))), ulCons(65, ulCons(29, ulCons(64, lSingleton(30)))), ulCons(66, ulCons(30, ulCons(65, lSingleton(31)))), ulCons(67, ulCons(31, ulCons(66, lSingleton(32)))), ulCons(68, ulCons(32, ulCons(67, lSingleton(33)))), ulCons(69, ulCons(33, ulCons(68, lSingleton(34)))), ulCons(34, lSingleton(69)), ulCons(71, ulCons(35, ulCons(70, lSingleton(36)))), ulCons(72, ulCons(36, ulCons(71, lSingleton(37)))), ulCons(73, ulCons(37, ulCons(72, lSingleton(38)))), ulCons(74, ulCons(38, ulCons(73, lSingleton(39)))), ulCons(75, ulCons(39, ulCons(74, lSingleton(40)))), ulCons(76, ulCons(40, ulCons(75, lSingleton(41)))), ulCons(77, ulCons(41, ulCons(76, lSingleton(42)))), ulCons(78, ulCons(42, ulCons(77, lSingleton(43)))), ulCons(79, ulCons(43, ulCons(78, lSingleton(44)))), ulCons(80, ulCons(44, ulCons(79, lSingleton(45)))), ulCons(81, ulCons(45, ulCons(80, lSingleton(46)))), ulCons(82, ulCons(46, ulCons(81, lSingleton(47)))), ulCons(83, ulCons(47, ulCons(82, lSingleton(48)))), ulCons(84, ulCons(48, ulCons(83, lSingleton(49)))), ulCons(85, ulCons(49, ulCons(84, lSingleton(50)))), ulCons(86, ulCons(50, ulCons(85, lSingleton(51)))), ulCons(87, ulCons(51, ulCons(86, lSingleton(52)))), ulCons(88, lSingleton(53)), ulCons(89, ulCons(53, ulCons(88, lSingleton(54)))), ulCons(90, ulCons(54, ulCons(89, lSingleton(55)))), ulCons(91, ulCons(55, ulCons(90, lSingleton(56)))), ulCons(92, ulCons(56, ulCons(91, lSingleton(57)))), ulCons(93, ulCons(57, ulCons(92, lSingleton(58)))), ulCons(94, ulCons(58, ulCons(93, lSingleton(59)))), ulCons(95, ulCons(59, ulCons(94, lSingleton(60)))), ulCons(96, ulCons(60, ulCons(95, lSingleton(61)))), ulCons(97, ulCons(61, ulCons(96, lSingleton(62)))), ulCons(98, ulCons(62, ulCons(97, lSingleton(63)))), ulCons(99, ulCons(63, ulCons(98, lSingleton(64)))), ulCons(100, ulCons(64, ulCons(99, lSingleton(65)))), ulCons(101, ulCons(65, ulCons(100, lSingleton(66)))), ulCons(102, ulCons(66, ulCons(101, lSingleton(67)))), ulCons(103, ulCons(67, ulCons(102, lSingleton(68)))), ulCons(104, ulCons(68, ulCons(103, lSingleton(69)))), ulCons(69, lSingleton(104)), ulCons(106, ulCons(70, ulCons(105, lSingleton(71)))), ulCons(107, ulCons(71, ulCons(106, lSingleton(72)))), ulCons(108, ulCons(72, ulCons(107, lSingleton(73)))), ulCons(109, ulCons(73, ulCons(108, lSingleton(74)))), ulCons(110, ulCons(74, ulCons(109, lSingleton(75)))), ulCons(111, ulCons(75, ulCons(110, lSingleton(76)))), ulCons(112, ulCons(76, ulCons(111, lSingleton(77)))), ulCons(113, ulCons(77, ulCons(112, lSingleton(78)))), ulCons(114, ulCons(78, ulCons(113, lSingleton(79)))), ulCons(115, ulCons(79, ulCons(114, lSingleton(80)))), ulCons(116, ulCons(80, ulCons(115, lSingleton(81)))), ulCons(117, ulCons(81, ulCons(116, lSingleton(82)))), ulCons(118, ulCons(82, ulCons(117, lSingleton(83)))), ulCons(119, ulCons(83, ulCons(118, lSingleton(84)))), ulCons(120, ulCons(84, ulCons(119, lSingleton(85)))), ulCons(121, ulCons(85, ulCons(120, lSingleton(86)))), ulCons(122, ulCons(86, ulCons(121, lSingleton(87)))), ulCons(123, lSingleton(88)), ulCons(124, ulCons(88, ulCons(123, lSingleton(89)))), ulCons(125, ulCons(89, ulCons(124, lSingleton(90)))), ulCons(126, ulCons(90, ulCons(125, lSingleton(91)))), ulCons(127, ulCons(91, ulCons(126, lSingleton(92)))), ulCons(128, ulCons(92, ulCons(127, lSingleton(93)))), ulCons(129, ulCons(93, ulCons(128, lSingleton(94)))), ulCons(130, ulCons(94, ulCons(129, lSingleton(95)))), ulCons(131, ulCons(95, ulCons(130, lSingleton(96)))), ulCons(132, ulCons(96, ulCons(131, lSingleton(97)))), ulCons(133, ulCons(97, ulCons(132, lSingleton(98)))), ulCons(134, ulCons(98, ulCons(133, lSingleton(99)))), ulCons(135, ulCons(99, ulCons(134, lSingleton(100)))), ulCons(136, ulCons(100, ulCons(135, lSingleton(101)))), ulCons(137, ulCons(101, ulCons(136, lSingleton(102)))), ulCons(138, ulCons(102, ulCons(137, lSingleton(103)))), ulCons(139, ulCons(103, ulCons(138, lSingleton(104)))), ulCons(104, lSingleton(139)), ulCons(141, ulCons(105, ulCons(140, lSingleton(106)))), ulCons(142, ulCons(106, ulCons(141, lSingleton(107)))), ulCons(143, ulCons(107, ulCons(142, lSingleton(108)))), ulCons(144, ulCons(108, ulCons(143, lSingleton(109)))), ulCons(145, ulCons(109, ulCons(144, lSingleton(110)))), ulCons(146, ulCons(110, ulCons(145, lSingleton(111)))), ulCons(147, ulCons(111, ulCons(146, lSingleton(112)))), ulCons(148, ulCons(112, ulCons(147, lSingleton(113)))), ulCons(149, ulCons(113, ulCons(148, lSingleton(114)))), ulCons(150, ulCons(114, ulCons(149, lSingleton(115)))), ulCons(151, ulCons(115, ulCons(150, lSingleton(116)))), ulCons(152, ulCons(116, ulCons(151, lSingleton(117)))), ulCons(153, ulCons(117, ulCons(152, lSingleton(118)))), ulCons(154, ulCons(118, ulCons(153, lSingleton(119)))), ulCons(155, ulCons(119, ulCons(154, lSingleton(120)))), ulCons(156, ulCons(120, ulCons(155, lSingleton(121)))), ulCons(157, ulCons(121, ulCons(156, lSingleton(122)))), ulCons(158, lSingleton(123)), ulCons(159, ulCons(123, ulCons(158, lSingleton(124)))), ulCons(160, ulCons(124, ulCons(159, lSingleton(125)))), ulCons(161, ulCons(125, ulCons(160, lSingleton(126)))), ulCons(162, ulCons(126, ulCons(161, lSingleton(127)))), ulCons(163, ulCons(127, ulCons(162, lSingleton(128)))), ulCons(164, ulCons(128, ulCons(163, lSingleton(129)))), ulCons(165, ulCons(129, ulCons(164, lSingleton(130)))), ulCons(166, ulCons(130, ulCons(165, lSingleton(131)))), ulCons(167, ulCons(131, ulCons(166, lSingleton(132)))), ulCons(168, ulCons(132, ulCons(167, lSingleton(133)))), ulCons(169, ulCons(133, ulCons(168, lSingleton(134)))), ulCons(170, ulCons(134, ulCons(169, lSingleton(135)))), ulCons(171, ulCons(135, ulCons(170, lSingleton(136)))), ulCons(172, ulCons(136, ulCons(171, lSingleton(137)))), ulCons(173, ulCons(137, ulCons(172, lSingleton(138)))), ulCons(174, ulCons(138, ulCons(173, lSingleton(139)))), ulCons(139, lSingleton(174)), ulCons(176, ulCons(140, ulCons(175, lSingleton(141)))), ulCons(177, ulCons(141, ulCons(176, lSingleton(142)))), ulCons(178, ulCons(142, ulCons(177, lSingleton(143)))), ulCons(179, ulCons(143, ulCons(178, lSingleton(144)))), ulCons(180, ulCons(144, ulCons(179, lSingleton(145)))), ulCons(181, ulCons(145, ulCons(180, lSingleton(146)))), ulCons(182, ulCons(146, ulCons(181, lSingleton(147)))), ulCons(183, ulCons(147, ulCons(182, lSingleton(148)))), ulCons(184, ulCons(148, ulCons(183, lSingleton(149)))), ulCons(185, ulCons(149, ulCons(184, lSingleton(150)))), ulCons(186, ulCons(150, ulCons(185, lSingleton(151)))), ulCons(187, ulCons(151, ulCons(186, lSingleton(152)))), ulCons(188, ulCons(152, ulCons(187, lSingleton(153)))), ulCons(189, ulCons(153, ulCons(188, lSingleton(154)))), ulCons(190, ulCons(154, ulCons(189, lSingleton(155)))), ulCons(191, ulCons(155, ulCons(190, lSingleton(156)))), ulCons(192, ulCons(156, ulCons(191, lSingleton(157)))), ulCons(193, lSingleton(158)), ulCons(194, ulCons(158, ulCons(193, lSingleton(159)))), ulCons(195, ulCons(159, ulCons(194, lSingleton(160)))), ulCons(196, ulCons(160, ulCons(195, lSingleton(161)))), ulCons(197, ulCons(161, ulCons(196, lSingleton(162)))), ulCons(198, ulCons(162, ulCons(197, lSingleton(163)))), ulCons(199, ulCons(163, ulCons(198, lSingleton(164)))), ulCons(200, ulCons(164, ulCons(199, lSingleton(165)))), ulCons(201, ulCons(165, ulCons(200, lSingleton(166)))), ulCons(202, ulCons(166, ulCons(201, lSingleton(167)))), ulCons(203, ulCons(167, ulCons(202, lSingleton(168)))), ulCons(204, ulCons(168, ulCons(203, lSingleton(169)))), ulCons(205, ulCons(169, ulCons(204, lSingleton(170)))), ulCons(206, ulCons(170, ulCons(205, lSingleton(171)))), ulCons(207, ulCons(171, ulCons(206, lSingleton(172)))), ulCons(208, ulCons(172, ulCons(207, lSingleton(173)))), ulCons(209, ulCons(173, ulCons(208, lSingleton(174)))), ulCons(174, lSingleton(209)), ulCons(211, ulCons(175, ulCons(210, lSingleton(176)))), ulCons(212, ulCons(176, ulCons(211, lSingleton(177)))), ulCons(213, ulCons(177, ulCons(212, lSingleton(178)))), ulCons(214, ulCons(178, ulCons(213, lSingleton(179)))), ulCons(215, ulCons(179, ulCons(214, lSingleton(180)))), ulCons(216, ulCons(180, ulCons(215, lSingleton(181)))), ulCons(217, ulCons(181, ulCons(216, lSingleton(182)))), ulCons(218, ulCons(182, ulCons(217, lSingleton(183)))), ulCons(219, ulCons(183, ulCons(218, lSingleton(184)))), ulCons(220, ulCons(184, ulCons(219, lSingleton(185)))), ulCons(221, ulCons(185, ulCons(220, lSingleton(186)))), ulCons(222, ulCons(186, ulCons(221, lSingleton(187)))), ulCons(223, ulCons(187, ulCons(222, lSingleton(188)))), ulCons(224, ulCons(188, ulCons(223, lSingleton(189)))), ulCons(225, ulCons(189, ulCons(224, lSingleton(190)))), ulCons(226, ulCons(190, ulCons(225, lSingleton(191)))), ulCons(227, ulCons(191, ulCons(226, lSingleton(192)))), ulCons(228, lSingleton(193)), ulCons(229, ulCons(193, ulCons(228, lSingleton(194)))), ulCons(230, ulCons(194, ulCons(229, lSingleton(195)))), ulCons(231, ulCons(195, ulCons(230, lSingleton(196)))), ulCons(232, ulCons(196, ulCons(231, lSingleton(197)))), ulCons(233, ulCons(197, ulCons(232, lSingleton(198)))), ulCons(234, ulCons(198, ulCons(233, lSingleton(199)))), ulCons(235, ulCons(199, ulCons(234, lSingleton(200)))), ulCons(236, ulCons(200, ulCons(235, lSingleton(201)))), ulCons(237, ulCons(201, ulCons(236, lSingleton(202)))), ulCons(238, ulCons(202, ulCons(237, lSingleton(203)))), ulCons(239, ulCons(203, ulCons(238, lSingleton(204)))), ulCons(240, ulCons(204, ulCons(239, lSingleton(205)))), ulCons(241, ulCons(205, ulCons(240, lSingleton(206)))), ulCons(242, ulCons(206, ulCons(241, lSingleton(207)))), ulCons(243, ulCons(207, ulCons(242, lSingleton(208)))), ulCons(244, ulCons(208, ulCons(243, lSingleton(209)))), ulCons(209, lSingleton(244)), ulCons(246, ulCons(210, ulCons(245, lSingleton(211)))), ulCons(247, ulCons(211, ulCons(246, lSingleton(212)))), ulCons(248, ulCons(212, ulCons(247, lSingleton(213)))), ulCons(249, ulCons(213, ulCons(248, lSingleton(214)))), ulCons(250, ulCons(214, ulCons(249, lSingleton(215)))), ulCons(251, ulCons(215, ulCons(250, lSingleton(216)))), ulCons(252, ulCons(216, ulCons(251, lSingleton(217)))), ulCons(253, ulCons(217, ulCons(252, lSingleton(218)))), ulCons(254, ulCons(218, ulCons(253, lSingleton(219)))), ulCons(255, ulCons(219, ulCons(254, lSingleton(220)))), ulCons(256, ulCons(220, ulCons(255, lSingleton(221)))), ulCons(257, ulCons(221, ulCons(256, lSingleton(222)))), ulCons(258, ulCons(222, ulCons(257, lSingleton(223)))), ulCons(259, ulCons(223, ulCons(258, lSingleton(224)))), ulCons(260, ulCons(224, ulCons(259, lSingleton(225)))), ulCons(261, ulCons(225, ulCons(260, lSingleton(226)))), ulCons(262, ulCons(226, ulCons(261, lSingleton(227)))), ulCons(263, lSingleton(228)), ulCons(264, ulCons(228, ulCons(263, lSingleton(229)))), ulCons(265, ulCons(229, ulCons(264, lSingleton(230)))), ulCons(266, ulCons(230, ulCons(265, lSingleton(231)))), ulCons(267, ulCons(231, ulCons(266, lSingleton(232)))), ulCons(268, ulCons(232, ulCons(267, lSingleton(233)))), ulCons(269, ulCons(233, ulCons(268, lSingleton(234)))), ulCons(270, ulCons(234, ulCons(269, lSingleton(235)))), ulCons(271, ulCons(235, ulCons(270, lSingleton(236)))), ulCons(272, ulCons(236, ulCons(271, lSingleton(237)))), ulCons(273, ulCons(237, ulCons(272, lSingleton(238)))), ulCons(274, ulCons(238, ulCons(273, lSingleton(239)))), ulCons(275, ulCons(239, ulCons(274, lSingleton(240)))), ulCons(276, ulCons(240, ulCons(275, lSingleton(241)))), ulCons(277, ulCons(241, ulCons(276, lSingleton(242)))), ulCons(278, ulCons(242, ulCons(277, lSingleton(243)))), ulCons(279, ulCons(243, ulCons(278, lSingleton(244)))), ulCons(244, lSingleton(279)), ulCons(281, ulCons(245, ulCons(280, lSingleton(246)))), ulCons(282, ulCons(246, ulCons(281, lSingleton(247)))), ulCons(283, ulCons(247, ulCons(282, lSingleton(248)))), ulCons(284, ulCons(248, ulCons(283, lSingleton(249)))), ulCons(285, ulCons(249, ulCons(284, lSingleton(250)))), ulCons(286, ulCons(250, ulCons(285, lSingleton(251)))), ulCons(287, ulCons(251, ulCons(286, lSingleton(252)))), ulCons(288, ulCons(252, ulCons(287, lSingleton(253)))), ulCons(289, ulCons(253, ulCons(288, lSingleton(254)))), ulCons(290, ulCons(254, ulCons(289, lSingleton(255)))), ulCons(291, ulCons(255, ulCons(290, lSingleton(256)))), ulCons(292, ulCons(256, ulCons(291, lSingleton(257)))), ulCons(293, ulCons(257, ulCons(292, lSingleton(258)))), ulCons(294, ulCons(258, ulCons(293, lSingleton(259)))), ulCons(295, ulCons(259, ulCons(294, lSingleton(260)))), ulCons(296, ulCons(260, ulCons(295, lSingleton(261)))), ulCons(297, ulCons(261, ulCons(296, lSingleton(262)))), ulCons(298, lSingleton(263)), ulCons(299, ulCons(263, ulCons(298, lSingleton(264)))), ulCons(300, ulCons(264, ulCons(299, lSingleton(265)))), ulCons(301, ulCons(265, ulCons(300, lSingleton(266)))), ulCons(302, ulCons(266, ulCons(301, lSingleton(267)))), ulCons(303, ulCons(267, ulCons(302, lSingleton(268)))), ulCons(304, ulCons(268, ulCons(303, lSingleton(269)))), ulCons(305, ulCons(269, ulCons(304, lSingleton(270)))), ulCons(306, ulCons(270, ulCons(305, lSingleton(271)))), ulCons(307, ulCons(271, ulCons(306, lSingleton(272)))), ulCons(308, ulCons(272, ulCons(307, lSingleton(273)))), ulCons(309, ulCons(273, ulCons(308, lSingleton(274)))), ulCons(310, ulCons(274, ulCons(309, lSingleton(275)))), ulCons(311, ulCons(275, ulCons(310, lSingleton(276)))), ulCons(312, ulCons(276, ulCons(311, lSingleton(277)))), ulCons(313, ulCons(277, ulCons(312, lSingleton(278)))), ulCons(314, ulCons(278, ulCons(313, lSingleton(279)))), ulCons(279, lSingleton(314)), ulCons(316, ulCons(280, ulCons(315, lSingleton(281)))), ulCons(317, ulCons(281, ulCons(316, lSingleton(282)))), ulCons(318, ulCons(282, ulCons(317, lSingleton(283)))), ulCons(319, ulCons(283, ulCons(318, lSingleton(284)))), ulCons(320, ulCons(284, ulCons(319, lSingleton(285)))), ulCons(321, ulCons(285, ulCons(320, lSingleton(286)))), ulCons(322, ulCons(286, ulCons(321, lSingleton(287)))), ulCons(323, ulCons(287, ulCons(322, lSingleton(288)))), ulCons(324, ulCons(288, ulCons(323, lSingleton(289)))), ulCons(325, ulCons(289, ulCons(324, lSingleton(290)))), ulCons(326, ulCons(290, ulCons(325, lSingleton(291)))), ulCons(327, ulCons(291, ulCons(326, lSingleton(292)))), ulCons(328, ulCons(292, ulCons(327, lSingleton(293)))), ulCons(329, ulCons(293, ulCons(328, lSingleton(294)))), ulCons(330, ulCons(294, ulCons(329, lSingleton(295)))), ulCons(331, ulCons(295, ulCons(330, lSingleton(296)))), ulCons(332, ulCons(296, ulCons(331, lSingleton(297)))), ulCons(333, lSingleton(298)), ulCons(334, ulCons(298, ulCons(333, lSingleton(299)))), ulCons(335, ulCons(299, ulCons(334, lSingleton(300)))), ulCons(336, ulCons(300, ulCons(335, lSingleton(301)))), ulCons(337, ulCons(301, ulCons(336, lSingleton(302)))), ulCons(338, ulCons(302, ulCons(337, lSingleton(303)))), ulCons(339, ulCons(303, ulCons(338, lSingleton(304)))), ulCons(340, ulCons(304, ulCons(339, lSingleton(305)))), ulCons(341, ulCons(305, ulCons(340, lSingleton(306)))), ulCons(342, ulCons(306, ulCons(341, lSingleton(307)))), ulCons(343, ulCons(307, ulCons(342, lSingleton(308)))), ulCons(344, ulCons(308, ulCons(343, lSingleton(309)))), ulCons(345, ulCons(309, ulCons(344, lSingleton(310)))), ulCons(346, ulCons(310, ulCons(345, lSingleton(311)))), ulCons(347, ulCons(311, ulCons(346, lSingleton(312)))), ulCons(348, ulCons(312, ulCons(347, lSingleton(313)))), ulCons(349, ulCons(313, ulCons(348, lSingleton(314)))), ulCons(314, lSingleton(349)), ulCons(351, ulCons(315, ulCons(350, lSingleton(316)))), ulCons(352, ulCons(316, ulCons(351, lSingleton(317)))), ulCons(353, ulCons(317, ulCons(352, lSingleton(318)))), ulCons(354, ulCons(318, ulCons(353, lSingleton(319)))), ulCons(355, ulCons(319, ulCons(354, lSingleton(320)))), ulCons(356, ulCons(320, ulCons(355, lSingleton(321)))), ulCons(357, ulCons(321, ulCons(356, lSingleton(322)))), ulCons(358, ulCons(322, ulCons(357, lSingleton(323)))), ulCons(359, ulCons(323, ulCons(358, lSingleton(324)))), ulCons(360, ulCons(324, ulCons(359, lSingleton(325)))), ulCons(361, ulCons(325, ulCons(360, lSingleton(326)))), ulCons(362, ulCons(326, ulCons(361, lSingleton(327)))), ulCons(363, ulCons(327, ulCons(362, lSingleton(328)))), ulCons(364, ulCons(328, ulCons(363, lSingleton(329)))), ulCons(365, ulCons(329, ulCons(364, lSingleton(330)))), ulCons(366, ulCons(330, ulCons(365, lSingleton(331)))), ulCons(367, ulCons(331, ulCons(366, lSingleton(332)))), ulCons(368, lSingleton(333)), ulCons(369, ulCons(333, ulCons(368, lSingleton(334)))), ulCons(370, ulCons(334, ulCons(369, lSingleton(335)))), ulCons(371, ulCons(335, ulCons(370, lSingleton(336)))), ulCons(372, ulCons(336, ulCons(371, lSingleton(337)))), ulCons(373, ulCons(337, ulCons(372, lSingleton(338)))), ulCons(374, ulCons(338, ulCons(373, lSingleton(339)))), ulCons(375, ulCons(339, ulCons(374, lSingleton(340)))), ulCons(376, ulCons(340, ulCons(375, lSingleton(341)))), ulCons(377, ulCons(341, ulCons(376, lSingleton(342)))), ulCons(378, ulCons(342, ulCons(377, lSingleton(343)))), ulCons(379, ulCons(343, ulCons(378, lSingleton(344)))), ulCons(380, ulCons(344, ulCons(379, lSingleton(345)))), ulCons(381, ulCons(345, ulCons(380, lSingleton(346)))), ulCons(382, ulCons(346, ulCons(381, lSingleton(347)))), ulCons(383, ulCons(347, ulCons(382, lSingleton(348)))), ulCons(384, ulCons(348, ulCons(383, lSingleton(349)))), ulCons(349, lSingleton(384)), ulCons(386, ulCons(350, ulCons(385, lSingleton(351)))), ulCons(387, ulCons(351, ulCons(386, lSingleton(352)))), ulCons(388, ulCons(352, ulCons(387, lSingleton(353)))), ulCons(389, ulCons(353, ulCons(388, lSingleton(354)))), ulCons(390, ulCons(354, ulCons(389, lSingleton(355)))), ulCons(391, ulCons(355, ulCons(390, lSingleton(356)))), ulCons(392, ulCons(356, ulCons(391, lSingleton(357)))), ulCons(393, ulCons(357, ulCons(392, lSingleton(358)))), ulCons(394, ulCons(358, ulCons(393, lSingleton(359)))), ulCons(395, ulCons(359, ulCons(394, lSingleton(360)))), ulCons(396, ulCons(360, ulCons(395, lSingleton(361)))), ulCons(397, ulCons(361, ulCons(396, lSingleton(362)))), ulCons(398, ulCons(362, ulCons(397, lSingleton(363)))), ulCons(399, ulCons(363, ulCons(398, lSingleton(364)))), ulCons(400, ulCons(364, ulCons(399, lSingleton(365)))), ulCons(401, ulCons(365, ulCons(400, lSingleton(366)))), ulCons(402, ulCons(366, ulCons(401, lSingleton(367)))), ulCons(403, lSingleton(368)), ulCons(404, ulCons(368, ulCons(403, lSingleton(369)))), ulCons(405, ulCons(369, ulCons(404, lSingleton(370)))), ulCons(406, ulCons(370, ulCons(405, lSingleton(371)))), ulCons(407, ulCons(371, ulCons(406, lSingleton(372)))), ulCons(408, ulCons(372, ulCons(407, lSingleton(373)))), ulCons(409, ulCons(373, ulCons(408, lSingleton(374)))), ulCons(410, ulCons(374, ulCons(409, lSingleton(375)))), ulCons(411, ulCons(375, ulCons(410, lSingleton(376)))), ulCons(412, ulCons(376, ulCons(411, lSingleton(377)))), ulCons(413, ulCons(377, ulCons(412, lSingleton(378)))), ulCons(414, ulCons(378, ulCons(413, lSingleton(379)))), ulCons(415, ulCons(379, ulCons(414, lSingleton(380)))), ulCons(416, ulCons(380, ulCons(415, lSingleton(381)))), ulCons(417, ulCons(381, ulCons(416, lSingleton(382)))), ulCons(418, ulCons(382, ulCons(417, lSingleton(383)))), ulCons(419, ulCons(383, ulCons(418, lSingleton(384)))), ulCons(384, lSingleton(419)), ulCons(421, ulCons(385, ulCons(420, lSingleton(386)))), ulCons(422, ulCons(386, ulCons(421, lSingleton(387)))), ulCons(423, ulCons(387, ulCons(422, lSingleton(388)))), ulCons(424, ulCons(388, ulCons(423, lSingleton(389)))), ulCons(425, ulCons(389, ulCons(424, lSingleton(390)))), ulCons(426, ulCons(390, ulCons(425, lSingleton(391)))), ulCons(427, ulCons(391, ulCons(426, lSingleton(392)))), ulCons(428, ulCons(392, ulCons(427, lSingleton(393)))), ulCons(429, ulCons(393, ulCons(428, lSingleton(394)))), ulCons(430, ulCons(394, ulCons(429, lSingleton(395)))), ulCons(431, ulCons(395, ulCons(430, lSingleton(396)))), ulCons(432, ulCons(396, ulCons(431, lSingleton(397)))), ulCons(433, ulCons(397, ulCons(432, lSingleton(398)))), ulCons(434, ulCons(398, ulCons(433, lSingleton(399)))), ulCons(435, ulCons(399, ulCons(434, lSingleton(400)))), ulCons(436, ulCons(400, ulCons(435, lSingleton(401)))), ulCons(437, ulCons(401, ulCons(436, lSingleton(402)))), ulCons(438, lSingleton(403)), ulCons(439, ulCons(403, ulCons(438, lSingleton(404)))), ulCons(440, ulCons(404, ulCons(439, lSingleton(405)))), ulCons(441, ulCons(405, ulCons(440, lSingleton(406)))), ulCons(442, ulCons(406, ulCons(441, lSingleton(407)))), ulCons(443, ulCons(407, ulCons(442, lSingleton(408)))), ulCons(444, ulCons(408, ulCons(443, lSingleton(409)))), ulCons(445, ulCons(409, ulCons(444, lSingleton(410)))), ulCons(446, ulCons(410, ulCons(445, lSingleton(411)))), ulCons(447, ulCons(411, ulCons(446, lSingleton(412)))), ulCons(448, ulCons(412, ulCons(447, lSingleton(413)))), ulCons(449, ulCons(413, ulCons(448, lSingleton(414)))), ulCons(450, ulCons(414, ulCons(449, lSingleton(415)))), ulCons(451, ulCons(415, ulCons(450, lSingleton(416)))), ulCons(452, ulCons(416, ulCons(451, lSingleton(417)))), ulCons(453, ulCons(417, ulCons(452, lSingleton(418)))), ulCons(454, ulCons(418, ulCons(453, lSingleton(419)))), ulCons(419, lSingleton(454)), ulCons(456, ulCons(420, ulCons(455, lSingleton(421)))), ulCons(457, ulCons(421, ulCons(456, lSingleton(422)))), ulCons(458, ulCons(422, ulCons(457, lSingleton(423)))), ulCons(459, ulCons(423, ulCons(458, lSingleton(424)))), ulCons(460, ulCons(424, ulCons(459, lSingleton(425)))), ulCons(461, ulCons(425, ulCons(460, lSingleton(426)))), ulCons(462, ulCons(426, ulCons(461, lSingleton(427)))), ulCons(463, ulCons(427, ulCons(462, lSingleton(428)))), ulCons(464, ulCons(428, ulCons(463, lSingleton(429)))), ulCons(465, ulCons(429, ulCons(464, lSingleton(430)))), ulCons(466, ulCons(430, ulCons(465, lSingleton(431)))), ulCons(467, ulCons(431, ulCons(466, lSingleton(432)))), ulCons(468, ulCons(432, ulCons(467, lSingleton(433)))), ulCons(469, ulCons(433, ulCons(468, lSingleton(434)))), ulCons(470, ulCons(434, ulCons(469, lSingleton(435)))), ulCons(471, ulCons(435, ulCons(470, lSingleton(436)))), ulCons(472, ulCons(436, ulCons(471, lSingleton(437)))), ulCons(473, lSingleton(438)), ulCons(474, ulCons(438, ulCons(473, lSingleton(439)))), ulCons(475, ulCons(439, ulCons(474, lSingleton(440)))), ulCons(476, ulCons(440, ulCons(475, lSingleton(441)))), ulCons(477, ulCons(441, ulCons(476, lSingleton(442)))), ulCons(478, ulCons(442, ulCons(477, lSingleton(443)))), ulCons(479, ulCons(443, ulCons(478, lSingleton(444)))), ulCons(480, ulCons(444, ulCons(479, lSingleton(445)))), ulCons(481, ulCons(445, ulCons(480, lSingleton(446)))), ulCons(482, ulCons(446, ulCons(481, lSingleton(447)))), ulCons(483, ulCons(447, ulCons(482, lSingleton(448)))), ulCons(484, ulCons(448, ulCons(483, lSingleton(449)))), ulCons(485, ulCons(449, ulCons(484, lSingleton(450)))), ulCons(486, ulCons(450, ulCons(485, lSingleton(451)))), ulCons(487, ulCons(451, ulCons(486, lSingleton(452)))), ulCons(488, ulCons(452, ulCons(487, lSingleton(453)))), ulCons(489, ulCons(453, ulCons(488, lSingleton(454)))), ulCons(454, lSingleton(489)), ulCons(491, ulCons(455, ulCons(490, lSingleton(456)))), ulCons(492, ulCons(456, ulCons(491, lSingleton(457)))), ulCons(493, ulCons(457, ulCons(492, lSingleton(458)))), ulCons(494, ulCons(458, ulCons(493, lSingleton(459)))), ulCons(495, ulCons(459, ulCons(494, lSingleton(460)))), ulCons(496, ulCons(460, ulCons(495, lSingleton(461)))), ulCons(497, ulCons(461, ulCons(496, lSingleton(462)))), ulCons(498, ulCons(462, ulCons(497, lSingleton(463)))), ulCons(499, ulCons(463, ulCons(498, lSingleton(464)))), ulCons(500, ulCons(464, ulCons(499, lSingleton(465)))), ulCons(501, ulCons(465, ulCons(500, lSingleton(466)))), ulCons(502, ulCons(466, ulCons(501, lSingleton(467)))), ulCons(503, ulCons(467, ulCons(502, lSingleton(468)))), ulCons(504, ulCons(468, ulCons(503, lSingleton(469)))), ulCons(505, ulCons(469, ulCons(504, lSingleton(470)))), ulCons(506, ulCons(470, ulCons(505, lSingleton(471)))), ulCons(507, ulCons(471, ulCons(506, lSingleton(472)))), ulCons(508, lSingleton(473)), ulCons(509, ulCons(473, ulCons(508, lSingleton(474)))), ulCons(510, ulCons(474, ulCons(509, lSingleton(475)))), ulCons(511, ulCons(475, ulCons(510, lSingleton(476)))), ulCons(512, ulCons(476, ulCons(511, lSingleton(477)))), ulCons(513, ulCons(477, ulCons(512, lSingleton(478)))), ulCons(514, ulCons(478, ulCons(513, lSingleton(479)))), ulCons(515, ulCons(479, ulCons(514, lSingleton(480)))), ulCons(516, ulCons(480, ulCons(515, lSingleton(481)))), ulCons(517, ulCons(481, ulCons(516, lSingleton(482)))), ulCons(518, ulCons(482, ulCons(517, lSingleton(483)))), ulCons(519, ulCons(483, ulCons(518, lSingleton(484)))), ulCons(520, ulCons(484, ulCons(519, lSingleton(485)))), ulCons(521, ulCons(485, ulCons(520, lSingleton(486)))), ulCons(522, ulCons(486, ulCons(521, lSingleton(487)))), ulCons(523, ulCons(487, ulCons(522, lSingleton(488)))), ulCons(524, ulCons(488, ulCons(523, lSingleton(489)))), ulCons(489, lSingleton(524)), ulCons(526, ulCons(490, ulCons(525, lSingleton(491)))), ulCons(527, ulCons(491, ulCons(526, lSingleton(492)))), ulCons(528, ulCons(492, ulCons(527, lSingleton(493)))), ulCons(529, ulCons(493, ulCons(528, lSingleton(494)))), ulCons(530, ulCons(494, ulCons(529, lSingleton(495)))), ulCons(531, ulCons(495, ulCons(530, lSingleton(496)))), ulCons(532, ulCons(496, ulCons(531, lSingleton(497)))), ulCons(533, ulCons(497, ulCons(532, lSingleton(498)))), ulCons(534, ulCons(498, ulCons(533, lSingleton(499)))), ulCons(535, ulCons(499, ulCons(534, lSingleton(500)))), ulCons(536, ulCons(500, ulCons(535, lSingleton(501)))), ulCons(537, ulCons(501, ulCons(536, lSingleton(502)))), ulCons(538, ulCons(502, ulCons(537, lSingleton(503)))), ulCons(539, ulCons(503, ulCons(538, lSingleton(504)))), ulCons(540, ulCons(504, ulCons(539, lSingleton(505)))), ulCons(541, ulCons(505, ulCons(540, lSingleton(506)))), ulCons(542, ulCons(506, ulCons(541, lSingleton(507)))), ulCons(543, lSingleton(508)), ulCons(544, ulCons(508, ulCons(543, lSingleton(509)))), ulCons(545, ulCons(509, ulCons(544, lSingleton(510)))), ulCons(546, ulCons(510, ulCons(545, lSingleton(511)))), ulCons(547, ulCons(511, ulCons(546, lSingleton(512)))), ulCons(548, ulCons(512, ulCons(547, lSingleton(513)))), ulCons(549, ulCons(513, ulCons(548, lSingleton(514)))), ulCons(550, ulCons(514, ulCons(549, lSingleton(515)))), ulCons(551, ulCons(515, ulCons(550, lSingleton(516)))), ulCons(552, ulCons(516, ulCons(551, lSingleton(517)))), ulCons(553, ulCons(517, ulCons(552, lSingleton(518)))), ulCons(554, ulCons(518, ulCons(553, lSingleton(519)))), ulCons(555, ulCons(519, ulCons(554, lSingleton(520)))), ulCons(556, ulCons(520, ulCons(555, lSingleton(521)))), ulCons(557, ulCons(521, ulCons(556, lSingleton(522)))), ulCons(558, ulCons(522, ulCons(557, lSingleton(523)))), ulCons(559, ulCons(523, ulCons(558, lSingleton(524)))), ulCons(524, lSingleton(559)), ulCons(561, ulCons(525, ulCons(560, lSingleton(526)))), ulCons(562, ulCons(526, ulCons(561, lSingleton(527)))), ulCons(563, ulCons(527, ulCons(562, lSingleton(528)))), ulCons(564, ulCons(528, ulCons(563, lSingleton(529)))), ulCons(565, ulCons(529, ulCons(564, lSingleton(530)))), ulCons(566, ulCons(530, ulCons(565, lSingleton(531)))), ulCons(567, ulCons(531, ulCons(566, lSingleton(532)))), ulCons(568, ulCons(532, ulCons(567, lSingleton(533)))), ulCons(569, ulCons(533, ulCons(568, lSingleton(534)))), ulCons(570, ulCons(534, ulCons(569, lSingleton(535)))), ulCons(571, ulCons(535, ulCons(570, lSingleton(536)))), ulCons(572, ulCons(536, ulCons(571, lSingleton(537)))), ulCons(573, ulCons(537, ulCons(572, lSingleton(538)))), ulCons(574, ulCons(538, ulCons(573, lSingleton(539)))), ulCons(575, ulCons(539, ulCons(574, lSingleton(540)))), ulCons(576, ulCons(540, ulCons(575, lSingleton(541)))), ulCons(577, ulCons(541, ulCons(576, lSingleton(542)))), ulCons(578, lSingleton(543)), ulCons(579, ulCons(543, ulCons(578, lSingleton(544)))), ulCons(580, ulCons(544, ulCons(579, lSingleton(545)))), ulCons(581, ulCons(545, ulCons(580, lSingleton(546)))), ulCons(582, ulCons(546, ulCons(581, lSingleton(547)))), ulCons(583, ulCons(547, ulCons(582, lSingleton(548)))), ulCons(584, ulCons(548, ulCons(583, lSingleton(549)))), ulCons(585, ulCons(549, ulCons(584, lSingleton(550)))), ulCons(586, ulCons(550, ulCons(585, lSingleton(551)))), ulCons(587, ulCons(551, ulCons(586, lSingleton(552)))), ulCons(588, ulCons(552, ulCons(587, lSingleton(553)))), ulCons(589, ulCons(553, ulCons(588, lSingleton(554)))), ulCons(590, ulCons(554, ulCons(589, lSingleton(555)))), ulCons(591, ulCons(555, ulCons(590, lSingleton(556)))), ulCons(592, ulCons(556, ulCons(591, lSingleton(557)))), ulCons(593, ulCons(557, ulCons(592, lSingleton(558)))), ulCons(594, ulCons(558, ulCons(593, lSingleton(559)))), ulCons(559, lSingleton(594)), ulCons(596, ulCons(560, ulCons(595, lSingleton(561)))), ulCons(597, ulCons(561, ulCons(596, lSingleton(562)))), ulCons(598, ulCons(562, ulCons(597, lSingleton(563)))), ulCons(599, ulCons(563, ulCons(598, lSingleton(564)))), ulCons(600, ulCons(564, ulCons(599, lSingleton(565)))), ulCons(601, ulCons(565, ulCons(600, lSingleton(566)))), ulCons(602, ulCons(566, ulCons(601, lSingleton(567)))), ulCons(603, ulCons(567, ulCons(602, lSingleton(568)))), ulCons(604, ulCons(568, ulCons(603, lSingleton(569)))), ulCons(605, ulCons(569, ulCons(604, lSingleton(570)))), ulCons(606, ulCons(570, ulCons(605, lSingleton(571)))), ulCons(607, ulCons(571, ulCons(606, lSingleton(572)))), ulCons(608, ulCons(572, ulCons(607, lSingleton(573)))), ulCons(609, ulCons(573, ulCons(608, lSingleton(574)))), ulCons(610, ulCons(574, ulCons(609, lSingleton(575)))), ulCons(611, ulCons(575, ulCons(610, lSingleton(576)))), ulCons(612, ulCons(576, ulCons(611, lSingleton(577)))), lSingleton(578), ulCons(578, lSingleton(579)), ulCons(579, lSingleton(580)), ulCons(580, lSingleton(581)), ulCons(581, lSingleton(582)), ulCons(582, lSingleton(583)), ulCons(583, lSingleton(584)), ulCons(584, lSingleton(585)), ulCons(585, lSingleton(586)), ulCons(586, lSingleton(587)), ulCons(587, lSingleton(588)), ulCons(588, lSingleton(589)), ulCons(589, lSingleton(590)), ulCons(590, lSingleton(591)), ulCons(591, lSingleton(592)), ulCons(592, lSingleton(593)), ulCons(593, lSingleton(594)), lSingleton(594)];


///////////////////////////////////////////////////////////////////////////
/*
   WARNING: THIS WORKS AS EXPECTED ONLY IN THE CONTEXT OF NO MUTATION
   var x = 1;
   var xs = lSingleton(x); // xs = (1);
   x = 2; // xs = (2);
   If you are fine with this behavior, then go ahead, the gain in term of construction is pretty significant. (2op per element.) Otherwise, use the others constructors (lSafe[Tail]Cons and ulSafe[Tail]Cons) when constructing by hand.
   You can even go and dirty your hand by direclty defining an anonymous function: `function(@xs_) {xs_ =@ list; return value;}` value and list being provided by yourself.
*/

function _ulFoldL(@f, @acc, @xs) {
	return xs === null	? acc
						: _ulFoldL(f, f(acc)(xs(xs)), xs);
}

function _ulFoldLu(@f, @acc, @xs) {
	return xs === null	? acc
						: _ulFoldLu(f, f(acc, xs(xs)), xs);
}

function _ulFoldR(@f, @acc, @xs) {
	return xs === null	? acc
						: f(xs(xs))(_ulFoldR(f, acc, xs));
}

function _ulFoldRu(@f, @acc, @xs) {
	return xs === null	? acc
						: f(xs(xs), _ulFoldRu(f, acc, xs));
}

function _ulMap(@f, @xs) {
	return xs === null	? null
						: ulCons(f(xs(xs)), _ulMap(f, xs));
}

function _ulAppendMap(@f, @xs, @acc) {
	return xs === null	? acc
						: ulCons(f(xs(xs)), _ulAppendMap(f, xs, acc));
}

/**
* lConcat : List (List a) -> List a
*/
function lConcat(@xss) {
	return ulFoldRu(ulAppend, null, xss);
}

function _ulConcatMap(@f, @xs) {
	return xs === null	? null
						: _ulAppend(f(xs(xs)), _ulConcatMap(f, xs));
}

function _ulConcatFilter(@p, @xss) {
	return xss === null	? null
						: ulAppendFilter(p, xss(xss), _ulConcatFilter(p, xss));
}

function _ulConcatFilterMap(@f, @p, @xs) {
	return xs === null	? null
						: _ulAppendFilter(p, @f(xs(xs)), _ulConcatFilterMap(f, p, xs));
}

function _ulConcatMapFilter(@p, @f, @xs) {
	if (xs === null) { return null; }
	else             {
        var x = xs(xs);
		return p(x) ? ulAppend(f(x), _ulConcatMapFilter(p, f, xs))
                    :                _ulConcatMapFilter(p, f, xs);
	}
}

function _ulApply(@fs, @xs) {
	return fs === null	? null
						: _ulAppendMap(fs(fs), @xs, _ulApply(fs, xs));
}

function _ulAppend(@xs, @ys) {
	return xs === null	? ys
						: ulCons(xs(xs), _ulAppend(xs, ys));
}

function _ulFilter(@p, @xs) {
	if (xs === null)	{ return null; }
	else				{
        var x = xs(xs);
		return p(x) ? ulCons(x, _ulFilter(p, xs))
                    :           _ulFilter(p, xs);
	}
}

function _ulAppendFilter(@p, @xs, @acc) {
	if (xs === null)	{ return acc; }
	else				{
        var x = xs(xs);
		return p(x) ? ulCons(x, _ulAppendFilter(p, xs, acc))
                    :           _ulAppendFilter(p, xs, acc);
	}
}

function _lLength(@xs) {
	if (xs === null)	{ return 0; }
	else				{
		xs(xs);
		return 1 + _lLength(xs);
	}
}

/**
* lEmpty : List a -> Bool
*/
function lEmpty(@xs) {
	return xs === null;
}

/**
* lRepeat : a -> List a
*/
function lRepeat(@x) {
	var _x =@ x;
	return function(@xs_) { xs_ =@ lRepeat(_x); return _x; };
}

/**
* ulReplicate : (Int, a) -> List a
*/
function ulReplicate(@n, @x) {
	return _ulTake(n, lRepeat(x));
}

function _ulTake(@n, @xs) {
	return n === 0 || xs === null	? null
									: ulCons(xs(xs), _ulTake(n - 1, xs));
}

function _ulDrop(@n, @xs) {
	if (n === 0 || xs === null)	{ return xs; }
	else						{
		xs(xs);
		return _ulDrop(n - 1, xs);
	}
}

function _ulAll(@p, @xs) {
	return xs === null	? true
						: p(xs(xs)) || _ulAll(p, xs);
}

function _ulAny(@p, @xs) {
	return xs === null	? false
						: p(xs(xs)) || _ulAny(p, xs);
}

/**
* ulIter : ((a -> ()), List a) -> ()
*/
function ulIter(@f, @xs) {
	var _xs =@ xs;
	while (_xs !== null) {
		f(_xs(_xs));
	}
}

/**
* lHead : List a -> a
*/
function lHead(@l) {
	if (l === null) { debugE("lHead: Empty list");}
	else            {
		return l(null);
	}
}

/**
* lTail : List a -> List a
*/
function lTail(@l) {
	if (l === null) { debugE("lTail: Empty list");}
	else            {
		var xs;
		l(xs);
		return xs;
	}
}

/**
* augment : ((a -> b -> b) -> b -> b) -> List a -> List a
*/
function augment(@f) { return function(@xs) {
	return f(lCons)(xs);
};}

/**
* build : ((a -> b -> b) -> b -> b) -> List a
*/
function build(@f) { return f(lCons)(null);}

/**
* buildu : ((((a, b) -> b), b) -> b) -> List a
*/
function buildu(@f) { return f(ulCons, null); }

/**
* lSingleton : a -> List a
*/
function lSingleton(@x) {
	return function(@xs_) { xs_ =@ null; return x; };}

/**
* lSafeSingleton : a -> List a
*/
function lSafeSingleton(@x) {
	var _x =@ x;
	return function(@xs_) {
	xs_ =@ null;
    return x;
};}

/**
* lCons : a -> List a -> List a
*/
function lCons(@x) {
	return function(@xs) {
		return function(@xs_) {
	xs_ =@ xs; return x;
};};}

/**
* ulCons : (a, List a) -> List a
*/
function ulCons(@x, @xs) {
	return function(@xs_) { xs_ =@ xs; return x; };
}

/**
* ulSnoc : (List a, a) -> List a
*/
function ulSnoc(@xs, @x) {
	return function(@xs_) { xs_ =@ xs; return x; };
}

/**
* lSafeCons : a -> List a -> List a
*/
function lSafeCons(@x){
	var _x =@ x;
	return function(@xs){
		var _xs =@ xs;
		return function(@xs_) {
	xs_ =@ _xs; return _x;
};};}

/**
* ulSafeCons : (a, List a) -> List a
*/
function ulSafeCons(@x, @xs) {
	var _x =@ x, _xs =@ xs;
	return function(@xs_) {
	xs_ =@ _xs; return _x;
};}

/**
* ulSafeSnoc : (List a, a) -> List a
*/
function ulSafeSnoc(@xs, @x) {
	var _x =@ x, _xs =@ xs;
	return function(@xs_) { xs_ =@ _xs; return _x; };
}

/**
* lSafeTailCons : a -> List a -> List a
*/
function lSafeTailCons(@x){
	return function(@xs){
		var _xs =@ xs;
		return function(@xs_) {
	xs_ =@ _xs; return x;
};};}

/**
* ulSafeTailCons : (a, List a) -> List a
*/
function ulSafeTailCons(@x, @xs) {
	var _xs =@ xs;
	return function(@xs_) {
	xs_ =@ _xs; return x;
};}

/**
* ulSafeTailSnoc : (List a, a) -> List a
*/
function ulSafeTailSnoc(@xs, @x) {
	var _xs =@ xs;
	return function(@xs_) { xs_ =@ _xs; return x; };
}

/**
* lFromArray : Array a -> List a
*/
function lFromArray(@xs){
	return arrayFoldRight(xs, ulCons, null);
}

/**
* lFromKeys : Assoc a b -> List a
*/
function lFromKeys(@xs) {
	var ret = null;
	for (var k : var _ in xs) {
		ret =@ ulSafeCons(k, ret);
	}
	return ret;
}

/**
* lToArray : List a -> Array a
*/
function lToArray(@l){
	return ulFoldLu(function(@acc, @x) { push(acc, x); return acc; }, [], @l);
}

/**
* lToString : List a -> String
*/
function lToString(@l) {
	var toString = function(@x, @xs) { return@ ("ulCons(" + x + ", " + xs + ")"); };
	return ulFoldRu(toString, null, @l);
}

/**
* lFoldL : (b -> a -> b) -> b -> List a -> b
*/
function lFoldL(@f){ return function(@acc) { return function(@xs) {
	return _ulFoldL(f, acc, @xs);
};};}

/**
* ulFoldL : ((b -> a -> b), b, List a) -> b
*/
function ulFoldL(@f, @acc, @xs) {
	return _ulFoldL(f, acc, @xs);
}

/**
* lFoldLu : ((b, a) -> b) -> b -> List a -> b
*/
function lFoldLu(@f){ return function(@acc) { return function(@xs) {
	return _ulFoldLu(f, acc, @xs);
};};}

/**
* ulFoldLu : ((b -> a -> b), b, List a) -> b
*/
function ulFoldLu(@f, @acc, @xs) {
	return _ulFoldLu(f, acc, @xs);
}

/**
* lFoldR : (a -> b -> b) -> b -> List a -> b
*/
function lFoldR(@f) { return function(@acc) { return function(@xs) {
	return _ulFoldR(f, acc, @xs);
};};}

/**
* ulFoldR : ((a -> b -> b), b, List a) -> b
*/
function ulFoldR(@f, @acc, @xs) {
	return _ulFoldR(f, acc, @xs);
}

/**
* ulFoldRu : (((a, b) -> b), b, List a) -> b
*/
function ulFoldRu(@f, @acc, @xs) {
	return _ulFoldRu(f, acc, @xs);
}

/**
* lMap : (a -> b) -> List a -> List b
*/
function lMap(@f) { return function (@xs) {
	return _ulMap(f, @xs);
};}

/**
* ulMap : ((a -> b), List a) -> List b
*/
function ulMap(@f, @xs) {
	return _ulMap(f, @xs);
}

/**
* ulAppendMap : ((a -> b), List a, List b) -> List b
*/
function ulAppendMap(@f, @xs, @acc) {
	return _ulAppendMap(f, @xs, acc);
}

/**
* ulConcatFilter : ((a -> Bool), List (List a)) -> List a
*/
function ulConcatFilter(@p, @xss) {
	return _ulConcatFilter(p, @xss);
}

/**
* lConcatFilterMap : (a -> List b) -> (b -> Bool) -> List a -> List b
*/
function lConcatFilterMap(@f) { return function(@p) { return function(@xs) {
return _ulConcatFilterMap(f, p, @xs);
};};}

/**
* ulConcatFilterMap : ((a -> List b), (b -> Bool), List a) -> List b
*/
function ulConcatFilterMap(@f, @p, @xs) {
	return _ulConcatFilterMap(f, p, @xs);
}

/**
* ulConcatMapFilter : ((a -> Bool), (a -> List b), List a) -> List b
*/
function ulConcatMapFilter(@p, @f, @xs) {
	return _ulConcatMapFilter(p, f, @xs);
}

/**
* lAppend : List a -> List a -> List a
*/
function lAppend(@xs) { return function(@ys) {
		return _ulAppend(@xs, ys);
};}

/**
* ulAppend : (List a, List a) -> List a
*/
function ulAppend(@xs, @ys) {
	return _ulAppend(@xs, ys);
}

/**
* lFilter : (a -> Bool) -> List a -> List a
*/
function lFilter(@p) { return function (@xs) {
	return _ulFilter(p, @xs);
};}

/**
* ulFilter : ((a -> Bool), List a) -> List a
*/
function ulFilter(@p, @xs) {
	return _ulFilter(p, @xs);
}

/**
* lAppendFilter : (a -> Bool) -> List a -> List a -> List a
*/
function lAppendFilter(@p) { return function(@xs) {return function(@acc){
	return _ulAppendFilter(p, @xs, acc);
};};}

/**
* ulAppendFilter : ((a -> Bool), List a, List a) -> List a
*/
function ulAppendFilter(@p, @xs, @acc) {
	return _ulAppendFilter(p, @xs, acc);
}

/**
* lIter : (a -> ()) -> List a -> ()
*/
function lIter(@f) { return function(@xs) {
	ulIter(f, xs);
};}

/**
* lApply : List (a -> b) -> List a -> List b
*/
function lApply(@fs) { return function(@xs) {
	return _ulApply(@fs, xs);
};}

/**
* ulApply : (List (a -> b), List a) -> List b
*/
function ulApply(@fs, @xs) {
	return _ulApply(@fs, xs);
}

/**
* lConcatMap : (a -> List b) -> List a -> List b
*/
function lConcatMap(@f) { return function(@xs) {
	return _ulConcatMap(f, @xs);
};}

/**
* lReplicate : Int -> a -> List a
*/
function lReplicate(@n) { return function(@x) {
	return ulReplicate(n, x);
};}

/**
* lTake : Int -> List a -> List a
*/
function lTake(@n) { return function(@xs) {
	return _ulTake(n, @xs);
};}

/**
* ulTake : (Int, List a) -> List a
*/
function ulTake(@n, @xs) {
	return _ulTake(n, @xs);
}

/**
* lDrop : Int -> List a -> List a
*/
function lDrop(@n) { return function(@xs) {
	return _ulDrop(n, @xs);
};}

/**
* ulDrop : (Int, List a) -> List a
*/
function ulDrop(@n, @xs) {
	return _ulDrop(n, @xs);
}


/**
* lAll : (a -> Bool) -> List a -> Bool
*/
function lAll(@p) { return function(@xs) {
	return _ulAll(p, @xs);
};}

/**
* ulAll : ((a -> Bool), List a) -> Bool
*/
function ulAll(@p, @xs) {
	return _ulAll(p, @xs);
}


/**
* lAny : (a -> Bool) -> List a -> Bool
*/
function lAny(@p) { return function(@xs) {
	return _ulAny(p, @xs);
};}

/**
* ulAny : ((a -> Bool), List a) -> Bool
*/
function ulAny(@p, @xs) {
	return _ulAny(p, @xs);
}

///////////////////////////////////////////////////////////////////////////


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
* getLNeighbors : Cell -> Array Cell
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
function getSomewhatSafeCells(@gDI) { return function(@cells) { return function(@leeks) {
	var enemyDangerCheckers = function(leek) {
		var eWeapons =@ gDI(leek);
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
function lgetSomewhatSafeCells(@gDI) { return function(@cells) { return function(@leeks) {
	var enemyDangerCheckers = function(leek) {
		var eWeapons =@ lFromArray(gDI(leek));
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
///////////////////////////////////////////////////////////////////////////


/**
* aFoldL : (b -> a -> b) -> b -> Array a -> b
*/
function aFoldL(@f) { return function(@b) { return function(@as) {
	return arrayFoldLeft(as, uncurry2(f), b);
};};}

/**
* aFoldLu : ((b, a) -> b) -> b -> Array a -> b
*/
function aFoldLu(@f) { return function(@b) { return function(@as) {
	return arrayFoldLeft(as, f, b);
};};}

/**
* aFoldR : (a -> b -> b) -> b -> Array a -> b
*/
function aFoldR(@f) { return function(@b) { return function(@as) {
	return arrayFoldRight(as, uncurry2(f), b);
};};}

/**
* aFoldR : ((a, b) -> b) -> b -> Array a -> b
*/
function aFoldRu(@f) { return function(@b) { return function(@as) {
	return arrayFoldRight(as, f, b);
};};}

/**
* aFilter : (a -> Bool) -> Array a -> Array a
*/
function aFilter(@p) { return function(@xs) {
	return arrayFoldLeft(xs, function(@acc, @x){if (p(x)){push(acc, x);} return acc;}, []);
};}

/**
* aAppendFilter : ((a -> Bool), Array a, Array a) -> Array a
*/
function aAppendFilter(@p) { return function(@xs) { return function(@ys) {
	var ret =@ arrayFoldLeft(xs, function(@acc, @x){if (p(x)){push(acc, x);} return acc;}, []);
	ret += ys;
	return ret;
};};}

/**
* uaAppendFilter : ((a -> Bool), Array a, Array a) -> Array a
*/
function uaAppendFilter(@p, @xs, @ys) {
	var ret =@ arrayFoldLeft(xs, function(@acc, @x){if (p(x)){push(acc, x);} return acc;}, []);
	ret += ys;
	return ret;
}

/**
* aMap : (a -> b) -> Array a -> Array b
*/
function aMap(@f) { return function(@xs) {
	return arrayFoldLeft(xs, function(@acc, @x){push(acc, f(x)); return acc;}, []);
};}

/**
* daMap : (a -> b) -> Array a -> Array b
*/
function daMap(@f) { return function(@xs) {
	arrayFoldLeft(xs, function(@acc, @x){ x =@ f(x); return acc; }, f);
	return xs;
};}

/**
* aAppendMap : ((a -> b), Array a, Array b) -> Array b
*/
function aAppendMap(@f) { return function(@xs) { return function(@ys) {
	var ret =@ arrayFoldLeft(xs, function(@acc, @x){push(acc, f(x)); return acc;}, []);
	ret += ys;
	return ret;
};};}

/**
* uaAppendMap : ((a -> b), Array a, Array b) -> Array b
*/
function uaAppendMap(@f, @xs, @ys) {
	var ret =@ arrayFoldLeft(xs, function(@acc, @x){push(acc, f(x)); return acc;}, []);
	ret += ys;
	return ret;
}

/**
* aConcatMap : (a -> Array b) -> Array a -> Array b
*/
function aConcatMap(@f) { return function(@xs) {
	return arrayFoldLeft(xs, function(@acc, @x){acc += f(x); return acc;}, []);
};}

/**
* aConcatFilterMap : (a -> Array b) -> (b -> Bool) -> Array a -> Array b
*/
function aFilterConcatMap(@f) { return function(@p) { return function(@xs) {
	var ret = [];
	arrayFoldLeft(xs
				, function(@_, @x){arrayFoldLeft(f(x), function(@__, @y){if(p(y)){push(ret, y);} return __;},f); return _;}
				, f);
	return ret;
};};}

/**
* aFilterMap : (a -> b) -> (b -> Bool) -> Array a -> Array b
*/
function aFilterMap(@f) { return function(@p) { return function(@xs) {
	return arrayFoldLeft(xs
				, function(@acc, x){
						var y =@ f(x);
						if (p(y)) { push(acc, y); }
						return acc; }
				, []);
};};}

/**
* aMapFilter : (a -> Bool) -> (a -> b) -> Array a -> Array b
*/
function aMapFilter(@p) { return function(@f) { return function(@xs) {
	return arrayFoldLeft(xs
				, function(@acc, x){ if (p(x)) { push(acc, f(x)); } return acc; }
				, []);
};};}

/**
* aConcat : Array (Array a) -> Array a
*/
function aConcat(@xss) {
	return arrayFlatten(xss, 1);
}

/**
* aAppend : Array a -> Array a -> Array a
*/
function aAppend(@xs) {return function(@ys) {
	var ret = [];
	ret += xs;
	ret += ys;
	return ret;
};}

/**
* aApply : Array (a -> b) -> Array a -> Array b
*/
function aApply(@fs) { return function(@xs) {
	var ret = [];
	arrayFoldLeft(fs
				, function(@_, @f){ return arrayFoldLeft(xs, function(@__, @x){ push(ret, f(x)); return __; }, _); }
				, null);
	return ret;
};}

/**
* aIntersection : Array a -> Array a -> Array a
*/
function aIntersection(@xs) { return function(@ys) {
    if (count(ys) < count(xs)) { return aIntersection(ys)(xs); }
	var tmp =@ arrayFoldLeft(xs, function(@acc, @x) { acc["" + x] = true; return acc; }, []);
	return aFilter(function(@y){return tmp["" + y];})(ys);
};}

/**
* aRelativeComplement : Array a -> Array a -> Array a
*/
function aRelativeComplement(@xs) { return function(@ys) {
    var tmp =@ arrayFoldLeft(ys, function(@acc, @y) { acc["" + y] = true; return acc; }, []);
	return aFilter(function(@x){return !tmp["" + x];})(xs);
};}

function aUnion(@xs) { return function(@ys) {
	var tmp =@ arrayFoldLeft(xs, function(@acc, @x) { acc["" + x] = true; return acc; }, []);
	return aAppend(xs)(aFilter(function(@y){return !tmp["" + y];})(ys));
};}

/**
* aIter : (a -> ()) -> Array a -> ()
*/
function aIter(@f) { return function(@xs) {
	arrayFoldLeft(xs, function(@_, @x){f(x);}, null);
};}

/**
* uaTake : (Int, Array a) -> Array a
*/
function uaTake(n, @xs) {
	return arrayFoldLeft(xs, function(@acc, @x){if (n <= 0){ return acc;} push(acc, x); n--; return acc;}, []);
}

/**
* aTake : Int -> Array a -> Array a
*/
function aTake(@n) { return function(@xs) {
	return uaTake(n, xs);
};}

/**
* uaAny : (a -> Bool, Array a) -> Bool
*/
function uaAny(@p, @xs) {
	return arrayFoldLeft(xs, function(@acc, @x) { return acc || p(x); }, false);
}

/**
* aAny : (a -> Bool) -> Array a -> Bool
*/
function aAny(@p) { return function(@xs) {
	return arrayFoldLeft(xs, function(@acc, @x) { return acc || p(x); }, false);
};}

/**
* uaAll : (a -> Bool, Array a) -> Bool
*/
function uaAll(@p, @xs) {
	return arrayFoldLeft(xs, function(@acc, @x) { return acc && p(x); }, true);
}

/**
* aAll : (a -> Bool) -> Array a -> Bool
*/
function aAll(@p) { return function(@xs) {
	return arrayFoldLeft(xs, function(@acc, @x) { return acc && p(x); }, true);
};}

/**
* isEmpty : Array a -> Bool
*/
function isEmpty(@xs) { return count(xs) === 0; }

/**
* isNonEmpty : Array a -> Bool
*/
function isNonEmpty(@xs) { return count(xs) !== 0; }


/**
* getKeys : Assoc a b -> Array a
*/
function getKeys(xs) {
    var ks = [];
    for (var k : var x in xs) {
        push(ks, k);
    }
    return ks;
}

/**
* pairKV : a -> b -> Assoc a b
*/
function pairKV(@k) { return function(@v) {
    var type = typeOf(k);
    return @[(type === TYPE_NUMBER || type === TYPE_STRING ? k : "" + k) : v];};}

/**
* assocInsert : a -> b -> Assoc String b -> Assoc String b [mutating]
*/
function assocInsert(@k) { return function(@v) { return function(@xs) {
    xs["" + k] = v;
    return xs;
};};}

/**
* assocLookup : Assoc String b -> a -> b
*/
function assocLookup(@xs) { return function(@k) {
    return xs["" + k];
};}

/**
* keysMap : (k -> v) -> Array k -> Assoc k v
*/
function keysMap(f) { return function(@ks) {
	return arrayFoldLeft(ks, function(@acc, @k) { acc[k] = f(k); return acc; }, []);
};}

/**
* kvsFromMap : (v -> k) -> Array v -> Assoc k v
*/
function kvsFromMap(f) { return function(@vs) {
	return arrayFoldLeft(vs, function(@acc, @v) { acc[f(v)] = v; return acc; }, []);
};}

/**
* access : k -> Assoc k v -> v
*/
function access(@k) { return function(@kvs) { return kvs[k]; };}

/**
* lookup : Assoc k v -> k -> v
*/
function lookup(@kvs) { return function(@k) { return kvs[k]; };}

/**
* cyclicAccess : Num k => k -> Assoc k v -> v
*/
function cyclicAccess(@k) { return function(@kvs) { return kvs[k % count(kvs)]; };}

/**
* cyclicLookup : Num k => Assoc k v -> k -> v
*/
function cyclicLookup(@kvs) { return function(@k) { return kvs[k % count(kvs)]; };}

function cloneAt(@xs, @out) {
	return out += xs;
}

///////////////////////////////////////////////////////////////////////////
function memo1(f) {
	var cache = [];
	return function(@x) {
		var ret =@ cache["" + x];
		return ret !== null	? ret
							: cache[x] =@ f(x);
	};
}

function bmemo(f) {
	var cache = [];
	return function(@x) {
		var ret =@ cache[x];
		return ret !== null	? ret
							: cache[x] = f(x);
	};
}

function umemou2(f) {
	var cache = [];
	return function(@x, @y) {
		var params = x + "|" + y;
		var ret =@ cache[params];
		return ret !== null	? ret
							: cache[params] = f(x, y);
	};
}

function memou2(f) {
	var cache = [];
	return function(@x) {
	return function(@y) {
		var params = x + "|" + y;
		var ret =@ cache[params];
		return ret !== null	? ret
							: cache[params] = f(x, y);
	};};
}

function bmemo2(f) {
	var cache = [];
	return function(@x) {
		var ret =@ cache[x];
		return ret !== null ? ret
							: cache[x] = bmemo(f(x));
	};
}

function memo2(f) {
	var cache = [];
	return function(@x) {
	return function(@y) {
		var params = x + "|" + y;
		var ret =@ cache[params];
		return ret !== null	? ret
							: cache[params] = f(x)(y);
	};};
}
///////////////////////////////////////////////////////////////////////////

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



///////////////////////////////////////////////////////////////////////////



global S_SELF = 100;
global S_ALLIES = 101;
global S_ENEMIES = 102;
global S_ALL = 103;
global S_ORDER = 104;
global S_MAX_ID = 105;

global THP = 1000;
global HP = 1001;
global TMP = 1002;
global MP = 1003;
global TTP = 1004;
global TP = 1005;
global SCI = 1006;
global STR = 1007;
global MAG = 1008;
global WIS = 1009;
global AGI = 1010;
global RES = 1011;
global ASH = 1012;
global RSH = 1013;
global RET = 1014;
global POS = 1015;
global TYPE = 1016;
global EFFS = 1017;
global CHIPS = 1018;
global EQ = 1019;
global UNEQ = 1020;
global ID = 1021;
global ORDER = 1022;
global ALLY = 1023;
global ENEMY = 1024;
global SUMMON = 1025;
global SUMMONER = 1026;
global NAME = 1027;
global LEVEL = 1028;

function generateGameState() {
	var ret = [];
	var allies = getAliveAllies();
	var enemies = getAliveEnemies();
	var all =@( allies + enemies );
	var os =@ kvsFromMap(compose(subTo(1))(getEntityTurnOrder))(all);
keySort(os);
	var max_id = getAlliesCount() + getEnemiesCount();
	return 	[ S_SELF	: getLeek()
			, S_ALLIES	: allies
			, S_ENEMIES	: enemies
			, S_ALL		: keysMap(getEntityState)(all)
			, S_ORDER	: os
			, S_MAX_ID	: max_id
			];
}

function getEntityState(e) {
	var unequipped = getWeapons(e);
	var equipped = getWeapon(e);
	removeElement(unequipped, equipped);
	return	[ THP	: getTotalLife(e)
			, HP	: getLife(e)
			, TMP	: getTotalMP(e)
			, MP	: getMP(e)
			, TTP	: getTotalTP(e)
			, TP	: getTP(e)
			, SCI	: getScience(e)
			, STR	: getStrength(e)
			, MAG	: getMagic(e)
			, WIS	: getWisdom(e)
			, AGI	: getAgility(e)
			, RES	: getResistance(e)
			, ASH	: getAbsoluteShield(e)
			, RSH	: getRelativeShield(e)
			, RET 	: getDamageReturn(e)
			, POS	: getCell(e)
			, TYPE	: getType(e)
			, EFFS	: getEffects(e)
			, CHIPS	: keysMap(flip(curry2(getCooldown))(e))(getChips(e))
			, EQ	: equipped
			, UNEQ	: unequipped
			, ID	: e
			, ORDER	: getEntityTurnOrder(e)
			, AREA_POINT	: getApplicableArea(AREA_POINT)(getCell(e))
			, AREA_CIRCLE_1	: getApplicableArea(AREA_CIRCLE_1)(getCell(e))
			, AREA_CIRCLE_2	: getApplicableArea(AREA_CIRCLE_2)(getCell(e))
			, AREA_CIRCLE_3	: getApplicableArea(AREA_CIRCLE_3)(getCell(e))
			, ALLY	: isAlly(e)
			, ENEMY	: isEnemy(e)
			, SUMMON	: isSummon(e)
			, SUMMONER	: getSummoner(e)
			, NAME	: getName(e)
			, LEVEL	: getLevel(e)
			];
}

function getSelf(@state) { return state[S_ALL][state[S_SELF]]; }

function getActionListFromState(@s) {
	var self =@ getSelf(s);
	var tp =@ self[TP];
	var thp =@ self[THP];
	var hp =@ self[HP];
	var eq =@ self[EQ];
	var fWeap =@ function(@w) { return tp >= getWeaponCost(w) + 1; };
	var weapons =@ aFilter(fWeap)(self[UNEQ]);
	if (eq !== null && tp >= getWeaponCost(eq)) { push(weapons, eq); }
	var chips = [];
	for (var c : var cd in self[CHIPS]) {
		if (cd > 0) { continue; }
		if (tp >= getChipCost(c)) {
			push(chips, c);
		}
	}
	return	aAppend(weapons)(chips);
}

function getMovementListFromState(@s, @moves, @costs) {
	costs =@ getlAccessibleCells(getSelf(s)[MP])(getSelf(s)[POS]);
	removeKey(costs, getSelf(s)[POS]);
	moves =@ getKeys(costs);
}

function updateState(@s) { return function(@f) { s =@ f(s); };}

function getRandomChip(@s) {
}

global positiveEffects = [
	EFFECT_ABSOLUTE_SHIELD	: true,
	EFFECT_BUFF_AGILITY	: true,
	EFFECT_BUFF_MP	: true,
	EFFECT_BUFF_RESISTANCE	: true,
	EFFECT_BUFF_STRENGTH	: true,
	EFFECT_BUFF_TP	: true,
	EFFECT_BUFF_WISDOM	: true,
	EFFECT_DAMAGE_RETURN	: true,
	EFFECT_HEAL		: true,
	EFFECT_POISON	: false,
	EFFECT_RELATIVE_SHIELD	: true,
	EFFECT_SHACKLE_MAGIC	: false,
	EFFECT_SHACKLE_MP	: false,
	EFFECT_SHACKLE_STRENGTH : false,
	EFFECT_SHACKLE_TP	: false,
	];

global negativeEffects = daMap(not)(@@positiveEffects);

function applyEffect(@wearer) { return function(@effect) {
	var type = effect[0];
	if (type === EFFECT_POISON) {
		wearer[HP] -= effect[1];
	}
	else if (type === EFFECT_HEAL) {
		wearer[HP] = heal(effect[1], wearer);
	}
};}

function addEffect(@buff) { return function(@wearer) { return function(@effect) {
	var item_id = effect[5];
	if (buff) {
		wearer[EFFS] = aFilter(function(@eff) {return eff[5] !== item_id; })(wearer[EFFS]);
	}
	push(wearer[EFFS], effect);
};};}

function removeEffect(@wearer) { return function(@effect) {
	var type = effect[0];
	if (type === EFFECT_ABSOLUTE_SHIELD) {
		wearer[ASH] -= effect[1];
	}
	else if (type === EFFECT_RELATIVE_SHIELD) {
		wearer[RSH] -= effect[1];
	}
	else if (type === EFFECT_BUFF_AGILITY) {
		wearer[AGI] -= effect[1];
	}
	else if (type === EFFECT_BUFF_RESISTANCE) {
		wearer[RES] -= effect[1];
	}
	else if (type === EFFECT_BUFF_STRENGTH) {
		wearer[STR] -= effect[1];
	}
	else if (type === EFFECT_BUFF_WISDOM) {
		wearer[WIS] -= effect[1];
	}
	else if (type === EFFECT_BUFF_MP) {
		wearer[TMP] -= effect[1];
		wearer[MP] -= effect[1];
	}
	else if (type === EFFECT_BUFF_TP) {
		wearer[TTP] -= effect[1];
		wearer[TP] -= effect[1];
	}
	else if (type === EFFECT_SHACKLE_MAGIC) {
		wearer[MAG] += effect[1];
	}
	else if (type === EFFECT_SHACKLE_STRENGTH) {
		wearer[STR] += effect[1];
	}
	else if (type === EFFECT_SHACKLE_MP) {
		wearer[TMP] += effect[1];
		wearer[MP] += effect[1];
	}
	else if (type === EFFECT_SHACKLE_TP) {
		wearer[TTP] += effect[1];
		wearer[TP] += effect[1];
	}
	else if (type === EFFECT_DAMAGE_RETURN) {
		wearer[RET] -= effect[1];
	}
};}

function rawEff(@base, @stat) {
	return base * (100 + stat) / 100;
}

function damage(@raw, @target) {
	return max(0, raw * (1 - target[RSH] / 100) - target[ASH]);
}

function heal(@raw, @target) {
	return min(target[THP], target[HP] + raw);
}

function shackle(@base, @caster) {
	var mag = caster[MAG];
	return function(@target) {
		return round(base * (100 + max(0, mag - target[SCI])) / 100);
	};
}

function atk(@dmg, @ls, @target, @caster) {
	var effDmg = damage(dmg, target);
	target[HP] -= effDmg;
	caster[HP] = heal(ls * effDmg, caster);
	caster[HP] -= dmg * target[RET] / 100;
}

function removeDead(@state) {
	return function(@target) {
		if (target[HP] <= 0) {
			var ident = target[ID];
			removeElement(state[S_ALLIES], ident);
			removeElement(state[S_ENEMIES], ident);
			removeElement(state[S_ALL], target);
			/*
			if (!target[summon]) {
				var summons =@ aFilter(function(@x) { return x[SUMMONER] === target[ID]; })(state[all]);
			}
			*/
		}
};}

global ITEMS_EFFECT = [
WEAPON_AXE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(60.5, caster[STR]) * crit;
	var shack = shackle(0.55 * crit, caster);
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			var debuff = shack(target);
			target[MP] -= debuff;
			target[TMP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_MP, debuff, caster[ID], 1, false, WEAPON_AXE, target[ID]]);
			removeDead(state)(target);
		}
	};},
WEAPON_B_LASER : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(55, caster[STR]) * crit;
	var rheal = rawEff(55, caster[WIS]) * crit;
	var ls = caster[WIS] / 1000;
	var pos = caster[POS];
	var codir = sameDir(pos)(center);
	var all_id =@ aAppend(state[S_ALLIES])(state[S_ENEMIES]);
	return function(@target) {
		var tgt = target[POS];
		if (codir(tgt) && inRange(WEAPON_B_LASER)(pos)(tgt) && lineOfSight(pos, tgt, all_id)) {
			atk(dmg, ls, target, caster);
			if (target[HP] > 0) {
				target[HP] = heal(rheal, target);
			}
			else {
				removeDead(state)(target);
			}
		}
	};},
WEAPON_BROADSWORD : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(40, caster[STR]) * crit;
	var shack = shackle(0.35 * crit, caster);
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			var debuff = shack(target);
			target[TTP] -= debuff;
			target[TP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_TP, debuff, caster[ID], 1, false, WEAPON_BROADSWORD, target[ID]]);
			removeDead(state)(target);
		}
	};},
WEAPON_DESTROYER : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(50, caster[STR]) * crit;
	var shack = shackle(12 * crit, caster);
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			var debuff = shack(target);
			target[STR] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_STRENGTH, debuff, caster[ID], 1, false, WEAPON_DESTROYER, target[ID]]);
			removeDead(state)(target);
		}
	};},
WEAPON_DOUBLE_GUN : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(21.5, caster[STR]) * crit;
	var dmg2 = rawEff(6.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			atk(dmg2, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_ELECTRISOR : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(75, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		var tgt =@ target[POS];
		if (center === tgt) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			atk(dmg * 0.5, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_FLAME_THROWER : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(37.5, caster[STR]) * crit;
	var poi = rawEff(27, caster[MAG]) * crit;
	var ls = caster[WIS] / 1000;
	var pos = caster[POS];
	var codir = sameDir(pos)(center);
	var all_id =@ aAppend(state[S_ALLIES])(state[S_ENEMIES]);
	return function(@target) {
		var tgt = target[POS];
		if (codir(tgt) && inRange(WEAPON_FLAME_THROWER)(pos)(tgt) && lineOfSight(pos, tgt, all_id)) {
			atk(dmg, ls, target, caster);
            addEffect(false)(target)([EFFECT_POISON, poi, caster[ID], 2, false, WEAPON_FLAME_THROWER, target[ID]]);
			removeDead(state)(target);
		}
	};},
WEAPON_GAZOR : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(32, caster[MAG]) * crit;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			addEffect(false)(target)([EFFECT_POISON, dmg, caster[ID], 3, false, WEAPON_GAZOR, target[ID]]);
		}
		else if (getCellDistance(center, tgt) === 1) {
			addEffect(false)(target)([EFFECT_POISON, dmg * 0.833, caster[ID], 3, false, WEAPON_GAZOR, target[ID]]);
		}
		else if (getCellDistance(center, tgt) === 2) {
			addEffect(false)(target)([EFFECT_POISON, dmg * 0.666, caster[ID], 3, false, WEAPON_GAZOR, target[ID]]);
		}
		else if (getCellDistance(center, tgt) === 3) {
			addEffect(false)(target)([EFFECT_POISON, dmg * 0.5, caster[ID], 3, false, WEAPON_GAZOR, target[ID]]);
		}
	};},
WEAPON_GRENADE_LAUNCHER : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(49, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			atk(dmg * 0.75, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 2) {
			atk(dmg * 0.5, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_KATANA : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(77, caster[STR]) * crit;
	var shack = shackle(0.25 * crit, caster);
	var shackSTR = shackle(20 * crit, caster);
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			var debuff = shack(target);
			target[MP] -= debuff;
			target[TMP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_MP, debuff, caster[ID], 1, false, WEAPON_KATANA, target[ID]]);
			target[TP] -= debuff;
			target[TTP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_TP, debuff, caster[ID], 1, false, WEAPON_KATANA, target[ID]]);
			var debuffSTR = shackSTR(target);
			target[STR] -= debuffSTR;
			addEffect(false)(target)([EFFECT_SHACKLE_STRENGTH, debuffSTR, caster[ID], 1, false, WEAPON_KATANA, target[ID]]);
			removeDead(state)(target);
		}
	};},
WEAPON_LASER : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(51, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	var pos = caster[POS];
	var codir = sameDir(pos)(center);
	var all_id =@ aAppend(state[S_ALLIES])(state[S_ENEMIES]);
	return function(@target) {
		var tgt = target[POS];
		if (codir(tgt) && inRange(WEAPON_LASER)(pos)(tgt) && lineOfSight(pos, tgt, all_id)) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_MACHINE_GUN : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(22, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_MAGNUM : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(32.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_M_LASER : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(95, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	var pos = caster[POS];
	var codir = sameDir(pos)(center);
	var all_id =@ aAppend(state[S_ALLIES])(state[S_ENEMIES]);
	return function(@target) {
		var tgt = target[POS];
		if (codir(tgt) && inRange(WEAPON_M_LASER)(pos)(tgt) && lineOfSight(pos, tgt, all_id)) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_PISTOL : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(17.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
WEAPON_SHOTGUN : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(38, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_ACCELERATION : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = round(rawEff(0.7, caster[SCI]) * crit);
	return function(@target) {
		if (center == target[POS]) {
			target[TMP] += buff;
			target[MP] += buff;
			addEffect(true)(target)([EFFECT_BUFF_MP, buff, caster[ID], 3, false, CHIP_ACCELERATION, target[ID]]);
		}
	};},
CHIP_ADRENALINE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff0 = rawEff(0.5, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS] && target[ALLY]) {
            var buff = round(buff0);
			target[TTP] += buff;
			target[TP] += buff;
			addEffect(true)(target)([EFFECT_BUFF_TP, buff, caster[ID], 3, false, CHIP_ADRENALINE, target[ID]]);
		}
        else if (getCellDistance(center, target[POS]) == 1 && target[ALLY]) {
            var buff = round(buff0 * 0.5);
            target[TMP] += buff;
			target[MP] += buff;
			addEffect(true)(target)([EFFECT_BUFF_TP, buff, caster[ID], 3, false, CHIP_ADRENALINE, target[ID]]);
        }
	};},
CHIP_ANTIDOTE : function(@state, @caster, @center) {
	return function(@target) {
		var isNotPoison =@ function(@eff) {
			return eff[0] !== EFFECT_POISON; };
		target[EFFS] =@ aFilter(isNotPoison)(target[EFFS]);
	};},
CHIP_ARMOR : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var sh = rawEff(25, caster[RES]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[ASH] += sh;
			addEffect(true)(target)([EFFECT_ABSOLUTE_SHIELD, sh, caster[ID], 4, false, CHIP_ARMOR, target[ID]]);
		}
	};},
CHIP_ARMORING : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var boost = rawEff(22.5, caster[WIS]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[THP] += boost;
			target[HP] += boost;
		}
	};},
CHIP_BALL_AND_CHAIN : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var shack0 = shackle(0.4 * crit, caster);
	var shack1 = shackle(0.3 * crit, caster);
	var shack2 = shackle(0.2 * crit, caster);
	return function(@target) {
        var tgt = target[POS];
		if (center == tgt) {
			var debuff = shack0(target);
			target[TMP] -= debuff;
			target[MP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_MP, debuff, caster[ID], 2, false, CHIP_SOPORIFIC, target[ID]]);
		}
        else if (getCellDistance(center, tgt) == 1) {
			var debuff = shack1(target);
			target[TMP] -= debuff;
			target[MP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_TP, debuff, caster[ID], 2, false, CHIP_SOPORIFIC, target[ID]]);
		}
        else if (getCellDistance(center, tgt) == 2) {
			var debuff = shack2(target);
			target[TMP] -= debuff;
			target[MP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_TP, debuff, caster[ID], 2, false, CHIP_SOPORIFIC, target[ID]]);
		}

	};},
CHIP_BANDAGE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var rheal = rawEff(12.5, caster[WIS]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[HP] = heal(rheal, target);
		}
	};},
CHIP_BARK : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = round(rawEff(60, caster[SCI]) * crit);
	return function(@target) {
		if (center == target[POS]) {
			target[RES] += buff;
			addEffect(true)(target)([EFFECT_BUFF_RESISTANCE, buff, caster[ID], 2, false, CHIP_BARK, target[ID]]);
		}
	};},
CHIP_BURNING : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(82.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (!target[SUMMON]) { return; }
		var tgt = target[POS];
		if (target[ALLY] && getCellDistance(center, tgt) <= 3) {
			target[HP] = 0;
			removeDead(state)(target);
			return;
		}
		if (center == tgt) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			atk(dmg * 0.833, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 2) {
			atk(dmg * 0.666, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 3) {
			atk(dmg * 0.5, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_CARAPACE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var sh = rawEff(55, caster[RES]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[ASH] += sh;
			addEffect(true)(target)([EFFECT_ABSOLUTE_SHIELD, sh, caster[ID], 3, false, CHIP_CARAPACE, target[ID]]);
		}
	};},
CHIP_COLLAR : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = rawEff(60, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[WIS] += buff;
			addEffect(true)(target)([EFFECT_BUFF_WISDOM, buff, caster[ID], 2, false, CHIP_COLLAR, target[ID]]);
		}
	};},
CHIP_CURE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var rheal = rawEff(39, caster[WIS]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[HP] = heal(rheal, target);
		}
	};},
CHIP_DEVIL_STRIKE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(21.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
            for (var i = 0; i < 5; i++) {
			    atk(dmg, 0, target, caster);
                if (target[HP] <= 0) {
    			    removeDead(state)(target);
                    break;
                }
            }
		}
		else if (getCellDistance(center, tgt) === 1) {
            for (var i = 0; i < 5; i++) {
			    atk(dmg * 0.833, ls, target, caster);
                if (target[HP] <= 0) {
    			    removeDead(state)(target);
                    break;
                }
            }
		}
		else if (getCellDistance(center, tgt) === 2) {
            for (var i = 0; i < 5; i++) {
			    atk(dmg * 0.666, ls, target, caster);
                if (target[HP] <= 0) {
    			    removeDead(state)(target);
                    break;
                }
            }
		}
		else if (getCellDistance(center, tgt) === 3) {
            for (var i = 0; i < 5; i++) {
			    atk(dmg * 0.5, ls, target, caster);
                if (target[HP] <= 0) {
    			    removeDead(state)(target);
                    break;
                }
            }
		}
	};},
CHIP_DOPING : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = rawEff(40, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[STR] += buff;
			addEffect(true)(target)([EFFECT_BUFF_STRENGTH, buff, caster[ID], 4, false, CHIP_DOPING, target[ID]]);
		}
	};},
CHIP_DRIP : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var rheal = rawEff(39, caster[WIS]) * crit;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			target[HP] = heal(rheal, target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			target[HP] = heal(rheal * 0.75, target);
		}
		else if (getCellDistance(center, tgt) === 2) {
			target[HP] = heal(rheal * 0.5, target);
		}
	};},
CHIP_FEROCITY : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = rawEff(60, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[STR] += buff;
			addEffect(true)(target)([EFFECT_BUFF_STRENGTH, buff, caster[ID], 2, false, CHIP_FEROCITY, target[ID]]);
		}
	};},
CHIP_FERTILIZER : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var boost = rawEff(85, caster[WIS]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[THP] += boost;
			target[HP] += boost;
		}
	};},
CHIP_FIRE_BULB : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_FIRE_BULB);
	};},
CHIP_FLAME : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(26, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_FLASH : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(21.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			atk(dmg * 0.5, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_FORTRESS : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var sh = rawEff(9, caster[RES]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[RSH] += sh;
			addEffect(true)(target)([EFFECT_RELATIVE_SHIELD, sh, caster[ID], 3, false, CHIP_FORTRESS, target[ID]]);
		}
	};},
CHIP_FRACTURE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var shack = shackle(22.5 * crit, caster);
	return function(@target) {
		if (center == target[POS]) {
			var debuff = shack(target);
			target[STR] -= debuff;
			target[MAG] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_STRENGTH, debuff, caster[ID], 2, false, CHIP_FRACTURE, target[ID]]);
            addEffect(false)(target)([EFFECT_SHACKLE_MAGIC, debuff, caster[ID], 2, false, CHIP_FRACTURE, target[ID]]);
		}
	};},
CHIP_HEALER_BULB : function(@state, @caster, @center) {
	__obstacles[center] = true;
	var clevel = caster[LEVEL] - 1;
	var corder = caster[ORDER];
	var new_id = state[S_MAX_ID]++;
	var entity =@	[ THP	: 400 + round(100 * clevel / 300)
					, HP	: 400 + round(100 * clevel / 300)
					, TMP	: 3 + round(3 * clevel / 300)
					, MP	: 3 + round(3 * clevel / 300)
					, TTP	: 4 + round(4 * clevel / 300)
					, TP	: 4 + round(4 * clevel / 300)
					, SCI	: 0
					, STR	: 0
					, MAG	: 0
					, WIS	: 0 + round(300 * clevel / 300)
					, AGI	: 0 + round(100 * clevel / 300)
					, RES	: 0
					, ASH	: 0
					, RSH	: 0
					, RET : 0
					, POS	: center
					, TYPE: ENTITY_BULB
					, EFFS: []
					, CHIPS:	[ CHIP_BANDAGE: 0
								, CHIP_DRIP: 0
								, CHIP_CURE: 0
								, CHIP_VACCINE: 0 ]
					, EQ	: null
					, UNEQ: []
					, ID	: new_id
					, ORDER	: corder + 1
					, AREA_POINT	: getApplicableArea(AREA_POINT)(center)
					, AREA_CIRCLE_1	: getApplicableArea(AREA_CIRCLE_1)(center)
					, AREA_CIRCLE_2	: getApplicableArea(AREA_CIRCLE_2)(center)
					, AREA_CIRCLE_3	: getApplicableArea(AREA_CIRCLE_3)(center)
					, ALLY	: true
					, ENEMY	: false
					, SUMMON	: true
					, SUMMONER: caster[ID]
					, NAME	: 'healer_bulb'
					, LEVEL	: clevel
					];
	aIter(function(@x) { if (x[ORDER] > corder) { x[ORDER]++; }})(state[S_ALL]);
	push(state[S_ALLIES], new_id);
	state[S_ALL][new_id] = entity;
	insert(state[S_ORDER], new_id, corder);
	return function(@target) {
	};},
CHIP_HELMET : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var sh = rawEff(15, caster[RES]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[ASH] += sh;
			addEffect(true)(target)([EFFECT_ABSOLUTE_SHIELD, sh, caster[ID], 2, false, CHIP_HELMET, target[ID]]);
		}
	};},
CHIP_ICE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(18, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_ICEBERG : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(76, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			atk(dmg * 0.75, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 2) {
			atk(dmg * 0.5, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_ICED_BULB : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_ICED_BULB);
	};},
CHIP_INVERSION : function(@state, @caster, @center) {
	return function(@target) {
		if (target[POS] == center) {
			dswap(caster[POS], target[POS]);
			dswap(caster[AREA_POINT], target[AREA_POINT]);
			dswap(caster[AREA_CIRCLE_1], target[AREA_CIRCLE_1]);
			dswap(caster[AREA_CIRCLE_2], target[AREA_CIRCLE_2]);
			dswap(caster[AREA_CIRCLE_3], target[AREA_CIRCLE_3]);
		}
	};},
CHIP_LEATHER_BOOTS : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = round(rawEff(0.4, caster[SCI]) * crit);
	return function(@target) {
		if (center == target[POS]) {
			target[TMP] += buff;
			target[MP] += buff;
			addEffect(true)(target)([EFFECT_BUFF_MP, buff, caster[ID], 2, false, CHIP_LEATHER_BOOTS, target[ID]]);
		}
	};},
CHIP_LIBERATION : function(@state, @caster, @center) {
	return function(@target) {
		if (center == target[POS]) {
			aIter(removeEffect(target))(target[EFFS]);
		}
	};},
CHIP_LIGHTNING : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(41, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	var pos = caster[POS];
	return function(@target) {
		var tgt = target[POS];
		if (tgt === pos) {
			return;
		}
		else if (center === tgt) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			atk(dmg * 0.75, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 2) {
			atk(dmg * 0.5, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_LIGHTNING_BULB : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_LIGHTNING_BULB);
	};},
CHIP_LOAM : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var boost = rawEff(37.5, caster[WIS]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[THP] += boost;
			target[HP] += boost;
		}
	};},
CHIP_METALLIC_BULB : function(@state, @caster, @center) {
	__obstacles[center] = true;
	var clevel = caster[LEVEL] - 1;
	var corder = caster[ORDER];
	var new_id = state[S_MAX_ID]++;
	var entity =@	[ THP	: 800 + round(700 * clevel / 300)
					, HP	: 800 + round(700 * clevel / 300)
					, TMP	: 1 + round(2 * clevel / 300)
					, MP	: 1 + round(2 * clevel / 300)
					, TTP	: 5 + round(4 * clevel / 300)
					, TP	: 5 + round(4 * clevel / 300)
					, SCI	: 0 + round(200 * clevel / 300)
					, STR	: 0
					, MAG	: 0
					, WIS	: 0
					, AGI	: 0 + round(100 * clevel / 300)
					, RES	: 0 + round(300 * clevel / 300)
					, ASH	: 0
					, RSH	: 0
					, RET : 0
					, POS	: center
					, TYPE: ENTITY_BULB
					, EFFS: []
					, CHIPS:	[ CHIP_SHIELD: 0
								, CHIP_ARMOR: 0
								, CHIP_WALL: 0
								, CHIP_SEVEN_LEAGUE_BOOTS: 0 ]
					, EQ	: null
					, UNEQ: []
					, ID	: new_id
					, ORDER	: corder + 1
					, AREA_POINT	: getApplicableArea(AREA_POINT)(center)
					, AREA_CIRCLE_1	: getApplicableArea(AREA_CIRCLE_1)(center)
					, AREA_CIRCLE_2	: getApplicableArea(AREA_CIRCLE_2)(center)
					, AREA_CIRCLE_3	: getApplicableArea(AREA_CIRCLE_3)(center)
					, ALLY	: true
					, ENEMY	: false
					, SUMMON	: true
					, SUMMONER: caster[ID]
					, NAME	: 'metallic_bulb'
					, LEVEL	: clevel
					];
	aIter(function(@x) { if (x[ORDER] > corder) { x[ORDER]++; }})(state[S_ALL]);
	push(state[S_ALLIES], new_id);
	state[S_ALL][new_id] = entity;
	insert(state[S_ORDER], new_id, corder);
	return function(@target) {
	};},
CHIP_METEORITE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(75, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			atk(dmg * 0.75, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 2) {
			atk(dmg * 0.5, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_MIRROR : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff0 = rawEff(5, caster[AGI]) * crit;
	return function(@target) {
		if (center == target[POS] && target[ALLY]) {
            var buff = round(buff0);
			target[TMP] += buff;
			target[MP] += buff;
			addEffect(true)(target)([EFFECT_DAMAGE_RETURN, buff, caster[ID], 3, false, CHIP_MIRROR, target[ID]]);
		}
        else if (getCellDistance(center, target[POS]) == 1 && target[ALLY]) {
            var buff = round(buff0 * 0.75);
            target[TMP] += buff;
			target[MP] += buff;
			addEffect(true)(target)([EFFECT_DAMAGE_RETURN, buff, caster[ID], 3, false, CHIP_MIRROR, target[ID]]);
        }
        else if (getCellDistance(center, target[POS]) == 2 && target[ALLY]) {
            var buff = round(buff0 * 0.5);
            target[TMP] += buff;
			target[MP] += buff;
			addEffect(true)(target)([EFFECT_DAMAGE_RETURN, buff, caster[ID], 3, false, CHIP_MIRROR, target[ID]]);
        }
	};},
CHIP_MOTIVATION : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = round(rawEff(0.4, caster[SCI]) * crit);
	return function(@target) {
		if (center == target[POS]) {
			target[TTP] += buff;
			target[TP] += buff;
			addEffect(true)(target)([EFFECT_BUFF_TP, buff, caster[ID], 2, false, CHIP_MOTIVATION, target[ID]]);
		}
	};},
CHIP_PEBBLE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(9.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_PLAGUE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(45, caster[MAG]) * crit;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			addEffect(false)(target)([EFFECT_POISON, dmg, caster[ID], 3, false, CHIP_PLAGUE, target[ID]]);
		}
		else if (getCellDistance(center, tgt) === 1) {
			addEffect(false)(target)([EFFECT_POISON, dmg * 0.833, caster[ID], 3, false, CHIP_PLAGUE, target[ID]]);
		}
		else if (getCellDistance(center, tgt) === 2) {
			addEffect(false)(target)([EFFECT_POISON, dmg * 0.666, caster[ID], 3, false, CHIP_PLAGUE, target[ID]]);
		}
		else if (getCellDistance(center, tgt) === 3) {
			addEffect(false)(target)([EFFECT_POISON, dmg * 0.5, caster[ID], 3, false, CHIP_PLAGUE, target[ID]]);
		}
	};},
CHIP_PROTEIN : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = rawEff(30, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[STR] += buff;
			addEffect(true)(target)([EFFECT_BUFF_STRENGTH, buff, caster[ID], 2, false, CHIP_PROTEIN, target[ID]]);
		}
	};},
CHIP_PUNY_BULB : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_PUNY_BULB);
	};},
CHIP_RAGE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = round(rawEff(0.5, caster[SCI]) * crit);
	return function(@target) {
		if (center == target[POS]) {
			target[TTP] += buff;
			target[TP] += buff;
			addEffect(true)(target)([EFFECT_BUFF_TP, buff, caster[ID], 2, false, CHIP_MOTIVATION, target[ID]]);
		}
	};},
CHIP_RAMPART : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var sh = rawEff(7, caster[RES]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[RSH] += sh;
			addEffect(true)(target)([EFFECT_RELATIVE_SHIELD, sh, caster[ID], 3, false, CHIP_RAMPART, target[ID]]);
		}
	};}
CHIP_REFLEXES : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = rawEff(40, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[AGI] += buff;
			addEffect(true)(target)([EFFECT_BUFF_AGILITY, buff, caster[ID], 4, false, CHIP_REFLEXES, target[ID]]);
		}
	};},
CHIP_REGENERATION : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var rheal = rawEff(200, caster[WIS]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[HP] = heal(rheal, target);
		}
	};},
CHIP_REMISSION : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var rheal = rawEff(66, caster[WIS]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[HP] = heal(rheal, target);
		}
	};},
CHIP_RESURRECTION : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_RESURRECTION);
	};},
CHIP_ROCK : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(31.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_ROCKFALL : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(52, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 1) {
			atk(dmg * 0.75, ls, target, caster);
			removeDead(state)(target);
		}
		else if (getCellDistance(center, tgt) === 2) {
			atk(dmg * 0.5, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_ROCKY_BULB : function(@state, @caster, @center) {
	return function(@target) {
		compose(function(@name) { debugE("Item " + name + " not implemented."); })
				(getItemName)(CHIP_ROCKY_BULB);
	};},
CHIP_SEVEN_LEAGUE_BOOTS : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = round(rawEff(0.5, caster[SCI]) * crit);
	return function(@target) {
		if (center == target[POS] && target[TYPE] == ENTITY_LEEK) {
			target[TMP] += buff;
			target[MP] += buff;
			addEffect(true)(target)([EFFECT_BUFF_MP, buff, caster[ID], 4, false, CHIP_SEVEN_LEAGUE_BOOTS, target[ID]]);
		}
	};},
CHIP_SHIELD : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var sh = rawEff(20, caster[RES]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[ASH] += sh;
			addEffect(true)(target)([EFFECT_ABSOLUTE_SHIELD, sh, caster[ID], 3, false, CHIP_SHIELD, target[ID]]);
		}
	};},
CHIP_SHOCK : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(6, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_SLOW_DOWN : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var shack = shackle(0.3 * crit, caster);
	return function(@target) {
		if (center == target[POS]) {
			var debuff = shack(target);
			target[TMP] -= debuff;
			target[MP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_MP, debuff, caster[ID], 1, false, CHIP_SLOW_DOWN, target[ID]]);
		}
	};},
CHIP_SOLIDIFICATION : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = round(rawEff(55, caster[SCI]) * crit);
	return function(@target) {
		if (center == target[POS]) {
			target[RES] += buff;
			addEffect(true)(target)([EFFECT_BUFF_RESISTANCE, buff, caster[ID], 4, false, CHIP_SOLIDIFICATION, target[ID]]);
		}
	};},
CHIP_SOPORIFIC : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var shack0 = shackle(0.4 * crit, caster);
	var shack1 = shackle(0.3 * crit, caster);
	var shack2 = shackle(0.2 * crit, caster);
	return function(@target) {
        var tgt = target[POS];
		if (center == tgt) {
			var debuff = shack0(target);
			target[TTP] -= debuff;
			target[TP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_TP, debuff, caster[ID], 2, false, CHIP_SOPORIFIC, target[ID]]);
		}
        else if (getCellDistance(center, tgt) == 1) {
			var debuff = shack1(target);
			target[TTP] -= debuff;
			target[TP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_TP, debuff, caster[ID], 2, false, CHIP_SOPORIFIC, target[ID]]);
		}
        else if (getCellDistance(center, tgt) == 2) {
			var debuff = shack2(target);
			target[TTP] -= debuff;
			target[TP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_TP, debuff, caster[ID], 2, false, CHIP_SOPORIFIC, target[ID]]);
		}

	};},
CHIP_SPARK : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(10, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_STALACTITE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(65.5, caster[STR]) * crit;
	var ls = caster[WIS] / 1000;
	return function(@target) {
		if (center == target[POS]) {
			atk(dmg, ls, target, caster);
			removeDead(state)(target);
		}
	};},
CHIP_STEROID : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = rawEff(35, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[STR] += buff;
			addEffect(true)(target)([EFFECT_BUFF_STRENGTH, buff, caster[ID], 3, false, CHIP_STEROID, target[ID]]);
		}
	};}
CHIP_STRETCHING : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = rawEff(30, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[AGI] += buff;
			addEffect(true)(target)([EFFECT_BUFF_AGILITY, buff, caster[ID], 2, false, CHIP_STRETCHING, target[ID]]);
		}
	};},
CHIP_TELEPORTATION : function(@state, @caster, @center) {
	__obstacles[caster[POS]] = false;
	__obstacles[center] = true;
	caster[POS] = center;
	caster[AREA_POINT] = [center];
	caster[AREA_CIRCLE_1] = getApplicableArea(AREA_CIRCLE_1)(center);
	caster[AREA_CIRCLE_2] = getApplicableArea(AREA_CIRCLE_2)(center);
	caster[AREA_CIRCLE_3] = getApplicableArea(AREA_CIRCLE_3)(center);
	return function(@target) {
	};},
CHIP_THORN : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff0 = rawEff(3, caster[AGI]) * crit;
	return function(@target) {
		if (center == target[POS] && target[ALLY]) {
            var buff = round(buff0);
			target[TMP] += buff;
			target[MP] += buff;
			addEffect(true)(target)([EFFECT_DAMAGE_RETURN, buff, caster[ID], 3, false, CHIP_THORN, target[ID]]);
		}
        else if (getCellDistance(center, target[POS]) == 1 && target[ALLY]) {
            var buff = round(buff0 * 0.75);
            target[TMP] += buff;
			target[MP] += buff;
			addEffect(true)(target)([EFFECT_DAMAGE_RETURN, buff, caster[ID], 3, false, CHIP_THORN, target[ID]]);
        }
        else if (getCellDistance(center, target[POS]) == 2 && target[ALLY]) {
            var buff = round(buff0 * 0.5);
            target[TMP] += buff;
			target[MP] += buff;
			addEffect(true)(target)([EFFECT_DAMAGE_RETURN, buff, caster[ID], 3, false, CHIP_THORN, target[ID]]);
        }
	};},
CHIP_TOXIN : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(30, caster[MAG]) * crit;
	return function(@target) {
		var tgt = target[POS];
		if (center == tgt) {
			addEffect(false)(target)([EFFECT_POISON, dmg, caster[ID], 3, false, CHIP_TOXIN, target[ID]]);
		}
		else if (getCellDistance(center, tgt) === 1) {
			addEffect(false)(target)([EFFECT_POISON, dmg * 0.5, caster[ID], 3, false, CHIP_TOXIN, target[ID]]);
		}
	};},
CHIP_TRANQUILIZER : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var shack = shackle(0.3 * crit, caster);
	return function(@target) {
		if (center == target[POS]) {
			var debuff = shack(target);
			target[TTP] -= debuff;
			target[TP] -= debuff;
			addEffect(false)(target)([EFFECT_SHACKLE_TP, debuff, caster[ID], 1, false, CHIP_TRANQUILIZER, target[ID]]);
		}
	};},
CHIP_VACCINE : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var rheal = rawEff(34, caster[WIS]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			addEffect(true)(target)([EFFECT_HEAL, rheal, caster[ID], 3, false, CHIP_VACCINE, target[ID]]);
		}
	};},
CHIP_VENOM : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var dmg = rawEff(17.5, caster[MAG]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			addEffect(false)(target)([EFFECT_POISON, dmg, caster[ID], 2, false, CHIP_VENOM, target[ID]]);
		}
	};},
CHIP_WALL : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var sh = rawEff(5, caster[RES]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[RSH] += sh;
			addEffect(true)(target)([EFFECT_RELATIVE_SHIELD, sh, caster[ID], 2, false, CHIP_WALL, target[ID]]);
		}
	};},
CHIP_WARM_UP : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = rawEff(35, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS]) {
			target[AGI] += buff;
			addEffect(true)(target)([EFFECT_BUFF_AGILITY, buff, caster[ID], 3, false, CHIP_WARM_UP, target[ID]]);
		}
	};},
CHIP_WHIP : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff = round(rawEff(0.7, caster[SCI]) * crit);
	return function(@target) {
		if (center == target[POS]) {
			target[TTP] += buff;
			target[TP] += buff;
			addEffect(true)(target)([EFFECT_BUFF_TP, buff, caster[ID], 2, false, CHIP_WHIP, target[ID]]);
		}
	};},
CHIP_WINGED_BOOTS : function(@state, @caster, @center) {
	var crit = 1 + 0.4 * caster[AGI] / 1000;
	var buff0 = rawEff(0.5, caster[SCI]) * crit;
	return function(@target) {
		if (center == target[POS] && target[ALLY]) {
            var buff = round(buff0);
			target[TMP] += buff;
			target[MP] += buff;
			addEffect(true)(target)([EFFECT_BUFF_MP, buff, caster[ID], 3, false, CHIP_WINGED_BOOTS, target[ID]]);
		}
        else if (getCellDistance(center, target[POS]) == 1 && target[ALLY]) {
            var buff = round(buff0 * 0.5);
            target[TMP] += buff;
			target[MP] += buff;
			addEffect(true)(target)([EFFECT_BUFF_MP, buff, caster[ID], 3, false, CHIP_WINGED_BOOTS, target[ID]]);
        }
	};},
];


///////////////////////////////////////////////////////////////////////////
global chipType =	[ "attack"	: [1, 19, 18, 2, 7, 6, 5, 30, 33, 32, 31, 36, 85, 105]
					, "heal"	: [3, 4, 10, 11, 89, 35, 67, 80, 90, 84]
					, "shield"	: [21, 23, 20, 24, 22, 29, 81]
					, "buff"	: [9, 8, 15, 14, 25, 12, 16, 88, 96, 28, 26, 91, 102, 13, 103, 17, 104]
					, "debuff"	: [92, 94, 106, 93, 95]
					, "bulb"	: [73, 76, 77, 75, 79, 74, 78]
					, "poison"	: [97, 98, 99]
					, "mirror"	: [100, 101]
					, "tactic"	: [34, 110, 59, 68] ];

global cAttaques =
[1 : true, 19 : true, 18 : true, 2 : true, 7 : true, 6 : true, 5 : true, 30 : true, 33 : true, 32 : true, 31 : true, 36 : true, 85 : true, 105 : true];

global cSoins =
[3 : true, 4 : true, 10 : true, 11 : true, 89 : true, 35 : true, 67 : true, 80 : true, 90 : true, 84 : true];

global cProtections =
[21 : true, 23 : true, 20 : true, 24 : true, 22 : true, 29 : true, 81 : true];

global cBoosts =
[9 : true, 8 : true, 15 : true, 14 : true, 25 : true, 12 : true, 16 : true, 88 : true, 96 : true, 28 : true, 26 : true, 91 : true, 102 : true, 13 : true, 103 : true, 17 : true, 104 : true];

global cBulbes =
[73 : true, 76 : true, 77 : true, 75 : true, 79 : true, 74 : true, 78 : true];

global cDebuffs =
[92 : true, 94 : true, 106 : true, 93 : true, 95 : true];

global cTactique =
[34 : true, 110 : true, 59 : true, 68 : true];

global cPoisons =
[97 : true, 98 : true, 99 : true];

global cMiroirs =
[100 : true, 101 : true];
///////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////


global ITEMS_TARGETS = [
WEAPON_AXE : function(@state) {
	var cando =@ canTargetCell(WEAPON_AXE)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && cando(x[POS]); })
		(access(POS))
		(state[S_ALL]);
},
WEAPON_B_LASER : function(@state) {
	var pos = getSelf(state)[POS];
	if (pos === null) { return []; }
	var cx = getCellX(pos);
	var cy = getCellY(pos);
	var minr = 2;
	var ret = [];
	var weapon = WEAPON_B_LASER;

	var codir = sameDir(pos);
	var all_id =@ aAppend(state[S_ALLIES])(state[S_ENEMIES]);
	var all_entities = aFilter(function(@x) {
			var tgt =@ x[POS];
			return !x[SUMMON]
				&& x[NAME] !== 'puny_bulb'
				&& inRange(weapon)(pos)(tgt)
				&& lineOfSight(pos, tgt, all_id); })(state[S_ALL]);

	var trigg = getCellFromXY(cx + minr, cy);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	trigg =@ getCellFromXY(cx - minr, cy);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	trigg =@ getCellFromXY(cx, cy + minr);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	trigg =@ getCellFromXY(cx, cy - minr);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	return ret;
},
WEAPON_BROADSWORD : function(@state) {
	var canDo =@ canTargetCell(WEAPON_BROADSWORD)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		(access(POS))
		(state[S_ALL]);
},
WEAPON_DESTROYER : function(@state) {
	var canDo =@ canTargetCell(WEAPON_DESTROYER)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
WEAPON_DOUBLE_GUN : function(@state) {
	var canDo =@ canTargetCell(WEAPON_DOUBLE_GUN)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
WEAPON_ELECTRISOR : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_1]; })
		(canTargetCell(WEAPON_ELECTRISOR)(getSelf(state)[POS]))
		(state[S_ALL]);
},
WEAPON_FLAME_THROWER : function(@state) {
	var pos = getSelf(state)[POS];
	var cx = getCellX(pos);
	var cy = getCellY(pos);
	var minr = 2;
	var ret = [];
	var weapon = WEAPON_FLAME_THROWER;

	var codir = sameDir(pos);
	var all_id =@ aAppend(state[S_ALLIES])(state[S_ENEMIES]);
	var all_entities = aFilter(function(@x) {
			var tgt =@ x[POS];
			return x[ENEMY]
				&& !x[SUMMON]
				&& inRange(weapon)(pos)(tgt)
				&& lineOfSight(pos, tgt, all_id); })
		(state[S_ALL]);

	var trigg = getCellFromXY(cx + minr, cy);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	trigg =@ getCellFromXY(cx - minr, cy);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	trigg =@ getCellFromXY(cx, cy + minr);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	trigg =@ getCellFromXY(cx, cy - minr);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	return ret;
},
WEAPON_GAZOR : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ALLY] || x[SUMMON]) { return []; }
		return x[AREA_CIRCLE_3]; })
		(canTargetCell(WEAPON_GAZOR)(getSelf(state)[POS]))
		(state[S_ALL]);
},
WEAPON_GRENADE_LAUNCHER : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_2]; })
		(canTargetCell(WEAPON_GRENADE_LAUNCHER)(getSelf(state)[POS]))
		(state[S_ALL]);
},
WEAPON_KATANA : function(@state) {
	var canDo =@ canTargetCell(WEAPON_KATANA)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
WEAPON_LASER : function(@state) {
	var pos = getSelf(state)[POS];
	var cx = getCellX(pos);
	var cy = getCellY(pos);
	var minr = 2;
	var ret = [];
	var weapon = WEAPON_LASER;

	var codir = sameDir(pos);
	var all_id =@ aAppend(state[S_ALLIES])(state[S_ENEMIES]);
	var all_entities = aFilter(function(@x) {
			var tgt =@ x[POS];
			return x[ENEMY]
				&& x[NAME] !== 'puny_bulb'
				&& inRange(weapon)(pos)(tgt)
				&& lineOfSight(pos, tgt, all_id); })
		(state[S_ALL]);

	var trigg = getCellFromXY(cx + minr, cy);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	trigg =@ getCellFromXY(cx - minr, cy);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	trigg =@ getCellFromXY(cx, cy + minr);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	trigg =@ getCellFromXY(cx, cy - minr);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	return ret;
},
WEAPON_MACHINE_GUN : function(@state) {
	var canDo =@ canTargetCell(WEAPON_MACHINE_GUN)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
WEAPON_MAGNUM : function(@state) {
	var canDo =@ canTargetCell(WEAPON_MAGNUM)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
WEAPON_M_LASER : function(@state) {
	var pos = getSelf(state)[POS];
	var cx = getCellX(pos);
	var cy = getCellY(pos);
	var minr = 4;
	var ret = [];
	var weapon = WEAPON_M_LASER;

	var codir = sameDir(pos);
	var all_id =@ aAppend(state[S_ALLIES])(state[S_ENEMIES]);
	var all_entities = aFilter(function(@x) {
			var tgt =@ x[POS];
			return x[ENEMY]
				&& x[NAME] !== 'puny_bulb'
				&& inRange(weapon)(pos)(tgt)
				&& lineOfSight(pos, tgt, all_id); })
		(state[S_ALL]);

	var trigg = getCellFromXY(cx + minr, cy);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	trigg =@ getCellFromXY(cx - minr, cy);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	trigg =@ getCellFromXY(cx, cy + minr);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	trigg =@ getCellFromXY(cx, cy - minr);
	if (trigg !== null) {
		var codir2 =@ codir(trigg);
		if (lineOfSight(pos, trigg) && aAny(function(@target) {
				return codir2(target[POS]);
			})(all_entities)) {
			push(ret, trigg);
		}
	}

	return ret;
},
WEAPON_PISTOL : function(@state) {
	var canDo =@ canTargetCell(WEAPON_PISTOL)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
WEAPON_SHOTGUN : function(@state) {
	var canDo =@ canTargetCell(WEAPON_SHOTGUN)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_ACCELERATION : function(@state) {
	var canDo =@ canTargetCell(CHIP_ACCELERATION)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_ADRENALINE : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ENEMY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_1]; })
		(canTargetCell(CHIP_ADRENALINE)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_ANTIDOTE : function(@state) {
	var canDo =@ canTargetCell(CHIP_ANTIDOTE)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_ARMOR : function(@state) {
	var canDo =@ canTargetCell(CHIP_ARMOR)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_ARMORING : function(@state) {
	var canDo =@ canTargetCell(CHIP_ARMORING)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_BALL_AND_CHAIN : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_2]; })
		(canTargetCell(CHIP_BALL_AND_CHAIN)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_BANDAGE : function(@state) {
	var canDo =@ canTargetCell(CHIP_BANDAGE)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && x[HP] != x[THP] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_BARK : function(@state) {
	var canDo =@ canTargetCell(CHIP_BARK)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_BURNING : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ALLY] || !x[SUMMON] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_3]; })
		(canTargetCell(CHIP_BURNING)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_CARAPACE : function(@state) {
	var canDo =@ canTargetCell(CHIP_CARAPACE)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_COLLAR : function(@state) {
	var canDo =@ canTargetCell(CHIP_COLLAR)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_CURE : function(@state) {
	var canDo =@ canTargetCell(CHIP_CURE)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && x[HP] != x[THP] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_DEVIL_STRIKE : function(@state) {
	return [getSelf(state)[POS]];
},
CHIP_DOPING : function(@state) {
	var canDo =@ canTargetCell(CHIP_DOPING)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_DRIP : function(@state) {
	return aFilterConcatMap(function(@x){
			return (x[ENEMY] || x[NAME] === 'puny_bulb' || x[HP] == x[THP]) ? [] : x[AREA_CIRCLE_2]; })
		(canTargetCell(CHIP_DRIP)(getSelf(state)[POS]))
		(state[S_ALL]);
},
/* CHIP_DEVIL_STRIKE : @state ->
	[getSelf(state).pos]
,
CHIP_DOPING : @state => {
	let canDo =@ canTargetCell(CHIP_DOPING)(getSelf(state).pos)
	aMapFilter(@x -> x.ally && !x.summon && canDo(x.pos))
		  (@x -> x.pos)
		  (state.s_all)
},
CHIP_DRIP : @state ->
	aFilterConcatMap(@x -> (x.enemy || x.name === 'puny_bulb' || x.hp == x.thp) ? [] : x.area_circle_2 )
		(canTargetCell(CHIP_DRIP)(getSelf(state).pos))
		(state.s_all);
},*/
CHIP_FEROCITY : function(@state) {
	var canDo =@ canTargetCell(CHIP_FEROCITY)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_FERTILIZER : function(@state) {
	var canDo =@ canTargetCell(CHIP_FERTILIZER)(getSelf(state)[POS]);
	return daMap(access(POS))
		  (aFilter(function(@x){ return x[ALLY] && x[SUMMON] && canDo(x[POS]); })
		  (state[S_ALL]));
},
CHIP_FIRE_BULB : function(@state) {
	return getCellsToUseChipOnCell(CHIP_FIRE_BULB, getSelf(state)[POS]);
},
CHIP_FLAME : function(@state) {
	var canDo =@ canTargetCell(CHIP_FLAME)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_FLASH : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_1]; })
		(canTargetCell(CHIP_FLASH)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_FORTRESS : function(@state) {
	var canDo =@ canTargetCell(CHIP_FORTRESS)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_FRACTURE : function(@state) {
	var canDo =@ canTargetCell(CHIP_FRACTURE)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_HEALER_BULB : function(@state) {
	return getCellsToUseChipOnCell(CHIP_HEALER_BULB, getSelf(state)[POS]);
},
CHIP_HELMET : function(@state) {
	var canDo =@ canTargetCell(CHIP_HELMET)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_ICE : function(@state) {
	var canDo =@ canTargetCell(CHIP_ICE)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_ICEBERG : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ALLY] || x[SUMMON]) { return []; }
		return x[AREA_CIRCLE_2]; })
		(canTargetCell(CHIP_ICEBERG)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_ICED_BULB : function(@state) {
	return getCellsToUseChipOnCell(CHIP_ICED_BULB, getSelf(state)[POS]);
},
CHIP_INVERSION : function(@state) {
	var canDo =@ canTargetCell(CHIP_INVERSION)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_LEATHER_BOOTS : function(@state) {
	var canDo =@ canTargetCell(CHIP_LEATHER_BOOTS)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_LIBERATION : function(@state) {
	var canDo =@ canTargetCell(CHIP_LIBERATION)(getSelf(state)[POS]);
	return aMapFilter(function(@x){
		return canDo(x[POS])
			&& (inArray(state[S_ALLIES], x[ID]) ?
			  aAny(function(@y){return negativeEffects[y[0]];})(x[EFFS])
			: aAny(function(@y){return positiveEffects[y[0]];})(x[EFFS]));
		})
		(access(POS))
		(state[S_ALL]);
},
CHIP_LIGHTNING : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_2]; })
		(canTargetCell(CHIP_LIGHTNING)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_LIGHTNING_BULB : function(@state) {
	return getCellsToUseChipOnCell(CHIP_LIGHTNING_BULB, getSelf(state)[POS]);
},
CHIP_LOAM : function(@state) {
	var canDo =@ canTargetCell(CHIP_LOAM)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && x[SUMMON]; })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_METALLIC_BULB : function(@state) {
	return getCellsToUseChipOnCell(CHIP_METALLIC_BULB, getSelf(state)[POS]);
},
CHIP_METEORITE : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_2]; })
		(canTargetCell(CHIP_METEORITE)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_MIRROR : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ENEMY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_2]; })
		(canTargetCell(CHIP_MIRROR)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_MOTIVATION : function(@state) {
	var canDo =@ canTargetCell(CHIP_MOTIVATION)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_PEBBLE : function(@state) {
	var canDo =@ canTargetCell(CHIP_PEBBLE)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_PLAGUE : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ALLY] || x[SUMMON]) { return []; }
		return x[AREA_CIRCLE_3]; })
		(canTargetCell(CHIP_PLAGUE)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_PROTEIN : function(@state) {
	var canDo =@ canTargetCell(CHIP_PROTEIN)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_PUNY_BULB : function(@state) {
	return getCellsToUseChipOnCell(CHIP_PUNY_BULB, getSelf(state)[POS]);
},
CHIP_RAGE : function(@state) {
	var canDo =@ canTargetCell(CHIP_RAGE)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_RAMPART : function(@state) {
	var canDo =@ canTargetCell(CHIP_RAMPART)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_REFLEXES : function(@state) {
	var canDo =@ canTargetCell(CHIP_REFLEXES)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_REGENERATION : function(@state) {
	var healValue = round(200 * (1 + getSelf(state)[WIS] / 100));
	var canDo =@ canTargetCell(CHIP_REGENERATION)(getSelf(state)[POS]);
	return aMapFilter(function(@x){
				if (x[ALLY] && !x[SUMMON]) {
					var hp = x[HP], thp = x[THP];
					return (hp < 350 || (hp / thp) < 0.45 || (thp - hp) >= healValue)
						&& canDo(x[POS]);
				}
				return false;
			})
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_REMISSION : function(@state) {
	var canDo =@ canTargetCell(CHIP_REMISSION)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_RESURRECTION : CHIP_RESURRECTION,
CHIP_ROCK : function(@state) {
	var canDo =@ canTargetCell(CHIP_ROCK)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_ROCKFALL : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_2]; })
		(canTargetCell(CHIP_ROCKFALL)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_ROCKY_BULB : function(@state) {
	return getCellsToUseChipOnCell(CHIP_ROCKY_BULB, getSelf(state)[POS]);
},
CHIP_SEVEN_LEAGUE_BOOTS : function(@state) {
	var canDo =@ canTargetCell(CHIP_SEVEN_LEAGUE_BOOTS)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_SHIELD : function(@state) {
	var canDo =@ canTargetCell(CHIP_SHIELD)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_SHOCK : function(@state) {
	var canDo =@ canTargetCell(CHIP_SHOCK)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_SLOW_DOWN : function(@state) {
	var canDo =@ canTargetCell(CHIP_SLOW_DOWN)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_SOLIDIFICATION : function(@state) {
	var canDo =@ canTargetCell(CHIP_SOLIDIFICATION)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_SOPORIFIC : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ALLY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_2]; })
		(canTargetCell(CHIP_SOPORIFIC)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_SPARK : function(@state) {
	var canDo =@ canTargetCell(CHIP_SPARK)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_STALACTITE : function(@state) {
	var cando =@ canTargetCell(CHIP_STALACTITE)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && x[NAME] !== 'puny_bulb' && cando(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_STEROID : function(@state) {
	var canDo =@ canTargetCell(CHIP_STEROID)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_STRETCHING : function(@state) {
	var canDo =@ canTargetCell(CHIP_STRETCHING)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_TELEPORTATION : function(@state) {
	return getCellsToUseChipOnCell(CHIP_TELEPORTATION, getSelf(state)[POS]);
},
CHIP_THORN : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ENEMY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_2]; })
		(canTargetCell(CHIP_THORN)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_TOXIN : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ALLY] || x[SUMMON]) { return []; }
		return x[AREA_CIRCLE_1]; })
		(canTargetCell(CHIP_TOXIN)(getSelf(state)[POS]))
		(state[S_ALL]);
},
CHIP_TRANQUILIZER : function(@state) {
	var canDo =@ canTargetCell(CHIP_TRANQUILIZER)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_VACCINE : function(@state) {
	var canDo =@ canTargetCell(CHIP_VACCINE)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_VENOM : function(@state) {
	var canDo =@ canTargetCell(CHIP_VENOM)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ENEMY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_WALL : function(@state) {
	var canDo =@ canTargetCell(CHIP_WALL)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_WARM_UP : function(@state) {
	var canDo =@ canTargetCell(CHIP_WARM_UP)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && !x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_WHIP : function(@state) {
	var canDo =@ canTargetCell(CHIP_WHIP)(getSelf(state)[POS]);
	return aMapFilter(function(@x){ return x[ALLY] && x[SUMMON] && canDo(x[POS]); })
		  (access(POS))
		  (state[S_ALL]);
},
CHIP_WINGED_BOOTS : function(@state) {
	return aFilterConcatMap(function(@x){
		if (x[ENEMY] || x[NAME] === 'puny_bulb') { return []; }
		return x[AREA_CIRCLE_1]; })
		(canTargetCell(CHIP_WINGED_BOOTS)(getSelf(state)[POS]))
		(state[S_ALL]);
},
];


///////////////////////////////////////////////////////////////////////////


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
	return dmgAvg * critMultiplier * leek[TP];
};}

/**
* averageDmgFromLeeksOnCell : (LeekState -> Bool) -> Cell -> Array LeekState -> Int
*/
function averageDmgFromLeeksOnCell(@p) { return function(@cell) { return function(@leeks) {
	return arrayFoldLeft(leeks, function(@acc, @l) {
		return acc + (p(l) ? averageDmgFromLeekOnCell(cell)(l) : 0);
	}, 0);
};};}

///////////////////////////////////////////////////////////////////////////

global opin_move = 0, opout_move = 0;
global opin_attack = 0, opout_attack = 0;
global opin_select = 0, opout_select = 0;
global opin_mutate = 0, opout_mutate = 0;

global totalPop;
totalPop =@ 0;

global ACTIONS_QUEUE = [];
ACTIONS_QUEUE = [];
//global ACTION = 0, STATE = 1, GENERATOR = 2;

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
	if (inArray(itemList, null)) {
		debug(itemList);
		debug(gameState);
	}
	var self =@ getSelf(gameState);
	var pos = self[POS];
	return aMap(delay(function(@item) {
		var targets =@ getTargets(gameState, item);
		return daMap(function(target) {
			return function() {
				var ret = [];
				var cost = getItemCost(item);
				var eq = self[EQ];
				if (isWeapon(item) && item !== eq) {
					cost += 1;
					push(ret, delay(setWeapon)(item));
					removeElement(self[UNEQ], item);
					if (eq !== null) {
						push(self[UNEQ], eq);
					}
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
							//debug(getNextPlayer());
							//mark(getCell(getNextPlayer()), COLOR_RED);
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
		var dmgOnSelf = averageDmgFromLeeksOnCell(access(ENEMY))(xs[oID][POS])(xs);
		xs[oID][HP] -= dmgOnSelf;

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
		var xSelfHPR = xs[oID] === null ? -log(0) : xs[oID][THP] / min(xs[oID][THP], 0.9 * xs[oID][HP] + (-00));

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
			 * (1 + 0.5 * oneOr(oaAGI)(xaAGI))
			 * (1 + oneOr(xeTTP)(oeTTP))
			 * (1 + oneOr(xeTMP)(oeTMP))
			 * (1 + infDiv(oaTTP)(xaTTP))
			 * (1 + infDiv(oaTMP)(xaTMP));
	});
}

/*
function evaluateState2(@state) {
		var xs =@ state[S_ALL];
		var dmgOnSelf = averageDmgFromLeeksOnCell(access(ENEMY))(xs[oID][POS])(xs);
		xs[oID][HP] -= dmgOnSelf;

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
		var xSelfHPR = xs[oID] === null ? -log(0) : xs[oID][THP] / min(xs[oID][THP], 0.9 * xs[oID][HP] + (-00));

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

		return 1 * 1
			 + 1 * xeDist
			 + 1 * xaDist
			 + 1 * ninfDiv(xeLifes)(oeLifes)
			 + 1 * ninfDiv(xeAlives)(oeAlives)
			 + 1 * xeminHPR
			 + 1 * infDiv(oaLifes)(xaLifes)
			 + 1 * infDiv(oaAlives)(xaAlives)
			 + 1 * xaminHPR
			 + 1 * xSelfHPR
			 + 1 * oneOr(oaASH)(xaASH)
			 + 1 * oneOr(oaRSH)(xaRSH)
			 + 1 * oneOr(oaSTR)(xaSTR)
			 + 1 * oneOr(oaAGI)(xaAGI)
			 + 1 * oneOr(xeTTP)(oeTTP)
			 + 1 * oneOr(xeTMP)(oeTMP)
			 + 1 * infDiv(oaTTP)(xaTTP)
			 + 1 * infDiv(oaTMP)(xaTMP);
}*/

function main() {

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
	opin_mutate = 0;
	opout_mutate = 0;
	var opin_evaluate = 0, opout_evaluate = 0;
	var opin_prio = 0, opout_prio = 0;

	var maxOp = 19000000;
	var nbAncestors = 10;
	var nbMutants = 10;
	var nbNewcomers = 10;
	var maxPop = nbAncestors + nbMutants + nbNewcomers;
	while (getOperations() < maxOp && count(population) < maxPop) {
		__obstacles = baseObstacles;
		opin_mutate += getOperations();
		var actions =@ mutateActions([[]], gameState);
		opout_mutate += getOperations();
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
		population =@ pqTake(population)(nbAncestors);
		var i = 0;
		var ancestors = [];
		ancestors += population;
		var cyclicAncestors = cyclicLookup(ancestors);
		while (getOperations() < maxOp && i < nbMutants) {
			__obstacles = baseObstacles;
			opin_mutate += getOperations();
			var actions =@ mutateActions(cyclicAncestors(i)(null), gameState);
			opout_mutate += getOperations();
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
		while (getOperations() < maxOp && count(population) < maxPop) {
			__obstacles = baseObstacles;
			opin_mutate += getOperations();
			var actions =@ mutateActions([[]], gameState);
			opout_mutate += getOperations();
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
		debugC((opout_mutate - opin_mutate) * 100 / OPERATIONS_LIMIT, 0);
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

	if (getWeapon() === null) {
		setWeapon(arraySort(getWeapons(), function(@x, @y) {
			var xr = getWeaponMaxRange(x);
			var yr = getWeaponMaxRange(y);
			return xr > yr ? -1 : xr === yr ? 0 : 1;
		})[0]);
	}
}

debug(getOperations() + 'op');


/////////////////////////////////////////////////////////////////////
function equipWeapon(weapon) { return function(tp) {
	if (getWeapon() !== weapon) {
		setWeapon(weapon); tp -= 1;} // Warning: costs 1 TP
	return tp;
};}

/////////////////////////////////////////////////////////////////////

global COLOR_YELLOW = getColor(255, 255, 0);
global COLOR_WHITE = getColor(255, 255, 255);
global COLOR_CYAN = getColor(0, 255, 255);
global BEST_COLOR = getColor(252, 15, 192);
