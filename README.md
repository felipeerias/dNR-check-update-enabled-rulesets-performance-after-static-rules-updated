# Declarative Net Request: disable individual static rules

## Extension to check `updateEnabledRulesets` performance with disabled rules

Context: <https://github.com/w3c/webextensions/issues/162>

This extension checks the performance of loading a ruleset when some of its rules are disabled.

Regarding the number of disabled static rules, the extension will test a range that starts at 0 and goes up to 20,000 (every rule in the ruleset).

Each test is run 100 times and the average performance is reported in `console.error`.

## How to use this extension

- Launch Chromium.
- Go to `More tools > Extensions`
- Click on `Load unpacked`
- Select the `extension` folder on this project.
- The output of the extension will be shown as log messages in the extension's `Errors` section.
