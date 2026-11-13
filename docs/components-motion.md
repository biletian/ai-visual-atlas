# Components and motion pass

This pass preserves the media-first gallery and all 85 source-attributed cases.

## Actual reference use
HeroUI React MCP was invoked locally: list_components, get_component_docs (SearchField, Switch, Tooltip, Toast, Button, Popover), get_docs (animation), get_theme_variables. The existing native site adapts the interaction guidance; it does **not** claim to install HeroUI React components. Configured Aceternity and OpenMotion were inspected, not executed. OpenMotion is a video-production tool, not required for these microinteractions.

## Changes
- Search focus treatment and clear action; compact accessible prompt switch.
- Anchored sort popover, selected state, outside-click and Escape dismissal.
- Shared poster transition between a card and detail; directional detail change; subtle append reveal on inner media only.
- Saved-state pulse, clear copy success, light toast, keyboard/pointer icon tooltips.
- Motion uses transform/opacity and native WAAPI/CSS. No extra animation runtime, persistent frame loop, or cloned playing videos.
- Reduced-motion disables transitions and cancels active animations. Existing limited media concurrency remains unchanged.

## Verification
Chrome local preview: sort change, search narrowing and clear, detail open, next, close, copy feedback; no JavaScript console errors. Desktop screenshot and 390×844 mobile gallery/detail visually checked. Mobile measured document width 390 (no overflow), one playing video. Desktop returned to three playing videos. Transition poster removed after finish. Node syntax checks passed.

Reduced-motion code was reviewed, not OS-preference end-to-end tested. No performance benchmark or universal browser claim is made.
