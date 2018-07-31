/** @module researches/imageAltTags */

const imageInText = require( "../stringProcessing/imageInText" );
const imageAlttag = require( "../stringProcessing/getAlttagContent" );
import { findTopicFormsInString } from "../researches/findKeywordFormsInString";

const isEmpty = require( "lodash/isEmpty" );

/**
 * Matches the alt-tags in the images found in the text.
 * Returns an object with the totals and different alt-tags.
 *
 * @param {Array} imageMatches Array with all the matched images in the text
 * @param {Object} topicForms The object with the keyphrase and the synonyms forms from the paper.
 * @param {string} locale The locale used for transliteration.
 * @returns {object} altProperties Object with all alt-tags that were found.
 */
const matchAltProperties = function( imageMatches, topicForms, locale ) {
	let altProperties = {
		noAlt: 0,
		withAlt: 0,
		withAltKeyword: 0,
		withAltNonKeyword: 0,
	};

	for ( let i = 0; i < imageMatches.length; i++ ) {
		const alttag = imageAlttag( imageMatches[ i ] );

		// If no alt-tag is set
		if ( alttag === "" ) {
			altProperties.noAlt++;
			continue;
		}

		// If no keyword is set, but the alt-tag is
		if ( isEmpty( topicForms.keyphraseForms ) && alttag !== "" ) {
			altProperties.withAlt++;
			continue;
		}

		const keywordMatchedInAltTag = findTopicFormsInString( topicForms, alttag, true, locale );

		if ( keywordMatchedInAltTag.countWordMatches === 0 && alttag !== "" ) {
			// Match for keywords?
			altProperties.withAltNonKeyword++;
			continue;
		}

		if ( keywordMatchedInAltTag.countWordMatches > 0 ) {
			altProperties.withAltKeyword++;
			continue;
		}
	}

	return altProperties;
};

/**
 * Checks the text for images, checks the type of each image and alt attributes for containing keywords
 *
 * @param {Paper} paper The paper to check for images
 * @returns {object} Object containing all types of found images
 */
module.exports = function( paper ) {
	return matchAltProperties( imageInText( paper.getText() ), paper.getTopicForms(), paper.getLocale() );
};
