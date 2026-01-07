# versecraft architecture (v1 full skeleton)

## doctrines
- one screen mounted at a time (no hidden screens)
- global world screens may use global skins
- story screens do not inherit global skins (story-themed frames only)
- naming is lowercase kebab-case everywhere for ids/paths/persisted keys
- global world has no stats; stats exist only in story runtime
- constraints: 3 equipped slots, 20 carry, item-name<=24, slot-label<=14, toast<=42

## wired placeholder flow
splash → terms-of-service → main-menu → library → character-global → settings → credits → debug → splash
