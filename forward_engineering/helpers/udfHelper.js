'use strict'
const { tab, getNameWithKeyspace } = require('./generalHelper'); 

const getParameters = (rawParameters = "") => {
	if (!rawParameters) {
		return '()';
	}
	if (typeof rawParameters !== 'string') {
		return '()';
	}

	return `(\n${tab(rawParameters.trim())}\n)`;
};

const getOnNullInput = (rawOnNullInput) => {
	return (rawOnNullInput === 'RETURNS NULL') ? 'RETURNS NULL' : 'CALLED';
};

const escapeCodeBlock = (str) => {
	const resolvedCharacters = ['\'', '$'];

	if (
		resolvedCharacters.indexOf(str[0]) !== -1
		&&
		str[0] === str[str.length - 1]
	) {
		return str;
	}

	return `$$ ${str} $$`;
};

const getCodeBlock = (rawCodeBlock) => {
	if (typeof rawCodeBlock !== 'string') {
		return escapeCodeBlock('');
	}

	return escapeCodeBlock(rawCodeBlock.trim());
};

const createStatement = ({
	keyspaceName,
	name,
	replace,
	parameters,
	onNullInput,
	returnType,
	language,
	codeBlock
}) => {
	let replaceStatement = Boolean(replace) ? 'OR REPLACE FUNCTION' : 'FUNCTION IF NOT EXISTS';

	return `CREATE ${replaceStatement} ${getNameWithKeyspace(keyspaceName, name)} ${getParameters(parameters)}\n` + 
		`${getOnNullInput(onNullInput)} ON NULL INPUT\n` + 
		`RETURNS ${returnType} LANGUAGE ${language} AS\n` +
		`${getCodeBlock(codeBlock)};`;
};

const getUdf = (keyspaceName, udfItem) => {
	if (Object(udfItem) !== udfItem) {
		return '';
	}

	return createStatement({
		name: udfItem.name,
		replace: Boolean(udfItem.replace),
		parameters: udfItem.parameters,
		onNullInput: udfItem.onNullInput,
		returnType: udfItem.returnType,
		language: udfItem.language,
		codeBlock: udfItem.storedProcFunction,
		keyspaceName
	});
};

module.exports = {
	getUdf
};
