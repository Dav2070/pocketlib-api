var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");

const getLatestAuthors = `${constants.apiBaseUrl}/api/1/call/authors/latest`;

describe("GetLatestAuthors endpoint", () => {
	it("should return latest authors", async () => {
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getLatestAuthors
			});
		}catch(error){
			assert.fail();
		}

		// Find all authors with a profile image
		let authors = [constants.authorUser.author];
		for(let author of constants.davUser.authors){
			if(author.profileImage) authors.push(author);
		}

		assert.equal(200, response.status);
		assert.equal(authors.length, response.data.authors.length);

		let i = 0;
		for(let author of response.data.authors){
			assert.equal(authors[i].uuid, author.uuid);
			assert.equal(authors[i].firstName, author.first_name);
			assert.equal(authors[i].lastName, author.last_name);
			assert.equal(authors[i].profileImage != null, author.profile_image);

			i++;
		}
	});
});