const eleventySass = require("eleventy-sass");
const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const customHighlight = require('./custom-highlight');

const webUrl = 'https://roystan.net';

module.exports = function (eleventyConfig)
{
	eleventyConfig.addPlugin(eleventySass);
	eleventyConfig.addPassthroughCopy("src/media");
	eleventyConfig.addPassthroughCopy("src/js");
	eleventyConfig.addPassthroughCopy("src/android-chrome-192x192.png");
	eleventyConfig.addPassthroughCopy("src/favicon*");
	eleventyConfig.addPassthroughCopy("src/manifest.json");
	eleventyConfig.addPassthroughCopy("src/robots.txt");

	eleventyConfig.addFilter("date", dateObj =>
	{
		return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("yyyy / LL / dd");
	});

	// Automatically import macros on every page
	// (otherwise we need to manually include on each page that uses them)
	// https://github.com/11ty/eleventy/issues/613#issuecomment-968189433
	eleventyConfig.addCollection('everything', (collectionApi) =>
	{
		// Note: Update the path to point to your macro file
		const macroImport = `{% import "macros.njk" as macro with context %}`;
		// Note: Update the pattern below to include all files that need macros imported
		// Note: Collections don’t include layouts or includes, which still require importing macros manually
		let collection = collectionApi.getFilteredByGlob(['src/**/*.njk', 'src/**/*.md']);

		collection.forEach((item) =>
		{
			item.template.frontMatter.content = `${macroImport}\n${item.template.frontMatter.content}`
		})
		return collection;
	});


	let markdownLibrary = markdownIt({
		html: true,
		linkify: false,
		breaks: false,
		highlight: customHighlight
	});

	eleventyConfig.setLibrary("md", markdownLibrary);

	eleventyConfig.addPairedShortcode('md', (arg) =>
	{
		return markdownLibrary.render(arg);
	})

	eleventyConfig.addShortcode('fullUrl', (url) => `${webUrl}${url}`);

	eleventyConfig.addPairedShortcode('aside', (content, title, md = false) => 
	{
		content = md == false ? content : markdownLibrary.render(content);

		return `<aside>
		<div class="aside-button">
			<h4>${title}</h4>
		</div>
		<div class="aside-content">
			${content}
		</div>
	</aside>`
	});

	return {
		markdownTemplateEngine: "njk",
		dir: {
			input: "src",
			output: "dist"
		}
	};
};