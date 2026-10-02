// Player Move Head Redux v1.0
// Classic GTA San Andreas 1.0 US + CLEO Redux
// Original mod: LINK/2012
// Improvements: Junior_Djjr
// CLEO Redux port/remaster: Flaqko
//
// This release deliberately does NOT manipulate CJ's CPed, IK, bones, heading,
// animation quaternions, or look tasks.
//
// GTA SA already has a native behavior where holding NumPad 6 lets CJ's head
// follow mouse/camera movement. While CJ has a supported melee or throwable
// weapon equipped and the normal Aim control is held, this script simply holds
// VK_NUMPAD6 for GTA and releases it when Aim ends. The goal is to reuse the
// exact vanilla behavior that already works.

"use strict";

const MOD = "PlayerMoveHeadRedux";
const VERSION = "v1.0";
const DEBUG = false;

const PLAYER_ID = 0;
const AIM_BUTTON_ID = 6;
const VK_NUMPAD6 = 0x66; // 102
const HEAD_LOOK_WEAPONS = new Set([
    0, // fist
    1, // brass knuckles
    2, // golf club
    3, // nightstick
    4, // knife
    5, // baseball bat
    6, // shovel
    7, // pool cue
    8, // katana
    9,  // chainsaw
    16, // grenade
    17, // tear gas
    18, // molotov cocktail
    39  // satchel charge
]);

const WEAPON_NAMES = {
    0: "Fist",
    1: "Brass Knuckles",
    2: "Golf Club",
    3: "Nightstick",
    4: "Knife",
    5: "Baseball Bat",
    6: "Shovel",
    7: "Pool Cue",
    8: "Katana",
    9: "Chainsaw",
    16: "Grenade",
    17: "Tear Gas",
    18: "Molotov Cocktail",
    39: "Satchel Charge"
};

let injectedNum6 = false;
let aimEpisode = false;
let num6WasPhysical = false;
let inputErrorLogged = false;

function dbg(message) {
    if (DEBUG) log(`[${MOD}] ${message}`);
}

function getCJ() {
    try {
        const cj = native("GET_PLAYER_CHAR", PLAYER_ID);
        return Number.isFinite(cj) ? cj : -1;
    } catch (e) {
        return -1;
    }
}

function isPlayerReady(cj) {
    try {
        if (cj < 0) return false;
        if (!native("IS_PLAYER_PLAYING", PLAYER_ID)) return false;
        if (!native("IS_PLAYER_CONTROL_ON", PLAYER_ID)) return false;
        if (native("IS_CHAR_DEAD", cj)) return false;
        if (native("IS_CHAR_IN_ANY_CAR", cj)) return false;
        return true;
    } catch (e) {
        return false;
    }
}

function isNum6Pressed() {
    try {
        return !!native("IS_KEY_PRESSED", VK_NUMPAD6);
    } catch (e) {
        return false;
    }
}

function holdNum6() {
    if (injectedNum6) return true;

    try {
        native("HOLD_KEY", VK_NUMPAD6);
        injectedNum6 = true;
        dbg("Synthetic Num6 DOWN - GTA native head-look control engaged.");
        return true;
    } catch (e) {
        if (!inputErrorLogged) {
            inputErrorLogged = true;
            log(`[${MOD}] HOLD_KEY failed: ${e}`);
        }
        return false;
    }
}

function releaseNum6(reason) {
    if (!injectedNum6) return;

    try {
        native("RELEASE_KEY", VK_NUMPAD6);
    } catch (e) {
        if (!inputErrorLogged) {
            inputErrorLogged = true;
            log(`[${MOD}] RELEASE_KEY failed: ${e}`);
        }
    }

    injectedNum6 = false;
    dbg(`Synthetic Num6 UP (${reason}).`);
}

function mainTick() {
    const cj = getCJ();

    if (!isPlayerReady(cj)) {
        releaseNum6("player unavailable");
        aimEpisode = false;
        num6WasPhysical = false;
        return;
    }

    let weapon = -1;
    let aimHeld = false;

    try {
        weapon = native("GET_CURRENT_CHAR_WEAPON", cj);
        aimHeld = !!native("IS_BUTTON_PRESSED", PLAYER_ID, AIM_BUTTON_ID);
    } catch (e) {
        releaseNum6("input unavailable");
        aimEpisode = false;
        return;
    }

    const supportedAim = aimHeld && HEAD_LOOK_WEAPONS.has(weapon);

    if (!supportedAim) {
        releaseNum6(aimHeld ? `weapon ${weapon}` : "Aim released");
        if (aimEpisode) {
            dbg(`Supported Aim ended (weapon=${weapon} ${WEAPON_NAMES[weapon] || "Unknown"}).`);
        }
        aimEpisode = false;
        num6WasPhysical = false;
        return;
    }

    if (!aimEpisode) {
        aimEpisode = true;
        num6WasPhysical = isNum6Pressed();
        dbg(`Supported Aim detected: ${WEAPON_NAMES[weapon] || "Weapon " + weapon} (${weapon}). Num6 already held=${num6WasPhysical}.`);
    }

    // If the user is physically holding Num6, leave their key alone. If not,
    // inject the same held state GTA normally receives from Num6.
    if (!isNum6Pressed()) {
        holdNum6();
    }
}

log(`[${MOD}] ${VERSION} loaded - native Num6 head-look while aiming with supported melee and throwable weapons.`);
setInterval(mainTick, 0);
