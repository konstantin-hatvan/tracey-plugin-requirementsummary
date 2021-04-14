# tracey-plugin-requirementsummary

Generates a requirement summary.
The requirement summary itself is a markdown file.
It contains a table summarizing all requirements.

## Usage

### Installation

Install the plugin

`npm install tracey-plugin-requirementsummary --save-dev`

### Tracey configuration

Add the plugin to the project configuration

```js
// tracey.config.js

const RequirementsummaryPlugin = require('tracey-plugin-requirementsummary');

module.exports = {
    plugins: [
        RequirementsummaryPlugin.plugin({ /* configuration options */ }),
    ],
};
```

### Plugin configuration

The configuration object has the following options

#### file

**Default**: `tracey-plugin-requirementsummary.md`

Use this configuration to configure the output file name and location.
