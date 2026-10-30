# Mori Form Foundation Implementation Plan

> **For agentic workers:** Use the available worker agents for bounded implementation and separate review. The referenced superpowers execution skills are not installed; use the existing project instructions and test-driven-development workflow directly.

**Goal:** Extend the existing Mori UI with working form validation, single selection, grouped multiple selection and multiline input, including an integrated demo and documented APIs.

**Architecture:** Retain uni-app x, UTS/uvue and the existing theme module. Add six easycom components and a small reusable validation module; business submission remains in the demo. Keep the existing four component contracts compatible.

**Tech Stack:** Vue composition API, UTS, uni-app x, Sass, Node built-in assertions, existing Playwright browser tooling.

## Scope and references

User selected form foundations on 2026-10-30. References: Vant (https://github.com/youzan/vant), Wot (https://github.com/Moonofweisheng/wot-design-uni and https://wot-ui.cn/component/form.html). Borrow interaction and API conventions; implement original Mori components rather than importing incompatible Web/uni-app runtimes. Preserve the grey/blue design, 36px input/button baseline, dark theme, controlled values, disabled guards and reduced-motion support.

Deliver: mori-form, mori-form-item, mori-radio, mori-radio-group, mori-checkbox-group, mori-textarea. Existing checkbox remains a boolean control. New group options use stable string values and labels, optional disabled state. Radio selection cannot clear itself; disabled groups/options do not emit; checkbox groups emit new arrays and enforce optional selection bounds. Textarea has label/hint/error, controlled string, disabled, maxlength and optional word count.

Form contract: `model: UTSJSONObject`, `rules: MoriFormRule[]`. Each rule has `name: string`, optional `required`, `minLength`, `maxLength`, `pattern: string`, `message: string`, and synchronous `validator: (value: any | null) => string` (empty string passes). Only top-level keys and synchronous rules ship in this batch. Optional empty fields skip length/pattern/custom rules; required rejects blank strings, empty arrays, null and false, but accepts zero. Return the first error per field.

`validate(): MoriValidationResult` validates all fields; `validateField(name: string): MoriValidationResult` updates just that field and preserves other errors; `clearValidate(name: string = '')` clears one/all. Results are `{ valid: boolean, errors: MoriFieldError[] }`, errors are `{ name: string, message: string }`. Validation is explicitly invoked on submit/change/blur by the consumer; no hidden deep watcher. Form emits `validate` with the result; consumers implement submission after `result.valid`.

FormItem has `name`, `label`, `required`, `hint`, `error`; explicit error overrides contextual error. It provides field context to child controls. In FormItem, Input/Textarea omit their own heading and message, and use context for accessible name/required/invalid/description. Standalone behavior is preserved. `form-context.uts` exports `useMoriField(): MoriFieldContext | null`; context exposes computed `label`, `required`, `error`, `descriptionId`. Input integration and its platform accessibility helper belong to the form worker; Textarea consumes this same context. Group controls consume this context for accessible name/invalid/describedby. The shared context file belongs only to the form worker.

Example composition: `<mori-form ref="form" :model="values" :rules="rules"><mori-form-item name="bio" label="个人介绍" required><mori-textarea v-model="values.bio" placeholder="介绍一下自己" /></mori-form-item><mori-button label="保存资料" @click="save" /></mori-form>`; `save` calls `form.value.validate()` and shows local success only when `valid` is true. Examples must use real UTS-compatible model bindings verified by the compiler.

## Chunk 1: Implementation and integration

### Task 1: Selection and multiline inputs

Files: create `uni_modules/mori-ui/components/mori-radio/mori-radio.uvue`, `mori-radio-group/mori-radio-group.uvue`, `mori-checkbox-group/mori-checkbox-group.uvue`, `mori-textarea/mori-textarea.uvue`; shared types/helpers in `uni_modules/mori-ui/selection.uts`; tests in `tests/selection.mjs`.

- [x] Write meaningful selection tests for exclusive selection, no duplicate updates, immutable arrays, disabled entries and min/max boundaries; execute and observe failure before implementation.
- [x] Implement helpers and components with semantic roles, accessible labels, keyboard operation on H5 and shared theme colors; avoid browser globals in component code.
- [x] Run `node tests/selection.mjs`; expect all behavioral assertions to pass. Report exact public APIs for demo integration.

### Task 2: Form validation and field layout

Files: create `uni_modules/mori-ui/validation.uts`, `uni_modules/mori-ui/form-context.uts`, `uni_modules/mori-ui/components/mori-form/mori-form.uvue`, `mori-form-item/mori-form-item.uvue`, and `tests/validation.mjs`.

- [x] Write failing validation cases for empty string/array, false vs zero semantics, length limits, pattern errors, per-field filtering and clearing errors. Cover stale results if asynchronous validation is introduced.
- [x] Implement UTS-compatible rules and results with field names; form owns validation state, FormItem shows contextual errors. Preserve standalone Input/Checkbox behavior.
- [x] Run `node tests/validation.mjs`; expect all assertions to pass. Document exact exposed methods, rules and return types for integration.

### Task 3: Workbench, docs and checks

Files: create `components/demo-foundation/demo-foundation.uvue`, `pages/forms/forms.uvue`, `scripts/verify-forms.mjs`; modify `pages.json`, `pages/index/index.uvue`, `package.json`, `scripts/check.mjs`, `docs/components.md`, `docs/user-guide.md`, `docs/design-references.md`, `DESIGN.md`, `.impeccable/design.json`, `docs/progress.md`, `docs/compatibility.md` and README as warranted.

- [x] Add a visible workbench entry and dedicated form demo with single choice, multiple choice, multiline input, required errors, correction and submission feedback. Include disabled and length-limit examples and theme controls.
- [x] Write browser checks before the demo implementation: invalid submission shows errors; correction clears/revalidates; radio is exclusive; multi-select produces arrays; disabled controls remain unchanged; textarea updates/counts/limits; light/dark and mobile layout work.
- [x] Update exact easycom list from four to ten exports. Wire `test:forms`, unit scripts and public API docs to actual implemented contracts.
- [x] Install locked dependencies with `npm ci`; run static check, unit tests, H5 build, existing browser suite, form browser suite and relevant motion checks. Use a free local port and inspect actual screenshots at narrow and desktop sizes.
- [x] Attempt WeChat build after H5 passes; record compiler version and actual outcomes separately from device verification. Existing local compiler is 5.26 whereas repository evidence used 5.34; resolve build issues without modifying the IDE installation, and report unsupported verification precisely.
- [x] Update progress/compatibility based only on new evidence and review the final diff for regressions. No remote push or release in this task.

## Acceptance

All six components are discoverable, documented and exercised by a working form. Existing four component behavior stays covered. Required, disabled, error, selected and dark states work; no premature success claims from static compilation. Native and WeChat device verification are explicitly left unverified unless actually executed.

Execution evidence: see docs/progress.md (2026-10-30 form foundations), docs/compatibility.md and .impeccable/review JSON. Async/nested fields and native device validation remain explicitly out of this delivery.
