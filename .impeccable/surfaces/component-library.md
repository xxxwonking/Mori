# Component library

Primary target: uni_modules/mori-ui/theme.uts
Related targets: uni_modules/mori-ui/components, uni_modules/mori-ui/styles, pages/index/workbench.scss
Mode: Operate

## Direction contract

THESIS: Apply the user's specified shadcn neutral appearance to the existing 88 reusable uni-app x components. This is a specified reference, not an open visual direction round.

OWN-WORLD: Black/white actions, neutral surfaces and borders, restrained depth, small control corners, pill badges, segmented tabs and clear text hierarchy. Preserve 36px controls, 13px text, 12px labels, system fonts and Lucide icons.

STORY: Developers inspect and use the same real components in the workbench, documentation previews and their own projects. Shared runtime tokens must carry the change.

FIRST VIEWPORT: Existing component examples retain their content and layout while showing primary, secondary, outline, text, disabled and loading treatments together. Both themes remain legible.

SIGNATURE INTERACTION: Theme changes update controls together; switch and checkbox transitions stay smooth with stable dimensions. Inputs retain one closed 1px border, including focus and error states.

QUALITY BAR: Reference shadcn official new-york-v4 components; retain native affordances, custom colors, auto/light/dark behavior, and WEB-only browser enhancements. Validate real H5 desktop/mobile rendering and WeChat compilation; do not infer native device results.

Seed: omitted because the user explicitly specified shadcn and confirmed black/white neutral. No generated comp.
