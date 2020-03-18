var assert = require('assert');
var axios = require('axios');
var constants = require("../constants");

const getStoreBooksInReviewEndpointUrl = `${constants.apiBaseUrl}/api/1/call/store/books/review`;

describe("GetStoreBooksInReview endpoint", () => {
	it("should not return store books in review without jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBooksInReviewEndpointUrl
			});
		}catch(error){
			assert.equal(400, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(2101, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return store books in review with invalid jwt", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBooksInReviewEndpointUrl,
				headers: {
					Authorization: "asdasdasd"
				}
			});
		}catch(error){
			assert.equal(401, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1302, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return store books in review if jwt is for another app", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBooksInReviewEndpointUrl,
				headers: {
					Authorization: constants.davClassLibraryTestUserTestAppJWT
				}
			});
		}catch(error){
			assert.equal(403, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1102, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should not return store books in review if the user is not an admin", async () => {
		try{
			await axios.default({
				method: 'get',
				url: getStoreBooksInReviewEndpointUrl,
				headers: {
					Authorization: constants.authorUser.jwt
				}
			});
		}catch(error){
			assert.equal(403, error.response.status);
			assert.equal(1, error.response.data.errors.length);
			assert.equal(1102, error.response.data.errors[0].code);
			return;
		}

		assert.fail();
	});

	it("should return store books in review", async () => {
		let response;

		try{
			response = await axios.default({
				method: 'get',
				url: getStoreBooksInReviewEndpointUrl,
				headers: {
					Authorization: constants.davUser.jwt
				}
			});
		}catch(error){
			assert.fail();
		}

		// Find all store books in review
		let storeBooks = [];
		for(let collection of constants.authorUser.author.collections){
			for(let storeBook of collection.books){
				if(storeBook.status == "review"){
					storeBooks.push(storeBook);
				}
			}
		}

		for(let author of constants.davUser.authors){
			for(let collection of author.collections){
				for(let storeBook of collection.books){
					if(storeBook.status == "review"){
						storeBooks.push(storeBook);
					}
				}
			}
		}

		assert.equal(200, response.status);
		assert.equal(storeBooks.length, response.data.books.length);

		let i = 0;
		for(let book of response.data.books){
			assert.equal(storeBooks[i].uuid, book.uuid);
			assert.equal(storeBooks[i].title, book.title);
			assert.equal(storeBooks[i].description, book.description);
			assert.equal(storeBooks[i].language, book.language);
			assert.equal(storeBooks[i].status, book.status);
			assert.equal(storeBooks[i].cover != null, book.cover);
			assert.equal(storeBooks[i].file != null, book.file);

			i++;
		}
	});
});