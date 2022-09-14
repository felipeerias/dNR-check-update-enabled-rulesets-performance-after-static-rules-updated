# Declarative Net Request: disable individual static rules (Extension to check updateEnabledRulesets performance with disabled rules)

The extension checks the updateEnabledRulesets() performance by changing the number of disabled rules in a static ruleset.
- No disabled rule
- 10000 disabled rules
- 20000 disabled rules
- 30000 disabled rules
- 40000 disabled rules

It checks the method call performance 100 times for each case, and print the average result to the console.error

## How to use this extension

- Launch Chromium.
- Go to `More tools > Extensions`
- Click on `Load unpacked`
- Select the `extension` folder on this project.
- The output of the extension will be shown as log messages in the extension's `Errors` section.

