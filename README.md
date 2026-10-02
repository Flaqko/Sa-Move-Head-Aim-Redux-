# Player Move Head Redux v1.0

A CLEO Redux port/remaster of **Player Move Head** for classic **Grand Theft Auto: San Andreas 1.0**.

Original mod: **LINK / 2012**  
Original improvements: **Junior_Djjr**  
CLEO Redux port/remaster: **Flaqko**

## About

GTA San Andreas already contains a native behavior where holding **NumPad 6** allows CJ's head to follow mouse/camera movement.

Player Move Head Redux reuses that native behavior instead of replacing it with custom IK or bone manipulation. While CJ holds the normal **Aim** control with a supported melee or throwable weapon, the script temporarily mirrors a held NumPad 6 input. Releasing Aim immediately releases the synthetic NumPad 6 input.

This keeps CJ's normal body orientation intact while using the game's own head-look behavior.

## Supported weapons

### Unarmed / melee

- Fist
- Brass Knuckles
- Golf Club
- Nightstick
- Knife
- Baseball Bat
- Shovel
- Pool Cue
- Katana
- Chainsaw

### Throwables

- Grenade
- Tear Gas
- Molotov Cocktail
- Satchel Charge

The Satchel Charge Detonator is intentionally excluded because it is not an aimed/thrown weapon.

## Installation

1. Install **CLEO Redux** and its **Input** plugin.
2. Copy the `PlayerMoveHeadRedux` folder into your GTA San Andreas `CLEO` folder.
3. Start the game.

No `[mem]` or `[fs]` permissions are required.

## Usage

Equip any supported weapon, hold the normal **Aim** control, and move the camera around CJ. His head will follow the camera using GTA San Andreas' native NumPad 6 head-look behavior.

## Technical notes

- Uses CLEO Redux `HOLD_KEY` / `RELEASE_KEY` to mirror NumPad 6.
- Does not modify CJ's body heading.
- Does not call custom ped look/aim IK routines.
- Does not directly rotate head or neck bones.
- Does not use memory patches.
- If NumPad 6 is already physically held, the script leaves the user's key state alone.

## Version history

### v1.0

- First stable standalone release.
- Native head-look while aiming unarmed.
- Added supported melee weapons.
- Added grenade, tear gas, Molotov, and satchel charge support.
- Uses the proven native NumPad 6 input method instead of custom head/IK manipulation.
- Release debug logging disabled.
