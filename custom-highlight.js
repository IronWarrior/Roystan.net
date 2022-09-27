const prism = require("prismjs");
const loadLanguages = require('prismjs/components/');

loadLanguages(['cs']);

const codeMap = {
	"/+" : "added",
	"/-" : "removed",
	"/~" : "modified"
}

module.exports = function(str, lang)
{
	const splits = str.split(/\r?\n/);

	var fullResolved = "";

	for (var i = 0; i < splits.length; i++)
	{
		var resolved = resolveLine(splits[i], lang);

		fullResolved += resolved;

		if (i != splits.length - 1)
			fullResolved += "\n";
	}

	return fullResolved;
}

function resolveLine(str, lang)
{
	if (str.length < 3)
	{
		return prism.highlight(str, prism.languages[lang], lang);
	}

	var resolved = "";

	var state = { index: -2, pushed: false, code: "" };

	for (var i = 0; i < str.length - 1; i++) 
	{
		var sub = str.substring(i, i + 2);

		if (sub in codeMap)
		{
			if (state.pushed && sub != state.code)
				throw `Mismatched codes: found ${sub} for opening ${state.code} for line '${str}.'`;

			const delta = i - state.index;

			if (state.pushed || delta > 2)
			{
				const extracted = str.substring(state.index, i);
				const highlighted = prism.highlight(extracted, prism.languages[lang], lang);
				const result = !state.pushed ? highlighted : addTag(highlighted, state.code);

				resolved += result;
			}

			state.index = i + 2;
			state.pushed = !state.pushed;

			if (state.pushed)
				state.code = sub;
		}
		else if (i == str.length - 2)
		{
			if (!state.pushed || state.index == 2)
			{
				const extracted = str.substring(state.index, i + 2);
				const highlighted = prism.highlight(extracted, prism.languages[lang], lang);
				const result = !state.pushed ? highlighted : addTag(highlighted, state.code);

				resolved += result;
			}
			else
			{
				throw `Reached end of line without finding closing ${state.code} code for line '${str}.'`;
			}
		}
	}

	return resolved;
}

function addTag(str, code)
{
	return `<span class="${codeMap[code]}">${str}</span>`;
}