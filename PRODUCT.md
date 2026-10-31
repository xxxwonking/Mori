# Mori UI

## Platform

web

The component library also targets native iOS, Android and HarmonyOS NEXT through uni-app x. The first inspected surface is the H5 component workbench. Native runtime verification is tracked separately, never inferred from H5.

## Stack

The user selected the uni-app ecosystem and accepted evaluating uni-app x after adding native App support. Use Vue composition APIs with TypeScript/UTS, uvue components, uni_modules distribution, and a code-led preview. Exact compiler/device verification is recorded in docs/compatibility.md.

## Users

The owner is a frontend developer building multiple unrelated mobile projects and needs reusable components without a fixed business domain.

## Product Purpose

A personal mobile component library with a consistent visual language, explicit component states and stable APIs. First implementation: buttons and form inputs, supported by switches, checkboxes and a usable component preview.

## Capabilities and Constraints

- Required target platforms: H5, WeChat mini-program, iOS App, Android App.
- HarmonyOS NEXT support is best effort by component; full coverage is not required.
- Compatibility must distinguish build verification, browser verification and device verification.
- The initial small foundation has been superseded: the user explicitly requested a general-purpose mobile component library, then rejected the 40-component scope as insufficient and selected broad, balanced coverage. The current workspace contains 72 easycom components with individual guides and runnable examples. Remaining feature and platform gaps must stay explicit in docs/component-coverage.md and docs/platform-adaptation.md.
- User explicitly requested a new folder on the Desktop and project initialization.
- Components default to following system/host appearance. A single global option must force light/dark and stop following, or restore automatic mode. This is a first-release requirement, not a future feature.

## Brand Commitments

The previously proposed clean, lightweight, themeable direction was accepted with the instruction to begin. Mori UI is a provisional working name chosen for the new folder; it may be changed.

The user subsequently rejected the green-tinted foundation and explicitly selected neutral gray + clear blue. They prefer Apple's design style, smaller typography, tighter padding, and shorter inputs/buttons. These choices supersede the earlier green palette. The user later supplied screenshots rejecting doubled input focus outlines and the host checkbox appearance. Default buttons and inputs are now 36px with 13px text and 8px corners; labels are 12px. Input actions use real icons. Checkbox owns its compact checked appearance. Switch must support independent active/inactive colors and inline state text. Selected states must transition smoothly without layout jumps. These explicit corrections override the earlier 40px baseline.

## Evidence on Hand

No business content or brand assets were supplied. All form content in the preview is sample data, stored only for the local demo. No production claims or native compatibility claims are established yet.

## Product Principles

- Reuse across unrelated projects with minimal setup.
- Keep public APIs consistent while allowing platform-specific implementations.
- Show ordinary, pressed, loading, disabled and invalid states.
- Preserve familiar platform behavior for input, keyboard and safe areas.

## Open Decisions

Final name, visual refinements, package publishing destination, minimum OS versions and signing identities remain open. First-party signing IDs and user credentials must not be invented.
