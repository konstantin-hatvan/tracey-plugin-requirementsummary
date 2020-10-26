const fs = require('fs');
const path = require('path');
const remark = require('remark');
const visit = require('unist-util-visit');
const { html, link, table, tableCell, tableRow, text, root } = require('mdast-builder');

const getSynopsis = (requirement) => {
    const hasSynopsis = Object.prototype.hasOwnProperty.call(requirement, 'synopsis');

    if (!hasSynopsis) {
        console.log(`
WARNING: File ${requirement.file} has no synopsis
Fix this warning by adding a synopsis to the frontmatter or excluding the file in the configuration

`);
    }

    return hasSynopsis ? requirement.synopsis : '';
};

const createBlock = (file, requirements) => {
    const headerRow = tableRow([
        tableCell(text('Requirement')),
        tableCell(text('Synopsis')),
    ]);
    const requirementRows = requirements.map(requirement => {
        const relativeLink = path.relative(path.parse(file).dir, requirement.file);
        const linkCell = tableCell(link(relativeLink, requirement.id, text(requirement.id)));
        const synopsisCell = tableCell(text(getSynopsis(requirement)));
        return tableRow([ linkCell, synopsisCell ]);
    });

    return [
        html('<div class="tracey tracey-plugin-requirementsummary">'),
        table([null, null], [ headerRow, ...requirementRows ]),
        html('</div>'),
    ];
};

const getFileContentOrEmptyDocument = (file) => {
    if (fs.existsSync(file)) {
        return remark().parse(fs.readFileSync(file, { encoding: 'utf-8' }));
    }

    return root();
};

const updateRequirementsummary = (original, block) => {
    const ast = { ...original };
    let shouldAddRequirementssummaryToBottom = true;

    visit(ast, 'html', (node, index, parent) => {
        if (node.value === '<div class="tracey tracey-plugin-requirementsummary">' && parent) {
            parent.children.splice(index, block.length, ...block);
            shouldAddRequirementssummaryToBottom = false;
        }
    });

    if (shouldAddRequirementssummaryToBottom) {
        ast.children.push(...block);
    }

    return ast;
};

const plugin = ({ file = path.resolve('tracey-plugin-requirementsummary.md') }) => ({ requirements, tracelinks, annotations }) => {
    if (requirements.length) {
        const block = createBlock(file, requirements);
        const ast = getFileContentOrEmptyDocument(file);
        const updatedAst = updateRequirementsummary(ast, block);
        const fileContent = remark().stringify(updatedAst);

        fs.writeFileSync(file, fileContent);
    }

    return {
        requirements,
        tracelinks,
        annotations,
    };
};

module.exports = {
    plugin,
};
